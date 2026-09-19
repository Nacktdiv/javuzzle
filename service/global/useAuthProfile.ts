import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/config/supabase";
import { getDb } from "@/config/localDb";
import { userType } from "@/app/_layout";
import { executeDailyResetIfNeeded } from "./userService";
import { processSyncQueue } from "./useSyncManager";

const SUPABASE_STORAGE_KEY = "sb-access-token";

const getUserFromLocal = (userId: string): userType | null => {
  try {
    const db = getDb();
    if (!db) return null;
    const user = db.getFirstSync("SELECT * FROM users WHERE id = ?;", [userId]);
    return (user as userType) || null;
  } catch (error) {
    console.error("❌ [LOCAL DB] Error membaca SQLite:", error);
    return null;
  }
};

export const useAuthProfile = (isDbReady: boolean, isOffline: boolean) => {
  const [user, setUser] = useState<userType | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const initProfile = useCallback(async () => {
    if (!isDbReady) return;

    try {
      setLoading(true);
      console.log("==========================================");
      console.log("🚀 [AUTH] Memulai Alur Auth Sederhana");

      // 1. Cek Token Manual
      const rawSession = await AsyncStorage.getItem(SUPABASE_STORAGE_KEY);
      let parsedSession = rawSession ? JSON.parse(rawSession) : null;

      if (parsedSession) {
        console.log("🔑 [DEBUG JWT] Token Ditemukan di Storage!");
      } else {
        console.warn("⚠️ [DEBUG JWT] Tidak ada Session di Storage, mencoba getSession()...");
      }

      // Fallback ke SDK Supabase getSession jika manual null
      if (!parsedSession) {
        const { data } = await supabase.auth.getSession();
        parsedSession = data.session;
      }

      const activeUser = parsedSession?.user;
      const userId = activeUser?.id;

      if (!userId) {
        console.warn("🔒 [AUTH] Tidak ada User ID. Mengosongkan Auth State.");
        setUser(null);
        setSession(null);
        setLoading(false);
        return;
      }

      setSession(parsedSession);

      // 2. Cek & Reset Harian
      console.log("🔄 [AUTH] Menjalankan pengecekan reset harian...");
      const isResetPerformed = await executeDailyResetIfNeeded(userId);

      // 3. Process Sync Queue
      if (!isOffline) {
        console.log("🌐 [AUTH] Online: Memproses sync queue...");
        await processSyncQueue();
      }

      // 4. Ambil Data Profil (Supabase vs SQLite)
      let profileData: userType | null = null;

      if (!isOffline) {
        console.log("📡 [AUTH] Online: Mengambil profil dari Supabase...");
        const { data: remoteProfile, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (remoteProfile && !error) {
          console.log("✅ [AUTH] Berhasil mengambil profil dari Supabase.");
          profileData = remoteProfile as userType;
        }
      }

      if (!profileData) {
        console.log("💾 [AUTH] Membaca data user dari SQLite Lokal...");
        profileData = getUserFromLocal(userId);
      }

      setUser(profileData);
      console.log("✅ [AUTH] Selesai. User State:", profileData ? "TERISI" : "KOSONG");
      console.log("==========================================");

    } catch (err) {
      console.error("❌ [AUTH] Error pada alur auth:", err);
    } finally {
      setLoading(false);
    }
  }, [isDbReady, isOffline]);

  useEffect(() => {
    initProfile();
  }, [initProfile]);

  const hasStudyPlan = user ? Boolean(user.study_plan) : null;

  // PERBAIKAN: Mengembalikan setSession agar AuthScreen dapat mengupdate session secara langsung
  return {
    session,
    setSession,
    user,
    setUser,
    loading,
    hasStudyPlan,
    refetchProfile: initProfile,
  };
};