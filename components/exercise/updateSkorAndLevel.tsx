import * as SQLite from "expo-sqlite";
import NetInfo from "@react-native-community/netinfo";
import { supabase } from "@/config/supabase";
import { userType } from "@/app/_layout";

const db = SQLite.openDatabaseSync("javuzzle_offline.db");

type UpdateType = {
  user: userType | null;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>;
  poin: number; // Poin tambahan yang didapat
  level: number; // Level baru
};

export default async function UpdateSkorAndLevel({
  user,
  setUser,
  poin,
  level,
}: UpdateType) {
  try {
    if (!user) throw new Error("data 'user' is not provided");

    const skorBaru = user.poin + poin;
    // 1. Buat Objek User Lengkap yang sudah ter-update
    const updatedUser: userType = { ...user, poin: skorBaru, level: level };

    // 2. Cek Koneksi Internet
    const netState = await NetInfo.fetch();
    const isOnline = Boolean(netState.isConnected && netState.isInternetReachable);

    // 3. Update DB SQLite Lokal dulu & State React (UI responsif seketika)
    db.runSync(
      `UPDATE users SET poin = ?, level = ?, is_synced = ? WHERE id = ?`,
      [skorBaru, level, isOnline ? 1 : 0, user.id]
    );
    setUser(updatedUser);

    // 4. Sinkronisasi ke Supabase atau Masukkan Antrean
    if (isOnline) {
      const { error } = await supabase
        .from("users")
        .update({ level: level, poin: skorBaru })
        .eq("id", user.id);

      if (error) {
        console.warn("⚠️ Supabase update error, alihkan ke Sync Queue:", error.message);
        // Kirim SELURUH data updatedUser agar kolom NOT NULL (seperti email) tidak hilang
        saveToSyncQueue("UPDATE_SCORE_LEVEL", updatedUser);
        db.runSync(`UPDATE users SET is_synced = 0 WHERE id = ?`, [user.id]);
      }
    } else {
      // Offline -> Kirim SELURUH data updatedUser ke Sync Queue
      saveToSyncQueue("UPDATE_SCORE_LEVEL", updatedUser);
    }

    return true;
  } catch (err) {
    throw new Error("Fail during update skor and level: " + err);
  }
}

// Helper untuk masukkan ke antrean offline
const saveToSyncQueue = (action: string, payload: userType) => {
  console.log(`📥 [SYNC QUEUE] Menyimpan antrean offline '${action}' dengan data lengkap ID:`, payload.id);
  db.runSync(
    `INSERT INTO sync_queue (action, payload, created_at) VALUES (?, ?, ?)`,
    [action, JSON.stringify(payload), new Date().toISOString()]
  );
};