import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/config/supabase";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Cek status auth langsung di gerbang utama
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        // Belum login -> Pindah ke auth
        router.replace("/auth");
        return;
      }

      // Sudah login -> Cek profile
      try {
        const { data } = await supabase
          .from("users")
          .select("study_plan")
          .eq("id", session.user.id)
          .single();

        if (data && data.study_plan !== null) {
          router.replace("/(tabs)");
        } else {
          router.replace("/onboarding");
        }
      } catch {
        router.replace("/onboarding");
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );
}