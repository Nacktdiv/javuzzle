// components/main/userService.ts
import { getDb } from "@/config/localDb";

export const saveUserToLocal = (user: any, isSynced = true) => {
  if (!user || !user.id) return;

  try {
    const db = getDb();
    if (!db) {
      console.warn("⚠️ [LOCAL DB] DB belum siap, batal menyimpan user.");
      return;
    }

    console.log("💾 [LOCAL DB] Menyimpan data user ke SQLite...", user.id);

    db.runSync(
      `INSERT INTO users (id, email, nama, level, poin, study_plan, created_at, is_synced)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         email = excluded.email,
         nama = excluded.nama,
         level = excluded.level,
         poin = excluded.poin,
         study_plan = excluded.study_plan,
         is_synced = excluded.is_synced;`,
      [
        user.id,
        user.email || "",
        user.nama || "",
        user.level ?? 1,
        user.poin ?? 0,
        user.study_plan ?? null,
        user.created_at || new Date().toISOString(),
        isSynced ? 1 : 0,
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