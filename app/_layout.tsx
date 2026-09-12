import * as NavigationBar from "expo-navigation-bar";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { createContext, useEffect, useState, useRef } from "react";
import { Platform, AppState, AppStateStatus } from "react-native";
import { CopilotProvider } from "react-native-copilot";

// === Import Offline Engine & Utilities ===
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initLocalDatabase } from "@/config/localDb";
import { useSyncManager } from "@/config/useSyncManager";
import { saveUserToLocal, getUserFromLocal, addStudyTimeLocal } from "@/components/main/userService";

// === Import Google Fonts ===
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

// === Import UI Components & Config ===
import { CustomAlertProvider } from "@/components/main/customAlert";
import CustomSplashScreen from "@/components/main/splashScreen";
import { supabase } from "@/config/supabase";

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
  checkUserProfile: (userId: string) => Promise<void>;
  isOffline: boolean;
}

export const globalDataContext = createContext<GlobalContextType>({
  user: null,
  setUser: () => {},
  checkUserProfile: async () => {},
  isOffline: false,
});

export const CACHE_USER_KEY = "@user_profile_cache";

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [hasStudyPlan, setHasStudyPlan] = useState<boolean | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [user, setUser] = useState<userType | null>(null);

  const [isOffline, setIsOffline] = useState(false);

  // Auto-sync queue dari SQLite ke Supabase saat terhubung ke internet
  useSyncManager();

  // -------------------------------------------------------------
  // ⏱️ LOGIKA TIMER BELAJAR UNTUK TODAY MINUTES & STREAK
  // -------------------------------------------------------------
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!isDbReady || !user?.id) return;

    let secondsAcc = 0;

    let intervalDetik = 60

    const interval = setInterval(() => {
      secondsAcc += 1;

      if (secondsAcc >= intervalDetik) {
        secondsAcc = 0;
        const updatedUser = addStudyTimeLocal(user.id, 1);
        if (updatedUser) {
          setUser(updatedUser); 
        }
      }
    }, 1000);

    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        if (secondsAcc >= 30) {
          const updatedUser = addStudyTimeLocal(user.id, 1);
          if (updatedUser) setUser(updatedUser);
        }
        secondsAcc = 0;
      }
      appState.current = nextAppState;
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [isDbReady, user?.id]);
  // -------------------------------------------------------------

  const router = useRouter();
  const segments = useSegments();

  // // Hide Navigation Bar di Android
  // useEffect(() => {
  //   if (Platform.OS === "android") {
  //     NavigationBar.setVisibilityAsync("hidden").catch(() => {});
  //   }
  // }, []);

  // Load Custom Fonts
  const [loadedFonts, errorLoadedFonts] = useFonts({
    "Playfair-Display-Regular": PlayfairDisplay_400Regular,
    "Playfair-Display-Bold": PlayfairDisplay_700Bold,
    "Fraunces-Regular": Fraunces_400Regular,
    "Fraunces-Bold": Fraunces_700Bold,
    "Balthazar-Regular": Balthazar_400Regular,
  });

  // 1. Inisialisasi DB SQLite Lokal & Listener Jaringan
  useEffect(() => {
    try {
      console.log("⚙️ [APP] Menginisialisasi Database SQLite Lokal...");
      initLocalDatabase();
      setIsDbReady(true);
    } catch (err) {
      console.error("❌ [LOCAL DB] Inisialisasi DB gagal:", err);
    }

    const unsubscribeNet = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected || !state.isInternetReachable;
      console.log(
        `🌐 [NETWORK STATUS] Connected: ${state.isConnected}, Reachable: ${state.isInternetReachable} => IsOffline: ${offline}`
      );
      setIsOffline(Boolean(offline));
    });

    return () => unsubscribeNet();
  }, []);

  // 2. Fungsi Ambil Data Profile (Online via Supabase / Offline via SQLite)
  const checkUserProfile = async (userId: string) => {
    if (!userId) return;

    setIsLoadingProfile(true);
    console.log(`👤 [PROFILE] Memeriksa profil user ID: ${userId}...`);

    try {
      const netState = await NetInfo.fetch();
      const isOnline = Boolean(netState.isConnected && netState.isInternetReachable);

      if (isOnline) {
        console.log("🌐 [PROFILE] Mode ONLINE: Mengambil data profil dari Supabase...");
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("⚠️ [PROFILE] Supabase fetch error:", error.message);
        }

        if (data) {
          console.log("✅ [PROFILE] Data ditemukan dari Supabase:", data.nama);
          setUser(data as userType);
          setHasStudyPlan(data.study_plan !== null);
          saveUserToLocal(data as userType, true);
        } else {
          setHasStudyPlan(false);
        }
      } else {
        console.log("📡 [PROFILE] Mode OFFLINE: Mengambil data profil dari SQLite...");
        const localUser = getUserFromLocal(userId) as userType | null;

        if (localUser) {
          setUser(localUser);
          setHasStudyPlan(localUser.study_plan !== null);
        } else {
          setHasStudyPlan(false);
        }
      }
    } catch (err) {
      console.error("💥 [PROFILE] Terjadi galat saat fetch profil, alihkan ke fallback lokal:", err);
      const localUser = getUserFromLocal(userId) as userType | null;
      if (localUser) {
        setUser(localUser);
        setHasStudyPlan(localUser.study_plan !== null);
      } else {
        setHasStudyPlan(false);
        setUser(null);
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // 3. Listener Auth Session (Hanya dipanggil setelah SQLite DB Siap)
  useEffect(() => {
    if (!isDbReady) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        checkUserProfile(session.user.id);
      } else {
        setHasStudyPlan(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          checkUserProfile(session.user.id);
        } else {
          setHasStudyPlan(null);
          setUser(null);
          AsyncStorage.removeItem(CACHE_USER_KEY);
        }
      }
    );

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [isDbReady]);

  // 4. Pengaturan Status Siap (isReady) untuk Splash Screen
  useEffect(() => {
    if (errorLoadedFonts) {
      console.error("error during load fonts: ", errorLoadedFonts);
    }

    if (!session && loadedFonts && isDbReady) {
      setIsReady(true);
      return;
    }

    if (session && hasStudyPlan !== null && !isLoadingProfile && loadedFonts && isDbReady) {
      setIsReady(true);
    }
  }, [session, hasStudyPlan, isLoadingProfile, loadedFonts, isDbReady, errorLoadedFonts]);

  // 5. Penanganan Navigasi/Routing
  useEffect(() => {
    if (!isReady || isLoadingProfile) return;

    const currentSegment = segments[0];

    if (!session) {
      if (currentSegment !== "auth") {
        router.replace("/auth");
      }
      return;
    }

    if (session) {
      if (hasStudyPlan === false) {
        if (currentSegment !== "onboarding") {
          router.replace("/onboarding");
        }
      } else if (hasStudyPlan === true) {
        if (currentSegment === "auth" || currentSegment === "onboarding") {
          router.replace("/(tabs)");
        }
      }
    }
  }, [session, hasStudyPlan, isReady, segments, isLoadingProfile, router]);

  if (!isReady || !isDbReady) {
    return <CustomSplashScreen />;
  }

  return (
    <globalDataContext.Provider value={{ user, setUser, checkUserProfile, isOffline }}>
      <CustomAlertProvider>
        <CopilotProvider
          stopOnOutsideClick
          androidStatusBarVisible
          labels={{
            previous: "Sebelumnya",
            next: "Lanjut",
            skip: "Lewati",
            finish: "Selesai",
          }}
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