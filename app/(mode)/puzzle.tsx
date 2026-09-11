import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CopilotStep, walkthroughable, useCopilot } from "react-native-copilot";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

import { Colors } from "@/config/colors";
import { globalDataContext } from "@/app/_layout";
import { ModeContext } from "@/app/(mode)/_layout";
import { useCustomAlert } from "@/components/main/customAlert";
import { ComponentType, TilesType } from "@/components/material/dataMateri";
import TeksHighlight from "@/components/exercise/textHighlighter";
import DataPuzzleGenerator from "@/components/exercise/puzzle/dataPuzzleGenerator";
import RandomTilesGenerator from "@/components/exercise/puzzle/randomTilesGenerator";
import GridTilesGenerator from "@/components/exercise/puzzle/gridTilesGenerator";
import UpdateSkorAndLevel from "@/components/exercise/updateSkorAndLevel";

const CopilotView = walkthroughable(View);
const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);

import util from 'util';

export default function PuzzleMode() {
  const router = useRouter();
  const { user, setUser } = useContext(globalDataContext);
  const { setProgress, setOnHelpPress } = useContext(ModeContext);
  const { showAlert } = useCustomAlert();
  const { start, stop } = useCopilot();

  const { question, level: levelParam, poin: poinParam, audio: audioParam } = useLocalSearchParams<{
    question: string;
    level: string;
    poin: string;
    audio?: any;
  }>();

  const level = levelParam ? Number(levelParam) : 1;
  const poin = poinParam ? Number(poinParam) : 0;

  const [dataLevel, setDataLevel] = useState<any[] | null>(null);
  const [activePart, setActivePart] = useState<number>(0);
  const [gridItems, setGridItems] = useState<TilesType[]>([]);
  const [chooseComponent, setChooseComponent] = useState<TilesType[]>([]);
  const [requiredSlotCount, setRequiredSlotCount] = useState<number>(4);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const soundRef = useRef<Audio.Sound | null>(null);

  // Helper untuk menghentikan audio secara aman
  const stopAndUnloadSound = async () => {
    if (soundRef.current) {
      try {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        }
      } catch (e) {
        // Safe ignore
      } finally {
        soundRef.current = null;
        setIsPlayingAudio(false);
      }
    }
  };

  // Bersihkan audio saat komponen unmount
  useEffect(() => {
    return () => {
      stopAndUnloadSound();
    };
  }, []);

  // Fungsi untuk memutar audio soal
  const handlePlayAudio = async () => {
    if (!audioParam) return;

    try {
      await stopAndUnloadSound();
      setIsPlayingAudio(true);

      let audioSource: any;

      // 1. Jika param berupa string angka dari URL (misal: "170"), konversi ke Number
      if (typeof audioParam === "string" && !isNaN(Number(audioParam))) {
        audioSource = Number(audioParam);
      } 
      // 2. Jika param berupa objek uri/source
      else if (typeof audioParam === "string") {
        audioSource = { uri: audioParam };
      } 
      // 3. Jika param sudah berupa number module ID
      else {
        audioSource = audioParam;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true }
      );

      soundRef.current = newSound;

      newSound.setOnPlaybackStatusUpdate(async (status: any) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlayingAudio(false);
          try {
            await newSound.unloadAsync();
          } catch (e) {}
          soundRef.current = null;
        }
      });
    } catch (error) {
      console.warn("Gagal memutar audio soal:", error);
      setIsPlayingAudio(false);
    }
  };

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
    const generateData = DataPuzzleGenerator(question);
    // const testData = DataPuzzleGenerator("masesêsaê")
    // console.log(util.inspect((testData), { showHidden: false, depth: null, colors: true }));
    setDataLevel(generateData);
    setActivePart(0);
  }, [question]);

  useEffect(() => {
    if (!dataLevel) return;

    const progress = (activePart / dataLevel.length) * 100;
    setProgress(progress);

    const finalProses = async () => {
      try {
        const data = await UpdateSkorAndLevel({ user, setUser, poin, level: level + 1 });
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
        showAlert({
          title: "ErrorCanvas",
          message: String(err),
          confirmText: "OK",
          onConfirmPressed: () => {
            setTimeout(() => {
              router.replace("/(tabs)");
            }, 250);
          },
        });
      }
    };

    if (activePart >= dataLevel.length) {
      if (user?.level != level) {
        showAlert({
          title: "SELAMAT!",
          message: "Anda telah berhasil menyelesaikan tantangan ini!",
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

    const komponenSukuKata: ComponentType[] = Object.values(dataLevel[activePart])[0] as any;
    const generateRandomGrid = RandomTilesGenerator(komponenSukuKata);
    setGridItems(generateRandomGrid);
    setRequiredSlotCount(komponenSukuKata.length);
  }, [activePart, dataLevel]);

  const handleReset = () => {
    setChooseComponent([]);
  };

  const handleAnalyze = () => {
    if (!dataLevel || !dataLevel[activePart]) return;

    const komponenSukuKata: ComponentType[] = Object.values(dataLevel[activePart])[0] as any;

    if (chooseComponent.length < komponenSukuKata.length) {
      showAlert({
        title: "BELUM LENGKAP",
        message: "Lengkapi semua slot jawaban terlebih dahulu!",
        confirmText: "OK",
      });
      return;
    }

    const apakahSemuaBenar = chooseComponent.every(
      (val, index) => val.nama === komponenSukuKata[index].nama
    );

    if (apakahSemuaBenar) {
      setChooseComponent([]);
      setActivePart((prev) => prev + 1);
    } else {
      showAlert({
        title: "COBA LAGI!",
        message: "Susunan aksara kamu masih kurang tepat. Silahkan coba lagi!",
        confirmText: "OK",
        onConfirmPressed: () => {
          setChooseComponent([]);
        },
      });
    }
  };

  // Hitung ukuran slot dinamis berdasarkan jumlah slot
  const slotSize = requiredSlotCount > 4 ? 52 : 68;

  return (
    <View style={styles.container}>
      {/* STEP 1: Kartu Pertanyaan */}
      <CopilotStep
        text="Ini adalah kata atau kalimat yang harus kamu terjemahkan ke dalam susunan Aksara Jawa."
        order={1}
        name="questionCardStep"
      >
        <CopilotView style={styles.cardQuestion}>
          <Text style={styles.labelQuestion}>Terjemahkan ke Aksara Jawa :</Text>
          <View style={styles.questionRow}>
            <TeksHighlight kalimat={question} indexActive={activePart} />
            {audioParam && (
              <TouchableOpacity
                style={styles.audioButton}
                onPress={handlePlayAudio}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isPlayingAudio ? "volume-high" : "volume-medium-outline"}
                  size={22}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            )}
          </View>
        </CopilotView>
      </CopilotStep>

      {/* STEP 2: Slot Jawaban */}
      <CopilotStep
        text="Slot ini berisi urutan pecahan Aksara Jawa yang kamu pilih. Kamu bisa menekan slot yang sudah terisi jika ingin menghapusnya."
        order={2}
        name="answerSlotsStep"
      >
        <CopilotView style={styles.answerSlotsWrapper}>
          <View style={styles.answerSlotsRow}>
            {Array.from({ length: requiredSlotCount }).map((_, index) => {
              const selectedItem = chooseComponent[index];
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.slotBox,
                    { width: slotSize, height: slotSize },
                    selectedItem ? styles.slotBoxFilled : styles.slotBoxEmpty,
                  ]}
                  onPress={() => {
                    if (selectedItem) {
                      setChooseComponent((prev) => prev.filter((_, i) => i !== index));
                    }
                  }}
                  activeOpacity={selectedItem ? 0.7 : 1}
                >
                  {selectedItem ? (
                    <Image style={styles.slotImage} source={selectedItem.image} />
                  ) : (
                    <Text style={[styles.slotQuestionMark, requiredSlotCount > 5 && { fontSize: 20 }]}>?</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </CopilotView>
      </CopilotStep>

      {/* STEP 3: Grid Pilihan Aksara */}
      <CopilotStep
        text="Pilih potongan Aksara Jawa di bawah ini sesuai urutan yang tepat untuk melengkapi slot jawaban."
        order={3}
        name="gridOptionsStep"
      >
        <CopilotView style={styles.gridContainer}>
          {gridItems.length > 0 && (
            <GridTilesGenerator
              data={gridItems}
              chooseComponent={chooseComponent}
              setChooseComponent={setChooseComponent}
              maxSlots={requiredSlotCount}
            />
          )}
        </CopilotView>
      </CopilotStep>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {/* STEP 4: Tombol Reset */}
        <CopilotStep
          text="Tekan tombol Reset jika kamu ingin mengosongkan semua slot jawaban yang telah kamu pilih."
          order={4}
          name="resetPuzzleButtonStep"
        >
          <CopilotTouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </CopilotTouchableOpacity>
        </CopilotStep>

        {/* STEP 5: Tombol Analisis */}
        <CopilotStep
          text="Tekan tombol Analisis untuk menguji apakah susunan Aksara Jawa yang kamu rangkai sudah benar."
          order={5}
          name="analyzePuzzleButtonStep"
        >
          <CopilotTouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
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
    backgroundColor: Colors.background,
    paddingTop: 10,
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  cardQuestion: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 15,
  },
  labelQuestion: {
    fontSize: 16,
    color: Colors.textDark,
    opacity: 0.8,
    marginBottom: 8,
    fontFamily: "Fraunces-Bold",
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  audioButton: {
    backgroundColor: Colors.orange,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  answerSlotsWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    minHeight: 80,
  },
  answerSlotsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  slotBox: {
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  slotBoxEmpty: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#D8C3A5",
    borderStyle: "dashed",
  },
  slotBoxFilled: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#D8C3A5",
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  slotQuestionMark: {
    fontSize: 26,
    fontFamily: "Fraunces-Bold",
    color: "#E0D1B8",
  },
  slotImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  gridContainer: {
    flex: 1,
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
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