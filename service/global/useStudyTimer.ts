// service/global/useStudyTimer.ts
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { addStudyTimeLocal } from "./userService";
import { userType } from "@/app/_layout";

export const useStudyTimer = (
  user: userType | null,
  setUser: React.Dispatch<React.SetStateAction<userType | null>>,
  isDbReady: boolean
) => {
  const appState = useRef(AppState.currentState);
  const secondsBuffer = useRef(0);
  const userIdRef = useRef<string | null>(null);

  userIdRef.current = user?.id ?? null;

  useEffect(() => {
    const currentUserId = userIdRef.current;
    if (!isDbReady || !currentUserId) return;

    // Interval akumulasi 1 menit
    const interval = setInterval(() => {
      const activeId = userIdRef.current;
      if (!activeId) return;

      secondsBuffer.current += 1;

      if (secondsBuffer.current >= 60) {
        secondsBuffer.current = 0;
        const updatedUser = addStudyTimeLocal(activeId, 1);
        if (updatedUser) setUser(updatedUser);
      }
    }, 1000);

    // Dynamic AppState Listener (Background handling)
    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      const activeId = userIdRef.current;
      if (!activeId) return;

      // Pembulatan sisa detik saat aplikasi di-minimize
      if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
        if (secondsBuffer.current >= 30) {
          const updatedUser = addStudyTimeLocal(activeId, 1);
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
  }, [isDbReady, Boolean(user?.id)]);
};