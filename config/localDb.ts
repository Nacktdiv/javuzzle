// config/localDb.ts
import * as SQLite from "expo-sqlite";

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDb = (): SQLite.SQLiteDatabase => {
  if (!dbInstance) {
    try {
      dbInstance = SQLite.openDatabaseSync("javuzzle_offline.db");
    } catch (error) {
      console.error("❌ [LOCAL DB] Gagal membuka database SQLite:", error);
      throw error;
    }
  }
  return dbInstance;
};

// export const clearLocalDatabase = () => {
//   try {
//     const db = getDb();
//     db.execSync(`
//       DROP TABLE IF EXISTS users;
//       DROP TABLE IF EXISTS sync_queue;
//     `);
//     console.log("🧹 [LOCAL DB DEV] Seluruh tabel berhasil dihapus (Reset Clean)!");
//   } catch (error) {
//     console.error("❌ [LOCAL DB DEV] Gagal menghapus tabel:", error);
//   }
// };

export const initLocalDatabase = () => {
  try {
    // 🛠️ UNCOMMENT UNTUK DEV RESET:
    // clearLocalDatabase();

    const db = getDb();

    if (!db) {
      console.error("❌ [LOCAL DB] Instance database tidak ditemukan.");
      return;
    }

    db.execSync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        nama TEXT,
        level INTEGER DEFAULT 1,
        poin INTEGER DEFAULT 0,
        study_plan INTEGER,
        created_at TEXT,
        is_synced INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    console.log("✅ [LOCAL DB] Tabel SQLite berhasil diinisialisasi.");
  } catch (error) {
    console.error("❌ [LOCAL DB] Gagal melakukan initLocalDatabase:", error);
  }
};