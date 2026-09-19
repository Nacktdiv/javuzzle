import { userType } from "@/app/_layout";
import { supabase } from "@/config/supabase";
import { saveToSyncQueue } from "@/service/global/userService";
import NetInfo from "@react-native-community/netinfo";
import * as SQLite from "expo-sqlite";

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
    const updatedUser: userType = { ...user, poin: skorBaru, level: level };

    const netState = await NetInfo.fetch();
    const isOnline = Boolean(
      netState.isConnected && netState.isInternetReachable,
    );

    db.runSync(
      `UPDATE users SET poin = ?, level = ?, is_synced = ? WHERE id = ?`,
      [skorBaru, level, isOnline ? 1 : 0, user.id],
    );
    setUser(updatedUser);

    if (isOnline) {
      const { error } = await supabase
        .from("users")
        .update({ level: level, poin: skorBaru })
        .eq("id", user.id);

      if (error) {
        console.warn(
          "⚠️ Supabase update error, alihkan ke Sync Queue:",
          error.message,
        );
        saveToSyncQueue("UPDATE_SCORE_LEVEL", updatedUser);
        db.runSync(`UPDATE users SET is_synced = 0 WHERE id = ?`, [user.id]);
      }
    } else {
      saveToSyncQueue("UPDATE_SCORE_LEVEL", updatedUser);
    }

    return true;
  } catch (err) {
    throw new Error("Fail during update skor and level: " + err);
  }
}
