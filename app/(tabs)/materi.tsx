import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    CopilotProvider,
    CopilotStep,
    useCopilot,
    walkthroughable,
} from "react-native-copilot";

import CardGenerator from "@/components/material/cardGenerator";
import ModalMateri from "@/components/material/modalMateri";
import { Colors } from "@/config/colors";
import {
    MATERI_AKSARA,
    MATERI_SANDHANGAN,
    MateriType,
} from "@/service/global/dataMateri";

const CopilotView = walkthroughable(View);

function MateriContent() {
  const router = useRouter();
  const { start } = useCopilot();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedMateri, setSelectedMateri] = useState<MateriType | null>(null);

  const handleOpenDetail = (materi: MateriType) => {
    setSelectedMateri(materi);
    setModalVisible(true);
  };

  const handleCloseDetail = () => {
    setModalVisible(false);
    setSelectedMateri(null);
  };

  // LOGIKA DIBERSIHKAN: Menangkap error async jika activity belum siap saat tombol help ditekan
  const handleStartWalkthrough = useCallback(() => {
    try {
      start().catch((err) => {
        console.warn("Copilot start deferred:", err);
      });
    } catch (e) {
      // Safe fallback
    }
  }, [start]);

  return (
    <View style={styles.container}>
      {/* STEP 1: Header */}
      <CopilotStep
        text="Ini adalah halaman Materi Aksara Jawa. Kamu bisa menekan tombol bantuan kapan saja untuk panduan."
        order={1}
        name="materiHeaderStep"
      >
        <CopilotView style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color={Colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.title}>Materi</Text>
          <TouchableOpacity
            style={styles.helpBtn}
            onPress={handleStartWalkthrough}
            activeOpacity={0.7}
          >
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={Colors.primaryDark}
            />
          </TouchableOpacity>
        </CopilotView>
      </CopilotStep>

      <ScrollView style={[styles.scrollContainer, { marginBottom: 75 }]}>
        {/* STEP 2: Judul Section Nglegena */}
        <CopilotStep
          text="Di sini kamu dapat mempelajari daftar Aksara Nglegena serta Sandhangan. Ketuk kartu untuk melihat detailnya, dan scroll ke bawah untuk melihat materi lainnya."
          order={2}
          name="materiSectionStep"
        >
          <CopilotView style={styles.sectionHeader}>
            <Text style={styles.partTitle}>Aksara Legena</Text>
            <Text style={styles.partSubtitle}>
              Huruf dasar Jawa yang masih memiliki bunyi vokal asli 'a' (belum
              mendapat imbuhan)
            </Text>
          </CopilotView>
        </CopilotStep>

        {/* STEP 3: Kartu Pertama Aksara Nglegena */}
        <FlatList
          data={MATERI_AKSARA}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item, index }) => (
            <CardGenerator
              item={item}
              onPress={() => handleOpenDetail(item)}
              copilotStepProps={
                index === 0
                  ? {
                      name: "aksaraNglegenaCardStep",
                      order: 3,
                      text: "Ketuk kartu aksara ini untuk membuka detail. Kamu bisa melihat struktur komponen saat chunking, detail aksara, panduan menulis (VAR), serta mendengarkan suara pengucapannya.",
                    }
                  : undefined
              }
            />
          )}
          columnWrapperStyle={styles.listColumnWrapper}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          nestedScrollEnabled={true}
        />

        {/* Section Sandhangan */}
        <View style={[styles.sectionHeader, { marginTop: 15 }]}>
          <Text style={styles.partTitle}>Sandhangan</Text>
          <Text style={styles.partSubtitle}>
            Tanda baca yang ditambahkan pada aksara tersebut untuk mengubah
            bunyi vokal atau menambahkan bunyi konsonan tertentu.
          </Text>
        </View>

        <FlatList
          data={MATERI_SANDHANGAN}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => (
            <CardGenerator item={item} onPress={() => handleOpenDetail(item)} />
          )}
          columnWrapperStyle={styles.listColumnWrapper}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          nestedScrollEnabled={true}
        />
      </ScrollView>

      <ModalMateri
        visible={modalVisible}
        item={selectedMateri}
        onClose={handleCloseDetail}
      />
    </View>
  );
}

export default function MateriScreen() {
  return (
    <CopilotProvider
      stopOnOutsideClick
      androidStatusBarVisible
      verticalOffset={24}
      backdropColor="rgba(0, 0, 0, 0.6)"
      labels={{
        previous: "Sebelumnya",
        next: "Lanjut",
        skip: "Lewati",
        finish: "Selesai",
      }}
    >
      <MateriContent />
    </CopilotProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 15,
  },
  backBtn: {},
  title: {
    fontSize: 24,
    fontFamily: "Fraunces-Bold",
    color: Colors.primaryDark,
  },
  helpBtn: {
    padding: 2,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 15,
  },
  partTitle: {
    fontSize: 22,
    fontFamily: "Fraunces-Bold",
    textAlign: "center",
    color: Colors.orange,
  },
  partSubtitle: {
    fontSize: 13,
    fontFamily: "Balthazar-Regular",
    textAlign: "center",
    color: Colors.textDark,
    marginTop: 6,
    paddingHorizontal: 10,
    lineHeight: 18,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  listColumnWrapper: {
    gap: 12,
    justifyContent: "center",
  },
  listContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
});
