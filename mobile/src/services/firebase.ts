/**
 * Firebase initialization and setup
 */
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_CONFIG } from '../constants/config';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);

// Initialize Firebase Auth with AsyncStorage for persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);

export default app;
