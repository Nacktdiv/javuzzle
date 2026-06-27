import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
// @ts-ignore
import 'react-native-url-polyfill/auto'

const isSSR = typeof window === 'undefined'

const ExpoWebSecureStoreAdapter = {
  getItem: (key: string) => {
    if (isSSR) return null
    return AsyncStorage.getItem(key)
  },
  setItem: (key: string, value: string) => {
    if (isSSR) return
    return AsyncStorage.setItem(key, value)
  },
  removeItem: (key: string) => {
    if (isSSR) return
    return AsyncStorage.removeItem(key)
  },
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoWebSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});