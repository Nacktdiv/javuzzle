import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
// @ts-ignore
import 'react-native-url-polyfill/auto'

const isSSR = typeof window === 'undefined'

const ExpoWebSecureStoreAdapter = {
  getItem: (key: string) => {
    if (isSSR) return null
    console.debug('getItem', { key })
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

const supabaseUrl = 'https://iyrwvvgrzboiynmjzuga.supabase.co';
const supabaseAnonKey = 'sb_publishable_IAjxCYe-GOS8JCAQEOvHiA_KO09PLuD';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoWebSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});