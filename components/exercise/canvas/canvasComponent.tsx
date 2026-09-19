import React, { useMemo, useRef, useState } from "react";
import { PanResponder, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Canvas, Path, Rect, Skia, useCanvasRef } from "@shopify/react-native-skia";
import { CopilotStep, walkthroughable } from "react-native-copilot";

import { useCustomAlert } from "@/components/main/customAlert";
// import { AnalyzeImageBuffer, MakeImageBufferPerPiece, MakeImageBufferFullCanvas } from "./canvasMultiAnalyze";
import { Colors } from "@/config/colors";

const CopilotView = walkthroughable(View);
const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);

type CanvasType = {
  boxedModel: any;
  activeIndex: number;
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
                updated[updated.length - 1] = currentPathRef.current.toSVGString();
              }
              return updated;
            });
          }
        },

        onPanResponderRelease: () => {
          currentPathRef.current = null;
        },
      }),
    []
  );

  const handleClearCanvas = () => {
    setPaths([]);
    if (currentPathRef.current) {
      currentPathRef.current = null;
    }
  };

  const handleAnalyzeCanvas = async () => {
    if (paths.length === 0) {
      showAlert({
        title: "KANVAS KOSONG",
        message: "Silakan gambar aksara terlebih dahulu pada area kanvas!",
        confirmText: "OK",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleClearCanvas();
      setActiveIndex((prev) => prev + 1);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <CopilotStep
        text="Gambar aksara Jawa yang diminta dengan menggoreskan jarimu di dalam area kotak kanvas ini."
        order={3}
        name="canvasDrawAreaStep"
      >
        <CopilotView
          style={styles.canvasWrapper}
          {...panResponder.panHandlers}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setCanvasDimensions({ width, height });
          }}
        >
          <Canvas ref={canvasRef} style={styles.canvas}>
            <Rect x={0} y={0} width={1000} height={1000} color="#FFFFFF" />
            {paths.map((svgString, index) => (
              <Path
                key={index}
                path={svgString}
                color="#000000"
                style="stroke"
                strokeWidth={8}
                strokeCap="round"
                strokeJoin="round"
              />
            ))}
          </Canvas>

          {paths.length === 0 && (
            <View style={styles.placeholderContainer} pointerEvents="none">
              <Text style={styles.placeholderText}>Gambar aksara di sini...</Text>
            </View>
          )}
        </CopilotView>
      </CopilotStep>

      <View style={styles.buttonContainer}>
        <CopilotStep
          text="Tekan tombol Reset jika kamu ingin menghapus seluruh goresan di kanvas dan mengulangnya dari awal."
          order={4}
          name="resetButtonStep"
        >
          <CopilotTouchableOpacity style={styles.resetButton} onPress={handleClearCanvas}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </CopilotTouchableOpacity>
        </CopilotStep>

        <CopilotStep
          text="Tekan tombol Analisis setelah selesai menggambar untuk memeriksa ketepatan tulisan Aksara Jawamu."
          order={5}
          name="analyzeButtonStep"
        >
          <CopilotTouchableOpacity style={styles.analyzeButton} onPress={handleAnalyzeCanvas}>
            <Text style={styles.analyzeButtonText}>Analisis</Text>
          </CopilotTouchableOpacity>
        </CopilotStep>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  canvasWrapper: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#EFE2CE",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    position: "relative",
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  canvas: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#D1C2A5",
    fontSize: 18,
    fontFamily: "Fraunces-Bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#FFF8EE",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2D1B8",
  },
  resetButtonText: {
    fontSize: 18,
    fontFamily: "Fraunces-Bold",
    color: Colors.textDark,
  },
  analyzeButton: {
    flex: 1.5,
    backgroundColor: Colors.orange,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  analyzeButtonText: {
    fontSize: 18,
    fontFamily: "Fraunces-Bold",
    color: "#FFFFFF",
  },
});