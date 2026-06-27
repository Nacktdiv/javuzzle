import React, { useMemo, useRef, useState } from "react";
import { PanResponder, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Canvas, Path, Rect, Skia, useCanvasRef,} from "@shopify/react-native-skia";

import { useCustomAlert } from "../../main/customAlert";
import { AnalyzeImageBuffer, MakeImageBufferPerPiece } from "./canvasMultiAnalyze";

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
    if (!boxedModel) {
      return;
    }
    if (paths.length === 0) {
      return;
    }

    const model = boxedModel.unbox()

    setLoading(true);
    try {
      const daftarPixelBuffer: Uint8Array[] = [];

      for (let i = 0; i < paths.length; i++) {
        const { pixelBuffer } = MakeImageBufferPerPiece(
          paths[i],
          canvasDimensions.width,
          canvasDimensions.height,
        );

        daftarPixelBuffer.push(pixelBuffer);
      }

      const daftarHasilPrediksi: string[] = [];

      for (let i = 0; i < daftarPixelBuffer.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 150));

        const hasil = await AnalyzeImageBuffer(daftarPixelBuffer[i], model);
        daftarHasilPrediksi.push(hasil.prediction);
      }

      const cekKebenaran = dataActive.every((item) =>
        daftarHasilPrediksi.includes(item),
      );

      if (cekKebenaran) {
        setLoading(false);
        setActiveIndex((prev) => activeIndex + 1);
      } else {
        setLoading(false);
        showAlert({
          title: "COBA LAGI!",
          message:
            "Tulisan/garis yang anda buat kurang bagus dan rapi silahkan anda tulis kembali",
          confirmText: "OK",
        });
      }
    } catch (err) {
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
    backgroundColor: "#cb9163",
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
    backgroundColor: "#cb9163",
    width: 150,
    height: 65,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 21,
    fontFamily: 'Fraunces-Bold',
    color: "#6f411d",
  },
});
