import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import * as SQLite from "expo-sqlite";

import Footer from "@/components/auth/footer";
import Form from "@/components/auth/form";
import Header from "@/components/auth/header";

import { useCustomAlert } from "@/components/main/customAlert";

import { Colors } from "@/config/colors";
import { supabase } from "@/config/supabase";

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

  const handleAuthSubmit = async (formData: HandleAuthSubmitType) => {
    const { fullName, email, password } = formData;

    // 1. Cek Koneksi Internet Dulu
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
      // 2. LOGIK LOGIN
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

      if (authData?.user) {
        // Fetch data profil user dari tabel public.users Supabase
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        // Caching Data User ke SQLite Lokal
        if (userData) {
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
        }

        router.replace("/(tabs)");
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
        setIsLoginMode(true); // Pindahkan ke mode login otomatis
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