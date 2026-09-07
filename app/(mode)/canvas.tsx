import React, { useEffect, useState, useContext, useCallback } from "react";
import { ActivityIndicator, StyleSheet, View, Text, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Asset } from "expo-asset";
import { File, Paths } from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import { CopilotStep, walkthroughable, useCopilot } from "react-native-copilot";

import { Colors } from "@/config/colors";
import { globalDataContext } from "@/app/_layout";
import { ModeContext } from "@/app/(mode)/_layout";
import { useCustomAlert } from "@/components/main/customAlert";
import CanvasComponent from "@/components/exercise/canvas/canvasComponent";
import DataCanvasGenerator from "@/components/exercise/canvas/dataCanvasGenerator";
import TeksHighlight from "@/components/exercise/textHighlighter";
import UpdateSkorAndLevel from "@/components/exercise/updateSkorAndLevel";

const CopilotView = walkthroughable(View);

let loadTensorflowModel: any = null;
let NitroModules: any = null;

if (Platform.OS !== 'web') {
  loadTensorflowModel = require("react-native-fast-tflite").loadTensorflowModel;
  NitroModules = require("react-native-nitro-modules").NitroModules;
}

export default function Canvas() {
  const router = useRouter();
  const { user, setUser } = useContext(globalDataContext);
  const { setProgress, setOnHelpPress } = useContext(ModeContext);
  const { showAlert } = useCustomAlert();
  const { start, stop } = useCopilot();

  const { question, level: levelParam, poin: poinParam } = useLocalSearchParams<{ 
    question: string; 
    level: string; 
    poin: string; 
  }>();

  const level = levelParam ? Number(levelParam) : 1;
  const poin = poinParam ? Number(poinParam) : 0;

  const [loading, setLoading] = useState<boolean>(false);
  const [boxedModel, setBoxedModel] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [dataLevel, setDataLevel] = useState<any[] | null>(null);

  const handleStartWalkthrough = useCallback(() => {
    requestAnimationFrame(() => {
      try {
        stop();
      } catch (e) {
      }
      setTimeout(() => {
        start().catch(() => {});
      }, 50);
    });
  }, [start, stop]);

  useEffect(() => {
    if (setOnHelpPress) {
      setOnHelpPress(() => handleStartWalkthrough);
    }
    return () => {
      if (setOnHelpPress) setOnHelpPress(null);
    };
  }, [setOnHelpPress, handleStartWalkthrough]);

  useEffect(() => {
    if (dataLevel || !question) return;
    const questionProcessed = DataCanvasGenerator(question);
    setDataLevel(questionProcessed);
  }, [question]);

  useEffect(() => {
    async function loadModel() {
      try {
        if (Platform.OS === 'web') return;
        const asset = Asset.fromModule(require("@/assets/model/model.tflite"));
        await asset.downloadAsync();
        
        let modelPath = asset.localUri || asset.uri;

        if (modelPath && !modelPath.startsWith("file://")) {
          const targetFile = new File(Paths.document, 'model.tflite');
          await File.downloadFileAsync(modelPath, targetFile);
          modelPath = targetFile.uri;
        }
        
        const tfliteModel = await loadTensorflowModel({url: modelPath}, []);

        if (!tfliteModel) {
          showAlert({
            title: "ErrorCanvas", 
            message: "Error while load model:" + tfliteModel,
            confirmText:"OK"
          });
        }

        const boxed = NitroModules.box(tfliteModel);
        setBoxedModel(boxed);
      } catch (error) {
        const errorMessage = String(error);
        showAlert({
          title: "ErrorLoadModel",
          message: typeof errorMessage === "string" ? errorMessage : "Gagal Load Model Tflite Aksara Jawa",
          confirmText: "OK",
        });
      }
    }

    loadModel();
  }, []);

  useEffect(() => {
    if (!dataLevel || !activeIndex) return;

    const progress = (activeIndex / dataLevel.length) * 100;
    setProgress(progress);

    const finalProses = async () => {
      try {
        const data = await UpdateSkorAndLevel({user, setUser, poin, level: level + 1});

        if (data) {
          showAlert({
            title: "SELAMAT!",
            message: "Anda telah berhasil menyelesaikan tantangan pada level ini",
            confirmText: "OK",
            onConfirmPressed: () => {
              setTimeout(() => {
                router.replace("/(tabs)");
              }, 250);
            },
          });
        }
      } catch (err) {
        if (!err) return;
        const errorMessage = String(err); 
        showAlert({
          title: "ErrorCanvas",
          message: errorMessage,
          confirmText: "OK",
          onConfirmPressed: () => {
            setTimeout(() => {
              router.replace("/(tabs)");
            }, 250);
          },
        });
      }
    };

    if (activeIndex >= dataLevel.length) {
      if (user?.level != level) {
        showAlert({
          title: "SELAMAT!",
          message: "Anda telah berhasil menyelesaikan tantangan ini, namun poin dan level tidak di update karena anda perna menyelesaikan tantangan ini.",
          confirmText: "OK",
          onConfirmPressed: () => {
            setTimeout(() => {
              router.replace("/(tabs)");
            }, 250);
          },
        });
      } else {
        finalProses();
      }
      return;
    }
  }, [activeIndex, dataLevel]);

  return (
    <View style={styles.container}>
      {/* Step 1: Soal / Tantangan */}
      <CopilotStep
        text="Bagian ini menampilkan kalimat atau kata yang harus kamu terjemahkan dan tulis ke dalam Aksara Jawa."
        order={1}
        name="questionCardStep"
      >
        <CopilotView style={styles.cardQuestion}>
          <Text style={styles.labelQuestion}>Tuliskan ke Aksara Jawa :</Text>
          <TeksHighlight kalimat={question} indexActive={activeIndex} />
        </CopilotView>
      </CopilotStep>

      {/* Step 2: Panduan Menulis */}
      <CopilotStep
        text="Baca panduan ini untuk mengetahui urutan penulisan aksara dasar dan sandhangan yang benar."
        order={2}
        name="guideContainerStep"
      >
        <CopilotView style={styles.guideContainer}>
          <Ionicons name="bulb" size={20} color={Colors.gold} style={styles.guideIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.guideTitle}>Panduan Menulis</Text>
            <Text style={styles.guideText}>
              Selalu mulai dengan menggambar aksara dasar (nglegena) pada sentuhan pertama, kemudian lanjutkan dengan menggambar sandhangan penyertanya.
            </Text>
          </View>
        </CopilotView>
      </CopilotStep>

      {loading && (
        <ActivityIndicator
          size="large"
          color={Colors.orange}
          style={styles.loading}
        />
      )}

      {/* Step 3: Canvas Menulis */}
      <View style={styles.canvasContainer}>
        {dataLevel && (
          <CopilotStep
            text="Goreskan jarimu di area kanvas ini untuk menggambar Aksara Jawa sesuai petunjuk."
            order={3}
            name="canvasAreaStep"
          >
            <CopilotView style={{ flex: 1 }}>
              <CanvasComponent
                boxedModel={boxedModel}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                setLoading={setLoading}
                dataActive={
                  Object.values(dataLevel[activeIndex] || {})[0] as string[]
                }
              />
            </CopilotView>
          </CopilotStep>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 10,
    paddingBottom: 20,
  },
  cardQuestion: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  labelQuestion: {
    fontSize: 16,
    color: Colors.textDark,
    opacity: 0.8,
    marginBottom: 8,
    fontFamily: 'Fraunces-Bold',
  },
  guideContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingHorizontal: 4,
  },
  guideIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 2,
  },
  guideText: {
    fontSize: 12,
    color: Colors.textDark,
    opacity: 0.7,
    lineHeight: 16,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    zIndex: 10,
  },
  canvasContainer: {
    flex: 1,
  },
});