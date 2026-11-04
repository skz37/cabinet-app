import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// SecureStore only exists on iOS and Android; the web build falls back to AsyncStorage.
const isWeb = Platform.OS === 'web';

export const secureStorage = {
  get(key: string): Promise<string | null> {
    return isWeb ? AsyncStorage.getItem(key) : SecureStore.getItemAsync(key);
  },
  set(key: string, value: string): Promise<void> {
    return isWeb ? AsyncStorage.setItem(key, value) : SecureStore.setItemAsync(key, value);
  },
  remove(key: string): Promise<void> {
    return isWeb ? AsyncStorage.removeItem(key) : SecureStore.deleteItemAsync(key);
  },
};
