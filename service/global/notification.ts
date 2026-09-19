import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type NotificationType = 'STREAK_PROTECTOR' | 'STREAK_RESTART';

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-reminder', {
      name: 'Pengingat Latihan Harian',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const permissions: any = await Notifications.getPermissionsAsync();
  let finalStatus = permissions.status;

  if (finalStatus !== 'granted') {
    const requestRes: any = await Notifications.requestPermissionsAsync();
    finalStatus = requestRes.status;
  }

  if (finalStatus !== 'granted') {
    console.log('Gagal mendapatkan izin notifikasi!');
    return null;
  }

  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (projectId) {
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    }
  } catch (e) {
    console.log('Error mengambil Expo Push Token:', e);
  }

  return token;
}

export async function scheduleDailyReminder(
  type: NotificationType = 'STREAK_PROTECTOR',
  currentStreak: number = 0,
  hour: number = 19,
  minute: number = 0
) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  let title = '';
  let body = '';

  if (type === 'STREAK_PROTECTOR') {
    title = `🔥 Amankan ${currentStreak} Hari Streak-mu!`;
    body = `Jangan sampai streak-mu terputus hari ini. Selesaikan 1 level sekarang juga!`;
  } else {
    title = `⚡ Yuk, Mulai Latihan Lagi!`;
    body = `Hari baru, kesempatan baru! Buka aplikasi sekarang dan mulai bangun streak latihanmu kembali.`;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}