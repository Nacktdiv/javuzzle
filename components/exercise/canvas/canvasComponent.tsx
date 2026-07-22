import React, { useMemo, useRef, useState } from "react";
import { PanResponder, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Canvas, Path, Rect, Skia, useCanvasRef,} from "@shopify/react-native-skia";

import { useCustomAlert } from "@/components/main/customAlert";
import { AnalyzeImageBuffer, MakeImageBufferPerPiece, MakeImageBufferFullCanvas } from "./canvasMultiAnalyze";

import { Colors } from "@/config/colors";

type CanvasType = {
  boxedModel: any;
  activeIndex: number
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  dataActive: string[];
};

export default function CanvasComponent({ boxedModel, activeIndex, setActiveIndex, setLoading, dataActive }: CanvasType) {
  const { showAlert } = useCustomAlert();
  const canvasRef = useCanvasRef();

  const currentPathRef = useRef<any>(null);

  const [paths, setPaths] = useState<string[]>([]);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 300,
    height: 300,
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,

        onPanResponderGrant: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          const newPath = Skia.Path.Make();
          newPath.moveTo(locationX, locationY);
          currentPathRef.current = newPath;
          setPaths((prev) => [...prev, newPath.toSVGString()]);
        },

        onPanResponderMove: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          if (currentPathRef.current) {
            currentPathRef.current.lineTo(locationX, locationY);
            setPaths((prev) => {
              const updated = [...prev];
              if (updated.length > 0 && currentPathRef.current) {
                updated[updated.length - 1] =
                  currentPathRef.current.toSVGString();
              }
              return updated;
            });
          }
        },

        onPanResponderRelease: () => {
          currentPathRef.current = null;
        },
      }),
    [],
  );

  const handleClearCanvas = () => {
    setPaths([]);
    if (currentPathRef.current) {
      currentPathRef.current = null;
    }
  };

  const handleAnalyzeCanvas = async () => {
    if (!boxedModel || paths.length === 0) return;

    const model = boxedModel.unbox();
    setLoading(true);

    try {
      // ------------------------------------------------------------------------
      // SKENARIO 1: HANYA 1 PATH (Langsung Full Canvas)
      // ------------------------------------------------------------------------
      if (paths.length === 1) {
        const { pixelBuffer } = MakeImageBufferFullCanvas(
          paths,
          canvasDimensions.width,
          canvasDimensions.height
        );
        // Beri sedikit jeda waktu sebelum analisis
        await new Promise((resolve) => setTimeout(resolve, 150));
        const hasilPrediksi = await AnalyzeImageBuffer(pixelBuffer, model);

        console.log(hasilPrediksi)

        const messageList: string[] = [];
        let isAllCorrect = true;

        // Evaluasi hasil prediksi terhadap setiap target di dataActive
        dataActive.forEach((targetAksara) => {
          const foundIndex = hasilPrediksi.findIndex(
            (res) => res.prediction === targetAksara
          );

          if (foundIndex === 0) {
            messageList.push(`Tulisan untuk aksara ${targetAksara} sudah bagus. `);
          } else if (foundIndex > 0) {
            isAllCorrect = false;
            messageList.push(`Tulisan yang kamu buat untuk aksara ${targetAksara} kurang rapi. `);
          } else {
            isAllCorrect = false;
            messageList.push(`Aksara ${targetAksara} yang kamu gambar salah. `);
          }
        });

        setLoading(false);

        if (isAllCorrect) {
          setActiveIndex((prev) => prev + 1);
        } else {
          showAlert({
            title: "COBA LAGI!",
            message: `${messageList.join('')}Semangat silahkan coba lagi!`,
            confirmText: "OK",
          });
        }

        return; // Selesai untuk skenario 1
      }

      // ------------------------------------------------------------------------
      // SKENARIO 2: LEBIH DARI 1 PATH (Gunakan Per-Piece + Full Canvas)
      // ------------------------------------------------------------------------
      const daftarPixelBuffer: Uint8Array[] = [];

      // 1. Ekstrak buffer per-piece (setiap stroke individual)
      for (let i = 0; i < paths.length; i++) {
        const { pixelBuffer } = MakeImageBufferPerPiece(
          paths[i],
          canvasDimensions.width,
          canvasDimensions.height
        );
        daftarPixelBuffer.push(pixelBuffer);
      }

      // 2. Ekstrak buffer full-piece (seluruh stroke digabung)
      const { pixelBuffer: fullBuffer } = MakeImageBufferFullCanvas(
        paths,
        canvasDimensions.width,
        canvasDimensions.height
      );
      daftarPixelBuffer.push(fullBuffer);

      // 3. Analisis seluruh image buffer yang terkumpul
      const daftarHasilPrediksi: { prediction: string; confidence: number }[][] = [];

      for (let i = 0; i < daftarPixelBuffer.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        const hasil = await AnalyzeImageBuffer(daftarPixelBuffer[i], model);
        daftarHasilPrediksi.push(hasil);
      }

      console.log(daftarHasilPrediksi);

      // 4. Evaluasi hasil terhadap dataActive (Soal/Target Aksara)
      const messageList: string[] = [];
      let isAllCorrect = true;

      dataActive.forEach((targetAksara) => {
        // Cari posisi targetAksara terbaik dari semua hasil prediksi buffer
        let bestRank = -1; // -1 = tidak ditemukan, 0 = paling tepat, >0 = kurang rapi

        for (let i = 0; i < daftarHasilPrediksi.length; i++) {
          const predList = daftarHasilPrediksi[i];
          const rank = predList.findIndex((item) => item.prediction === targetAksara);

          if (rank !== -1) {
            if (bestRank === -1 || rank < bestRank) {
              bestRank = rank;
            }
          }
        }

        // Tentukan status berdasarkan rank terbaik yang terdeteksi
        if (bestRank === 0) {
          messageList.push(`Tulisan untuk aksara ${targetAksara} sudah bagus. `);
        } else if (bestRank > 0) {
          isAllCorrect = false;
          messageList.push(`Tulisan yang kamu buat untuk aksara ${targetAksara} kurang rapi. `);
        } else {
          isAllCorrect = false;
          messageList.push(`Aksara ${targetAksara} tidak ditemukan atau salah. `);
        }
      });

      setLoading(false);

      if (isAllCorrect) {
        setActiveIndex((prev) => prev + 1);
      } else {
        showAlert({
          title: "COBA LAGI!",
          message: `${messageList.join('')}Semangat silahkan coba lagi!`,
          confirmText: "OK",
        });
      }
    } catch (err) {
      setLoading(false);

      console.error("DETAIL ERROR ANALYSIS:", err);

      showAlert({
        title: "ErrorMultiAnalyze",
        message:
          typeof err === "string"
            ? err
            : "Gagal menganalisis tulisan canvas aksara jawa",
        confirmText: "OK",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.canvasWrapper}
        {...panResponder.panHandlers}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setCanvasDimensions({ width, height });
        }}
      >
        <Canvas ref={canvasRef} style={styles.canvas}>
          <Rect x={0} y={0} width={1000} height={1000} color="#fff" />
          {paths.map((svgString, index) => (
            <Path
              key={index}
              path={svgString}
              color="#000"
              style="stroke"
              strokeWidth={10}
              strokeCap="round"
              strokeJoin="round"
            />
          ))}
        </Canvas>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleClearCanvas}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAnalyzeCanvas}>
          <Text style={styles.buttonText}>Analyze</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  canvasWrapper: {
    width: "100%",
    aspectRatio: "1/1",
    borderRadius: 20,
    backgroundColor: Colors.border,
    padding: 10,
    overflow: "hidden",
  },
  canvas: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.gold,
    width: 150,
    height: 65,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 21,
    fontFamily: 'Fraunces-Bold',
    color: Colors.text,
  },
});
