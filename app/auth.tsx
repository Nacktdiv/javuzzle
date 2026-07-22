import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";

import Footer from "@/components/auth/footer";
import Form from "@/components/auth/form";
import Header from "@/components/auth/header";

import { useCustomAlert } from "@/components/main/customAlert";

import { Colors } from "@/config/colors";
import { supabase } from "@/config/supabase";

type HandleAuthSubmitType = {
  fullName?: string;
  email: string;
  password: string;
}

export default function AuthScreen() {
  const router = useRouter();
  const { showAlert } = useCustomAlert();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleAuthSubmit = async (formData: HandleAuthSubmitType) => {
    const { fullName, email, password } = formData;

    if (isLoginMode) {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        showAlert({
          title: "ErrorSignIn",
          message: error.message,
          confirmText: "OK",
        });
        return;
      } else {
        router.replace("/(tabs)");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        showAlert({
          title: "ErrorSignUp",
          message: error.message,
          confirmText: "OK",
        });
      } else {
        showAlert({
          title: "SuccessSignUp",
          message:
            "Berhasil melakukan registrasi, silahkan buka email anda untuk konfirmasi",
          confirmText: "OK",
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
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
