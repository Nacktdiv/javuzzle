import { supabase } from "@/config/supabase";
import { getUserFromLocal, saveUserToLocal } from "@/service/global/userService";
import NetInfo from "@react-native-community/netinfo";
import { userType } from "@/app/_layout";

interface FetchProfileResult {
  user: userType | null;
  hasStudyPlan: boolean | null;
}

export const checkUserProfile = async (userId: string): Promise<FetchProfileResult> => {
  if (!userId) {
    return { user: null, hasStudyPlan: null };
  }

  try {
    const netState = await NetInfo.fetch();
    const isOnline = Boolean(netState.isConnected && netState.isInternetReachable);

    if (isOnline) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        // Fallback ke data lokal jika error/data kosong
        const localUser = getUserFromLocal(userId) as userType | null;
        return {
          user: localUser,
          hasStudyPlan: localUser ? localUser.study_plan !== null : false,
        };
      }

      saveUserToLocal(data as userType, true);
      return {
        user: data as userType,
        hasStudyPlan: data.study_plan !== null,
      };
    } else {
      const localUser = getUserFromLocal(userId) as userType | null;
      return {
        user: localUser,
        hasStudyPlan: localUser ? localUser.study_plan !== null : false,
      };
    }
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    const localUser = getUserFromLocal(userId) as userType | null;
    return {
      user: localUser,
      hasStudyPlan: localUser ? localUser.study_plan !== null : false,
    };
  }
};