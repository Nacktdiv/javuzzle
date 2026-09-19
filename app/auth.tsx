import { useRouter } from "expo-router";
import React, { useState, useContext } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import * as SQLite from "expo-sqlite";

import Footer from "@/components/auth/footer";
import Form from "@/components/auth/form";
import Header from "@/components/auth/header";

import { useCustomAlert } from "@/components/main/customAlert";
import { Colors } from "@/config/colors";
import { supabase } from "@/config/supabase";
import { globalDataContext } from "@/app/_layout";

const db = SQLite.openDatabaseSync("javuzzle_offline.db");

type HandleAuthSubmitType = {
  fullName?: string;
  email: string;
  password: string;
};

export default function AuthScreen() {
  const router = useRouter();
  const { showAlert } = useCustomAlert();
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Ambil state updater langsung dari Global Context
  const { setUser, setSession } = useContext(globalDataContext);

  const handleAuthSubmit = async (formData: HandleAuthSubmitType) => {
    const { fullName, email, password } = formData;

    // 1. Cek Koneksi Internet
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      showAlert({
        title: "Koneksi Terputus",
        message: "Proses autentikasi memerlukan koneksi internet. Silakan periksa jaringan Anda.",
        confirmText: "OK",
      });
      return;
    }

    if (isLoginMode) {
      // 2. LOGIKA LOGIN
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        showAlert({
          title: "Gagal Login",
          message: error.message,
          confirmText: "OK",
        });
        return;
      }

      console.log("✅ Auth Supabase Berhasil");

      if (authData?.user && authData?.session) {
        // Fetch profil dari tabel users Supabase
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (userError || !userData) {
          showAlert({
            title: "Gagal Mengambil Data Profil",
            message: userError?.message || "Data profil pengguna tidak ditemukan.",
            confirmText: "OK",
          });
          return;
        }

        // Caching Data User ke SQLite Lokal
        db.runSync(
          `INSERT INTO users (id, email, nama, level, poin, study_plan, created_at, is_synced)
           VALUES (?, ?, ?, ?, ?, ?, ?, 1)
           ON CONFLICT(id) DO UPDATE SET
             email = excluded.email,
             nama = excluded.nama,
             level = excluded.level,
             poin = excluded.poin,
             study_plan = excluded.study_plan,
             is_synced = 1;`,
          [
            userData.id,
            userData.email,
            userData.nama,
            userData.level,
            userData.poin,
            userData.study_plan,
            userData.created_at,
          ]
        );

        console.log("✅ User berhasil di-cache ke SQLite lokal");

        // INSTANT STATE UPDATE: Isi state RootLayout secara langsung di memori
        setSession(authData.session);
        setUser(userData as any);

        // Pindah halaman dengan aman (State sudah terisi, tidak akan balik ke /auth)
        if (userData.study_plan) {
          router.replace("/(tabs)");
        } else {
          router.replace("/onboarding");
        }
      }
    } else {
      // 3. LOGIKA REGISTER
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        showAlert({
          title: "Gagal Pendaftaran",
          message: error.message,
          confirmText: "OK",
        });
      } else {
        showAlert({
          title: "Registrasi Berhasil",
          message: "Silakan periksa email Anda untuk verifikasi akun.",
          confirmText: "OK",
        });
        setIsLoginMode(true);
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Header isLoginMode={isLoginMode} />
        <Form isLoginMode={isLoginMode} onSubmit={handleAuthSubmit} />
        <Footer
          isLoginMode={isLoginMode}
          onToggleMode={() => setIsLoginMode(!isLoginMode)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
});