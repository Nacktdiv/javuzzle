// config/useSyncManager.ts
import { useEffect, useRef } from "react";
import NetInfo from "@react-native-community/netinfo";
import { getDb } from "@/config/localDb";
import { getUserFromLocal } from "@/components/main/userService";
import { supabase } from "@/config/supabase";

export const useSyncManager = () => {
  const isSyncingRef = useRef(false);

  const processSyncQueue = async () => {
    if (isSyncingRef.current) return;

    try {
      isSyncingRef.current = true;

      const db = getDb();
      if (!db) {
        console.warn("⚠️ [SYNC ENGINE] Instance DB belum siap, membatalkan sync sementara.");
        return;
      }

      // Ambil antrean pending dari SQLite
      let pendingItems: any[] = [];
      try {
        pendingItems = db.getAllSync("SELECT * FROM sync_queue ORDER BY id ASC;");
      } catch (dbErr) {
        console.error("❌ [SYNC ENGINE] Gagal membaca sync_queue dari SQLite:", dbErr);
        return;
      }

      if (pendingItems.length === 0) {
        console.log("⚡ [SYNC ENGINE] Tidak ada antrean pending.");
        return;
      }

      console.log(`🚀 [SYNC ENGINE] Memulai sinkronisasi! Ditemukan ${pendingItems.length} antrean pending...`);

      for (const item of pendingItems) {
        console.log(`🔄 [SYNC ENGINE] Memproses Item ID: ${item.id} | Action: ${item.action}`);
        const payload = JSON.parse(item.payload);
        const userId = payload.id || payload.userId;

        let isSuccess = false;

        if (item.action === "UPDATE_USER_PROFILE" || item.action === "UPDATE_SCORE_LEVEL" || item.action === "UPDATE_STUDY_TIME") {
          const localUser = getUserFromLocal(userId);

          // Gabungkan data agar lengkap
          const completePayload: any = {
            ...localUser,
            ...payload,
            id: userId,
          };

          // Hapus kolom/key internal yang tidak ada di tabel Supabase
          delete completePayload.userId;
          delete completePayload.is_synced;

          console.log("📤 [SYNC ENGINE] Mengirim payload ke Supabase:", completePayload);

          const { error } = await supabase
            .from("users")
            .upsert(completePayload);

          if (error) {
            console.error(`❌ [SYNC ENGINE] Supabase Gagal (ID: ${item.id}):`, error.message);
          } else {
            isSuccess = true;
          }
        }

        if (isSuccess) {
          db.runSync("DELETE FROM sync_queue WHERE id = ?;", [item.id]);
          console.log(`✅ [SYNC ENGINE] Berhasil Sync & Hapus Item ID: ${item.id} dari SQLite!`);
        } else {
          console.warn(`⚠️ [SYNC ENGINE] Menghentikan antrean karena Item ID ${item.id} gagal.`);
          break;
        }
      }

      console.log("🎉 [SYNC ENGINE] Seluruh proses sinkronisasi selesai!");
    } catch (error) {
      console.error("❌ [SYNC ENGINE] Kendala saat sinkronisasi:", error);
    } finally {
      isSyncingRef.current = false;
    }
  };

  useEffect(() => {
    let lastStatusIsOnline = false;

    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = Boolean(state.isConnected && state.isInternetReachable);

      // Jalankan sync hanya ketika ada perubahan status dari offline ke online
      if (isOnline && !lastStatusIsOnline) {
        console.log("🌐 [NETWORK] Perangkat ONLINE. Memicu pemrosesan antrean sinkronisasi...");
        // Berikan sedikit delay agar thread SQLite dan network stabil
        setTimeout(() => {
          processSyncQueue();
        }, 500);
      } else if (!isOnline) {
        console.log("📡 [NETWORK] Perangkat OFFLINE. Mengalihkan ke penyimpanan SQLite lokal.");
      }

      lastStatusIsOnline = isOnline;
    });

    return () => unsubscribe();
  }, []);
};