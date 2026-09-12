import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { addStudyTimeLocal } from "@/components/main/userService";
import { userType } from "@/app/_layout";

export const useStudyTimer = (
  user: userType | null,
  setUser: React.Dispatch<React.SetStateAction<userType | null>>
) => {
  const appState = useRef(AppState.currentState);
  const secondsBuffer = useRef(0);

  useEffect(() => {
    if (!user?.id) return;

    // Timer per detik untuk mengakumulasi waktu penggunaan
    const interval = setInterval(() => {
      secondsBuffer.current += 1;

      // Setiap 60 detik (1 menit), simpan ke SQLite
      if (secondsBuffer.current >= 60) {
        secondsBuffer.current = 0;
        const updatedUser = addStudyTimeLocal(user.id, 1);
        if (updatedUser) {
          setUser(updatedUser);
          console.log("⏱️ [TIMER] 1 menit belajar ditambahkan ke SQLite!");
        }
      }
    }, 1000);

    // Tangani event ketika aplikasi di-minimize / ditutup (Background/Active)
    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        // Jika masih ada sisa detik >= 30 detik saat app di-minimize, bulatkan jadi 1 menit
        if (secondsBuffer.current >= 30) {
          const updatedUser = addStudyTimeLocal(user.id, 1);
          if (updatedUser) setUser(updatedUser);
        }
        secondsBuffer.current = 0;
      }
      appState.current = nextAppState;
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, [user?.id, setUser]);
};