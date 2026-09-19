import { useCustomAlert } from "@/components/main/customAlert";
import { supabase } from "@/config/supabase";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";
import React, { useCallback, useContext, useState } from "react";
import {
  Dimensions,
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

import { globalDataContext } from "@/app/_layout";
import { Colors } from "@/config/colors";

import ProfileActionItem from "@/components/profile/profileActionItem";
import ProfileEditModal from "@/components/profile/profileEditModal";
import ProfileStatItem from "@/components/profile/profileStatItem";
import { saveToSyncQueue } from "@/service/global/userService";

const db = SQLite.openDatabaseSync("javuzzle_offline.db");

type ModalConfig = {
  visible: boolean;
  title: string;
  type: "nama" | "study_plan" | "password";
  currentValue?: string | number;
};

const { width } = Dimensions.get("window");
const CopilotView = walkthroughable(View);

function ProfileContent() {
  const router = useRouter();
  const { user, setUser, setSession } = useContext(globalDataContext);
  const { showAlert } = useCustomAlert();
  const { start } = useCopilot();

  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    visible: false,
    title: "",
    type: "nama",
  });

  const handleStartWalkthrough = useCallback(() => {
    setTimeout(() => {
      start().catch((err) => console.log("Error starting walkthrough:", err));
    }, 100);
  }, [start]);

  // Handler Update Profil Offline-First
  const handleSaveProfileUpdate = async (value1: string) => {
    if (!user) return;
    const field = modalConfig.type;
    const formattedValue =
      field === "study_plan" ? parseInt(value1, 10) : value1;

    try {
      const netState = await NetInfo.fetch();
      const isOnline = netState.isConnected && netState.isInternetReachable;

      // 1. Update SQLite Lokal & State React
      db.runSync(`UPDATE users SET ${field} = ?, is_synced = ? WHERE id = ?`, [
        formattedValue,
        isOnline ? 1 : 0,
        user.id,
      ]);

      setUser((prev) => (prev ? { ...prev, [field]: formattedValue } : null));
      showAlert({ message: "Data berhasil diperbarui!", title: "Sukses" });

      // 2. Kirim ke Supabase jika Online, atau ke Sync Queue jika Offline
      if (isOnline) {
        const { error } = await supabase
          .from("users")
          .update({ [field]: formattedValue })
          .eq("id", user.id);

        if (error) {
          saveToSyncQueue("UPDATE_USER_PROFILE", {
            userId: user.id,
            [field]: formattedValue,
          });
          db.runSync(`UPDATE users SET is_synced = 0 WHERE id = ?`, [user.id]);
        }
      } else {
        saveToSyncQueue("UPDATE_USER_PROFILE", {
          userId: user.id,
          [field]: formattedValue,
        });
      }
    } catch (e: any) {
      showAlert({
        message: e.message || "Gagal memperbarui data",
        title: "Gagal",
      });
    }
  };

  const handleSavePasswordUpdate = async (
    pass: string,
    confirmPass?: string,
  ) => {
    if (pass !== confirmPass) {
      showAlert({
        message: "Konfirmasi kata sandi tidak cocok!",
        title: "Gagal",
      });
      return;
    }

    try {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        showAlert({
          message: "Perubahan password membutuhkan koneksi internet!",
          title: "Perhatian",
        });
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: pass });
      if (error) throw error;
      showAlert({ message: "Kata sandi berhasil diubah!", title: "Sukses" });
    } catch (e: any) {
      showAlert({ message: e.message, title: "Gagal" });
    }
  };

  const handleLogout = () => {
    showAlert({
      title: "Keluar Aplikasi",
      message: "Apakah kamu yakin ingin meninggalkan Javuzzle?",
      showCancelButton: true,
      confirmText: "Keluar",
      onConfirmPressed: async () => {
        try {
          // 1. Lakukan Sign Out dari Supabase Auth
          await supabase.auth.signOut();
        } catch (e) {
          console.log("Logout offline error:", e);
        } finally {
          // 2. Bersihkan data user spesifik di SQLite lokal
          if (user?.id) {
            try {
              db.runSync(`DELETE FROM users WHERE id = ?`, [user.id]);
            } catch (err) {
              console.error("Gagal menghapus data SQLite saat logout:", err);
            }
          }

          // 3. Reset State Global secara langsung di memori untuk memicu re-render
          setUser(null);
          setSession(null);

          // 4. Arahkan pengguna kembali ke halaman Auth
          router.replace("/auth");
        }
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header Statis */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={Colors.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
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
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP 1: Avatar & Nama Profil */}
        <CopilotStep
          text="Bagian ini menampilkan identitas utama ksatria kamu."
          order={1}
          name="profileIdentityStep"
        >
          <CopilotView style={styles.profileHeaderWrapper} collapsable={false}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                {user?.nama ? (
                  <Text style={styles.avatarText}>
                    {user.nama.charAt(0).toUpperCase()}
                  </Text>
                ) : (
                  <Ionicons name="person" size={50} color={Colors.text} />
                )}
              </View>
            </View>
            <Text style={styles.nameText}>{user?.nama || "User"}</Text>
          </CopilotView>
        </CopilotStep>

        {/* Card Putih Utama */}
        <View style={styles.mainCard}>
          {/* STEP 2: Banner Statistik */}
          <CopilotStep
            text="Di sini kamu bisa melihat level game, akumulasi poin, dan target waktu belajar harianmu."
            order={2}
            name="profileStatsStep"
          >
            <CopilotView style={styles.statsContainer} collapsable={false}>
              <ProfileStatItem
                icon="trophy-outline"
                label="Level Game"
                value={user?.level ?? 1}
              />
              <View style={styles.divider} />
              <ProfileStatItem
                icon="star-outline"
                label="Total Poin"
                value={user?.poin ?? 0}
              />
              <View style={styles.divider} />
              <ProfileStatItem
                icon="create-outline"
                label="Plan Belajar"
                value={`${user?.study_plan ?? 5} m`}
              />
            </CopilotView>
          </CopilotStep>

          {/* STEP 3: Menu Aksi / Pengaturan */}
          <CopilotStep
            text="Gunakan menu ini untuk mengubah profil, menyetel ulang kata sandi, mengatur durasi belajar, atau keluar aplikasi."
            order={3}
            name="profileActionsStep"
          >
            <CopilotView style={styles.menuContainer} collapsable={false}>
              <ProfileActionItem
                icon="settings-sharp"
                iconColor={Colors.primaryDark}
                bgColor={Colors.background}
                label="Pengaturan Profil"
                onPress={() =>
                  setModalConfig({
                    visible: true,
                    title: "Ubah Nama Ksatria",
                    type: "nama",
                    currentValue: user?.nama,
                  })
                }
              />

              <ProfileActionItem
                icon="create-outline"
                iconColor={Colors.gold}
                bgColor={Colors.background}
                label="Ubah Email & Password"
                onPress={() =>
                  setModalConfig({
                    visible: true,
                    title: "Setel Ulang Password",
                    type: "password",
                  })
                }
              />

              <ProfileActionItem
                icon="create"
                iconColor={Colors.success}
                bgColor={Colors.background}
                label="Ubah Rencana Belajar"
                onPress={() =>
                  setModalConfig({
                    visible: true,
                    title: "Atur Target Belajar",
                    type: "study_plan",
                    currentValue: user?.study_plan,
                  })
                }
              />

              <ProfileActionItem
                icon="log-out-outline"
                iconColor={Colors.danger}
                bgColor={Colors.background}
                label="Keluar"
                onPress={handleLogout}
                isLast={true}
              />
            </CopilotView>
          </CopilotStep>
        </View>
      </ScrollView>

      <ProfileEditModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        type={modalConfig.type}
        currentValue={modalConfig.currentValue}
        onClose={() => setModalConfig({ ...modalConfig, visible: false })}
        onSave={
          modalConfig.type === "password"
            ? handleSavePasswordUpdate
            : handleSaveProfileUpdate
        }
      />
    </View>
  );
}

export default function Profile() {
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
      <ProfileContent />
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
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 20,
  },
  backBtn: {
    position: "absolute",
    left: 20,
    top: 45,
    zIndex: 10,
  },
  helpBtn: {
    position: "absolute",
    right: 20,
    top: 45,
    zIndex: 10,
    padding: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "Fraunces-Bold",
    color: Colors.primaryDark,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  profileHeaderWrapper: {
    alignItems: "center",
    zIndex: 10,
  },
  avatarWrapper: {
    alignItems: "center",
  },
  avatarCircle: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: (width * 0.28) / 2,
    backgroundColor: Colors.secondary,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    overflow: "hidden",
  },
  avatarText: {
    fontSize: width * 0.12,
    fontFamily: "Fraunces-Bold",
    color: "#FFFFFF",
  },
  mainCard: {
    backgroundColor: Colors.text,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: 20,
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 40,
    minHeight: 500,
  },
  nameText: {
    fontSize: 18,
    fontFamily: "Fraunces-Bold",
    color: Colors.primaryDark,
    textAlign: "center",
    marginTop: 12,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 30,
  },
  divider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginVertical: 4,
  },
  menuContainer: {
    marginTop: 5,
  },
});
