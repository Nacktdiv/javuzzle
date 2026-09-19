import { Stack, useRouter, useSegments } from "expo-router";
import React, { createContext, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { CopilotProvider } from "react-native-copilot";

import { initLocalDatabase } from "@/config/localDb";
import { useSyncManager } from "@/service/global/useSyncManager";
import NetInfo from "@react-native-community/netinfo";

import { useAuthProfile } from "@/service/global/useAuthProfile";
import { useStudyTimer } from "@/service/global/useStudyTimer";

import {
  registerForPushNotificationsAsync,
  scheduleDailyReminder,
} from "@/service/global/notification";

import { Balthazar_400Regular } from "@expo-google-fonts/balthazar";
import {
  Fraunces_400Regular,
  Fraunces_700Bold,
} from "@expo-google-fonts/fraunces";
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  useFonts,
} from "@expo-google-fonts/playfair-display";

import { CustomAlertProvider } from "@/components/main/customAlert";
import CustomSplashScreen from "@/components/main/splashScreen";

export type userType = {
  id: string;
  email: string;
  nama: string;
  level: number;
  poin: number;
  study_plan: number;
  created_at: string;
  today_minutes: number;
  streak: number;
};

interface GlobalContextType {
  user: userType | null;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>;
  setSession: React.Dispatch<React.SetStateAction<any>>;
  checkUserProfile: () => Promise<void>;
  isOffline: boolean;
}

export const globalDataContext = createContext<GlobalContextType>({
  user: null,
  setUser: () => {},
  setSession: () => {},
  checkUserProfile: async () => {},
  isOffline: false,
});

export const CACHE_USER_KEY = "@user_profile_cache";

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const router = useRouter();
  const segments = useSegments();

  const userIdRef = useRef<string | null>(null);
  const isNotificationSetup = useRef(false);

  useSyncManager();

  const [loadedFonts] = useFonts({
    "Playfair-Display-Regular": PlayfairDisplay_400Regular,
    "Playfair-Display-Bold": PlayfairDisplay_700Bold,
    "Fraunces-Regular": Fraunces_400Regular,
    "Fraunces-Bold": Fraunces_700Bold,
    "Balthazar-Regular": Balthazar_400Regular,
  });

  // 1. Inisialisasi DB & Listener Jaringan
  useEffect(() => {
    try {
      initLocalDatabase();
      setIsDbReady(true);
    } catch (err) {
      console.error("❌ [LOCAL DB] Inisialisasi DB gagal:", err);
    }

    const unsubscribeNet = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected || !state.isInternetReachable;
      setIsOffline(Boolean(offline));
    });

    return () => unsubscribeNet();
  }, []);

  // 2. Auth Profile Hook (Diperluas dengan setSession)
  const { session, user, setUser, setSession, hasStudyPlan, refetchProfile, loading } = useAuthProfile(isDbReady, isOffline);
  userIdRef.current = user?.id ?? null;

  // 3. Pengaturan Status Ready Splash Screen
  useEffect(() => {
    if (!loadedFonts || !isDbReady) return;

    if (!session || (session && hasStudyPlan !== null)) {
      setIsReady(true);
    }
  }, [session, hasStudyPlan, loadedFonts, isDbReady]);

  // 4. Timer Waktu Belajar
  useStudyTimer(user, setUser, isDbReady);

  // 5. Setup Notifikasi
  useEffect(() => {
    async function setupNotifications() {
      if (!session?.user?.id || !user || isNotificationSetup.current) return;
      isNotificationSetup.current = true;

      await registerForPushNotificationsAsync();
      const streakCount = user.streak ?? 0;
      await scheduleDailyReminder(
        streakCount > 0 ? "STREAK_PROTECTOR" : "STREAK_RESTART",
        streakCount,
        19,
        0
      );
    }

    setupNotifications();
  }, [session?.user?.id, Boolean(user)]);

  // 6. Routing Navigasi yang Aman (Online & Offline)
  useEffect(() => {
    if (!isReady || loading) return;

    const currentSegment = segments[0];
    const isLoggedIn = Boolean(session || user);

    if (!isLoggedIn) {
      if (currentSegment !== "auth") {
        router.replace("/auth");
      }
    } else {
      if (hasStudyPlan === false && currentSegment !== "onboarding") {
        router.replace("/onboarding");
      } else if (hasStudyPlan === true && (currentSegment === "auth" || currentSegment === "onboarding")) {
        router.replace("/(tabs)");
      }
    }
  }, [session, user, hasStudyPlan, isReady, loading, segments]);

  if (!isReady || !isDbReady) {
    return <CustomSplashScreen />;
  }

  return (
    <globalDataContext.Provider
      value={{
        user,
        setUser,
        setSession,
        checkUserProfile: refetchProfile,
        isOffline,
      }}
    >
      <CustomAlertProvider>
        <CopilotProvider
          stopOnOutsideClick
          androidStatusBarVisible
          labels={{ previous: "Sebelumnya", next: "Lanjut", skip: "Lewati", finish: "Selesai" }}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(mode)" />
          </Stack>
        </CopilotProvider>
      </CustomAlertProvider>
    </globalDataContext.Provider>
  );
}