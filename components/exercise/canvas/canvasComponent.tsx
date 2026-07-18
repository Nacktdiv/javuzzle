import React, { useMemo, useRef, useState } from "react";
import { PanResponder, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Canvas, Path, Rect, Skia, useCanvasRef,} from "@shopify/react-native-skia";

import { useCustomAlert } from "@/components/main/customAlert";
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

      const daftarHasilPrediksi: {
        prediction: string;
        confidence: number;
      }[][] = [];

      for (let i = 0; i < daftarPixelBuffer.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 150));

        const hasil = await AnalyzeImageBuffer(daftarPixelBuffer[i], model);
        daftarHasilPrediksi.push(hasil);
      }

      // const cekKebenaran = dataActive.every((item) =>
      //   daftarHasilPrediksi.includes(item),
      // );
      const checker : any[] = [] 
      dataActive.every(item => {
        for (let i = 0; i < daftarHasilPrediksi.length; i++){
          let status = false
          for (let k = 0; k < daftarHasilPrediksi[i].length; k++){
            if (daftarHasilPrediksi[i][k].prediction === item) {
              checker.push({aksara : item, lokasi : [i, k]})
              if (k == 1) status = true
              break
            }
          }
          if (status) break
          checker.push({aksara : item, lokasi : [i, -1]})
        }
      })

      let cekKebenaran = false
      checker.map(item => {
        if (item.lokasi[1] == 0) cekKebenaran = true
      })

      if (cekKebenaran) {
        setLoading(false);
        setActiveIndex((prev) => activeIndex + 1);
      } else {
        let messageList : string[] = []
        checker.map(item => {
          if (item.lokasi[1] == 0) {
            messageList.push(`Tulisan untuk aksara ${item.aksara} sudah bagus. `)
          } else if (item.lokasi[1] == -1){
            messageList.push(`Tulisan yang kamu buat untuk aksara ${item.aksara} itu salah. `)
          } else {
            messageList.push(`Tulisan yang kamu buat untuk aksara ${item.aksara} kurang rapi. `)
          }
        })
        const gabunganMessage = messageList.join('');
        setLoading(false);
        showAlert({
          title: "COBA LAGI!",
          message:
            `${gabunganMessage}Semangat silahkan coba lagi`,
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
