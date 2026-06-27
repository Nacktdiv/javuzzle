import { Platform } from "react-native";
import React, { createContext, useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as NavigationBar from "expo-navigation-bar";

import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display'
import { Fraunces_400Regular, Fraunces_700Bold } from '@expo-google-fonts/fraunces'
import { Balthazar_400Regular } from '@expo-google-fonts/balthazar'

import { supabase } from '@/config/supabase.web'
import CustomSplashScreen from "@/components/main/splashScreen";
import { CustomAlertProvider } from "@/components/main/customAlert";

type userType = {
  id : string,
  email : string,
  nama : string,
  level : number,
  poin : number,
  study_plan : number,
  created_at : string
}

interface GlobalContextType {
  user: userType | null;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>;
  checkUserProfile: (userId: string) => Promise<void>;
}

export const globalDataContext = createContext<GlobalContextType>({
  user: null,
  setUser: () => {},
  checkUserProfile: async () => {}, 
});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [hasStudyPlan, setHasStudyPlan] = useState<boolean | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  const [user, setUser] = useState<userType | null>(null)
  
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, []);

  const [loaded, error] = useFonts({
    'Playfair-Display-Regular' : PlayfairDisplay_400Regular,
    'Playfair-Display-Bold' : PlayfairDisplay_700Bold,
    'Fraunces-Regular' : Fraunces_400Regular,
    'Fraunces-Bold' : Fraunces_700Bold,
    'Balthazar-Regular' : Balthazar_400Regular
  })

  const checkUserProfile = async (userId: string) => {
    setIsLoadingProfile(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*') 
        .eq('id', userId)
        .single();

      if (data && data.study_plan !== null) {
        setHasStudyPlan(true);
        setUser(data as userType);
      } else {
        setHasStudyPlan(false);
        setUser(data as userType);
      }
    } catch (err) {
      setHasStudyPlan(false);
      setUser(null)
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      
      if (session?.user) {
        checkUserProfile(session.user.id);
      } else {
        setHasStudyPlan(null);
        // Kasih jeda sedikit agar splash screen tidak berkedip terlalu cepat
        setTimeout(() => setIsReady(true), 1500);
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session && loaded) {
      setIsReady(true);
      return;
    }

    if (session && hasStudyPlan !== null && !isLoadingProfile && loaded) {
      setIsReady(true);
    }
  }, [session, hasStudyPlan, isLoadingProfile, loaded]);

  useEffect(() => {
    if (!isReady || isLoadingProfile) return;

    const currentSegment = segments[0];

    // Jika BELUM LOGIN sama sekali
    if (!session) {
      if (currentSegment !== "auth") {
        router.replace("/auth");
      }
      return;
    }

    // Jika SUDAH LOGIN
    if (session) {
      if (hasStudyPlan === false) {
        // 🟥 KONDISI 1: Belum isi study_plan -> KURUNG di onboarding
        if (currentSegment !== "onboarding") {
          router.replace("/onboarding");
          console.log('ke onboard')
        }
      } else if (hasStudyPlan === true) {
        // 🟩 KONDISI 2: Sudah isi study_plan -> Boleh ke tabs/mode, JANGAN boleh ke auth/onboarding
        if (currentSegment === "auth" || currentSegment === "onboarding") {
          router.replace("/(tabs)");
          console.log('ke tabs')
        }
      }
    }
  }, [session, hasStudyPlan, isReady, segments, isLoadingProfile]);

  if (!isReady) {
    return <CustomSplashScreen />;
  }

  return (
    <globalDataContext.Provider value={{ user, setUser, checkUserProfile }}>
      <CustomAlertProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(mode)" />
        </Stack>
      </CustomAlertProvider>
    </globalDataContext.Provider>
  );
}