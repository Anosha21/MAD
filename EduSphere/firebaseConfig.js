// Firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyQD6BUz__CjEqxp7AZh2bN5v8DF10VIA",
  authDomain: "mad-edusphere-riphah.firebaseapp.com",
  databaseURL: "https://mad-edusphere-riphah-default-rtdb.firebaseio.com",
  projectId: "mad-edusphere-riphah",
  storageBucket: "mad-edusphere-riphah.firebasestorage.app",
  messagingSenderId: "620379289724",
  appId: "1:620379289724:web:d1b220c647530b5db3b1f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Realtime Database
const database = getDatabase(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Export for use in app
export { auth, database, storage };
export default app;