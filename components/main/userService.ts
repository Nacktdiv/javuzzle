// components/main/userService.ts
import { getDb } from "@/config/localDb";
import { userType } from "@/app/_layout"

export const saveUserToLocal = (user: any, isSynced = true) => {
  if (!user || !user.id) return;

  try {
    const db = getDb();
    if (!db) {
      console.warn("⚠️ [LOCAL DB] DB belum siap, batal menyimpan user.");
      return;
    }

    console.log("💾 [LOCAL DB] Menyimpan data user ke SQLite...", user.id);

    const id = user.id;
    const email = user.email ?? "";
    const nama = user.nama ?? "";
    const level = user.level ?? 1;
    const poin = user.poin ?? 0;
    const study_plan = user.study_plan ?? null;
    const today_minutes = user.today_minutes ?? 0;
    const streak = user.streak ?? 0;
    const created_at = user.created_at ?? new Date().toISOString();
    const is_synced = isSynced ? 1 : 0;

    db.runSync(
      `INSERT INTO users (id, email, nama, level, poin, study_plan, today_minutes, streak, created_at, is_synced)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         email = excluded.email,
         nama = excluded.nama,
         level = excluded.level,
         poin = excluded.poin,
         study_plan = excluded.study_plan,
         today_minutes = excluded.today_minutes,
         streak = excluded.streak,
         created_at = excluded.created_at,
         is_synced = excluded.is_synced;`,
      [
        id,
        email,
        nama,
        level,
        poin,
        study_plan,
        today_minutes,
        streak,
        created_at,
        is_synced,
      ]
    );

    console.log("✅ [LOCAL DB] Berhasil menyimpan user ke SQLite!");
  } catch (error) {
    console.error("❌ [LOCAL DB] Gagal menyimpan user ke SQLite:", error);
  }
};

export const getUserFromLocal = (userId: string) => {
  if (!userId) return null;

  try {
    const db = getDb();
    const user = db.getFirstSync("SELECT * FROM users WHERE id = ?;", [userId]);
    return user || null;
  } catch (error) {
    console.error("❌ [LOCAL DB] Gagal membaca user dari SQLite:", error);
    return null;
  }
};

export const addStudyTimeLocal = (userId: string, addedMinutes: number) => {
  console.log(`🔍 [DEBUG STUDY] Dikelola untuk User ID: ${userId}, Tambah: ${addedMinutes}m`);

  if (!userId || addedMinutes <= 0) {
    console.warn("⚠️ [DEBUG STUDY] User ID kosong atau addedMinutes <= 0");
    return null;
  }

  try {
    const currentUser = getUserFromLocal(userId) as userType | null;
    if (!currentUser) {
      console.error("❌ [DEBUG STUDY] User tidak ditemukan di SQLite!");
      return null;
    }

    const currentMinutes = currentUser.today_minutes || 0;
    const targetMinutes = currentUser.study_plan || 0;
    let newStreak = currentUser.streak || 0;
    const newTodayMinutes = currentMinutes + addedMinutes;

    console.log(`📊 [DEBUG STUDY] Pre-update -> Today: ${currentMinutes}m, Target: ${targetMinutes}m, Streak: ${newStreak}`);

    // Cek Kenaikan Streak
    if (targetMinutes > 0 && currentMinutes < targetMinutes && newTodayMinutes >= targetMinutes) {
      newStreak += 1;
      console.log(`🔥 [DEBUG STUDY] STREAK NAIK! Menjadi: ${newStreak}`);
    }

    const updatedUser: userType = {
      ...currentUser,
      today_minutes: newTodayMinutes,
      streak: newStreak,
    };

    // 1. Simpan ke SQLite
    saveUserToLocal(updatedUser, false);

    // 2. Cek Antrean Sync Queue
    const db = getDb();
    db.runSync(
      `INSERT INTO sync_queue (action, payload, created_at) VALUES (?, ?, ?);`,
      [
        "UPDATE_STUDY_TIME",
        JSON.stringify({
          id: userId,
          today_minutes: newTodayMinutes,
          streak: newStreak,
        }),
        new Date().toISOString(),
      ]
    );

    console.log(`💾 [DEBUG STUDY] Berhasil masuk sync_queue! Total menit baru: ${newTodayMinutes}`);
    return updatedUser;
  } catch (error) {
    console.error("💥 [DEBUG STUDY] Error saat update study time:", error);
    return null;
  }
};