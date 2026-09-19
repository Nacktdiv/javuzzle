// config/useSyncManager.ts
import { getDb } from "@/config/localDb";
import { supabase } from "@/config/supabase";
import { getUserFromLocal } from "@/service/global/userService";
import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";

// Variabel biasa sebagai pengunci (menggantikan useRef)
let isSyncing = false;

// 1. FUNGSI ASYNC MURNI (Bisa di-export & dipanggil di mana saja tanpa error Invalid Hook Call)
export const processSyncQueue = async () => {
  if (isSyncing) return;

  try {
    isSyncing = true;

    const db = getDb();
    if (!db) {
      console.warn("⚠️ [SYNC ENGINE] Instance DB belum siap, membatalkan sync sementara.");
      return;
    }

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

      if (
        item.action === "UPDATE_USER_PROFILE" ||
        item.action === "UPDATE_SCORE_LEVEL" ||
        item.action === "UPDATE_STUDY_TIME"
      ) {
        const localUser = getUserFromLocal(userId);

        const completePayload: any = {
          ...localUser,
          ...payload,
          id: userId,
        };

        delete completePayload.userId;
        delete completePayload.is_synced;

        console.log("📤 [SYNC ENGINE] Mengirim payload ke Supabase:", completePayload);

        const { error } = await supabase.from("users").upsert(completePayload);

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
    isSyncing = false;
  }
};

// 2. CUSTOM HOOK (Hanya bertugas memantau koneksi internet di background)
export const useSyncManager = () => {
  useEffect(() => {
    let lastStatusIsOnline = false;

    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = Boolean(state.isConnected && state.isInternetReachable);

      if (isOnline && !lastStatusIsOnline) {
        console.log("🌐 [NETWORK] Perangkat ONLINE. Memicu pemrosesan antrean sinkronisasi...");
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