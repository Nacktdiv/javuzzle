import React, { useEffect, useState, useContext } from "react";
import { ActivityIndicator, StyleSheet, View, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Asset } from "expo-asset";
import { File, Directory, Paths } from "expo-file-system";

let loadTensorflowModel: any = null;
let NitroModules: any = null;

if (Platform.OS !== 'web') {
  loadTensorflowModel = require("react-native-fast-tflite").loadTensorflowModel;
  NitroModules = require("react-native-nitro-modules").NitroModules;
}
// import { loadTensorflowModel } from "react-native-fast-tflite";
// import { NitroModules } from "react-native-nitro-modules";
import { globalDataContext } from "../_layout";
import { ModeContext } from "./_layout";
import { useCustomAlert } from "@/components/main/customAlert";
import CanvasComponent from "@/components/exercise/canvas/canvasComponent";
import DataCanvasGenerator from "@/components/exercise/canvas/dataCanvasGenerator";
import TeksHighlight from "@/components/exercise/textHighlighter";
import UpdateSkorAndLevel from "@/components/exercise/updateSkorAndLevel";

export default function Canvas() {
  const router = useRouter();
  const { user, setUser } = useContext(globalDataContext)
  const { setProgress } = useContext(ModeContext)
  const { showAlert } = useCustomAlert();
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
  console.log(dataLevel)

  useEffect(() => {
    if (dataLevel || !question) return;
    const questionProcessed = DataCanvasGenerator(question);
    setDataLevel(questionProcessed);
  }, [question]);

  useEffect(() => {
    async function loadModel() {
      try {
        if (Platform.OS === 'web') return;
        console.log("=== MEMULAI AMBIL ASET ===");
        const asset = Asset.fromModule(require("@/assets/model/model.tflite"));
        await asset.downloadAsync();
        
        let modelPath = asset.localUri || asset.uri;
        console.log("Path awal dari Expo Asset:", modelPath);

        if (modelPath && !modelPath.startsWith("file://")) {
          const targetFile = new File(Paths.document, 'model.tflite');
          
          console.log("Deteksi mode rilis. Menyalin biner ke sandbox...");
          // Gunakan downloadFileAsync sesuai validasi compiler Anda
          await File.downloadFileAsync(modelPath, targetFile);
          
          modelPath = targetFile.uri;
        }

        console.log("Memuat ke TFLite dengan Path Akhir:", modelPath);
        
        // Gunakan fungsi bawaan Anda kembali: loadTensorflowModel
        const tfliteModel = await loadTensorflowModel({url: modelPath}, []);
        console.log("Hasil return dari loadTensorflowModel:", tfliteModel);

        if (!tfliteModel) {
          console.warn("⚠️ Model ter-load tapi mengembalikan nilai null. Memeriksa NitroModules...");
        }

        const boxedModel = NitroModules.box(tfliteModel);
        setBoxedModel(boxedModel);
        console.log("🎉 Proses Boxing Selesai. Model siap digunakan!");
      } catch (error) {
        console.error("❌ Terjadi Error pada Alur Pemuatan Model:", error);
        showAlert({
          title: "ErrorLoadModel",
          message:
            typeof error === "string"
              ? error
              : "Gagal Load Model Tflite Aksara Jawa",
          confirmText: "OK",
        });
      }
    }

    loadModel();
  }, []);

  useEffect(() => {
    if (!dataLevel || !activeIndex) return;

    const progress = (activeIndex + 1) / dataLevel.length * 100

    setProgress(progress)

    if (activeIndex >= dataLevel.length) {
      const finalProses = async () => {
        try {

          const data = await UpdateSkorAndLevel({user, setUser, poin, level : level + 1})

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
          if (!err) return 
          const errorMessage = String(err) 
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
      }
      finalProses()
    }
  }, [activeIndex, dataLevel]);

  return (
    <View style={styles.container}>
      <View style={styles.upContainer}>
        <View style={styles.textContainer}>
          <TeksHighlight kalimat={question} indexActive={activeIndex} />
        </View>
        {loading && (
          <ActivityIndicator
            size="large"
            color="#00ff00"
            style={{ marginTop: 20 }}
          />
        )}
      </View>
      <View style={styles.downContainer}>
        {dataLevel && (
          <CanvasComponent
            boxedModel={boxedModel}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            setLoading={setLoading}
            dataActive={
              Object.values(dataLevel[activeIndex] || {})[0] as string[]
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  upContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  textContainer: {
    backgroundColor: "#FFECC8",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  downContainer: {
    width: "100%",
    aspectRatio: "3/4",
  },
});
