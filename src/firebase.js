// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBpYWI6mQQzNBMT4rjvZXAhh-RXuiD1Uyo",
  authDomain: "cafeapp-11a07.firebaseapp.com",
  projectId: "cafeapp-11a07",
  storageBucket: "cafeapp-11a07.firebasestorage.app",
  messagingSenderId: "726921778154",
  appId: "1:726921778154:web:baad8d1094ffa594e91893",
  measurementId: "G-8Y583Y9CQ0"
};

const app = initializeApp(firebaseConfig);

// Initialize messaging only if supported (prevents crash on iOS Safari, etc.)
let messaging = null;
let messagingInitialized = false;

const initializeMessaging = async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
      messagingInitialized = true;
      console.log('✅ Firebase Messaging initialized successfully');
    } else {
      console.log('❌ Firebase Messaging not supported on this browser/device');
    }
  } catch (err) {
    console.warn('⚠️ Firebase Messaging initialization failed:', err);
  }
};

// Initialize messaging immediately
initializeMessaging();

export { messaging };

// request FCM token (vapidKey from Console)
export async function requestNotificationPermissionAndGetToken() {
  try {
    // Ensure messaging is initialized
    if (!messagingInitialized) {
      await initializeMessaging();
    }
    
    if (!messaging) {
      console.log('❌ Firebase Messaging not available');
      return null;
    }
    
    // Check if service worker is registered
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('✅ Service Worker registered:', registration);
    
    const permission = await Notification.requestPermission();
    console.log('📱 Notification permission status:', permission);
    
    if (permission !== "granted") {
      console.log('❌ Notification permission denied');
      return null;
    }
    
    const token = await getToken(messaging, { 
      vapidKey: "BLPpu8OZN-PgmVq4-D1SjVHBI5fa0T-VPAsLMD-p-WKB35YGWSkr1QYXoYFt-cX8KUasd1isRG4UnZRHWOSFmdU",
      serviceWorkerRegistration: registration 
    });
    
    if (token) {
      console.log('✅ FCM Token received:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ No FCM token received');
    }
    
    return token;
  } catch (err) {
    console.error("❌ FCM token error:", err);
    return null;
  }
}

// optional: receive foreground messages
export function onForegroundMessage(callback) {
  if (messaging && messagingInitialized) {
    onMessage(messaging, (payload) => {
      console.log('📱 Foreground message received:', payload);
      callback(payload);
    });
  } else {
    console.log('⚠️ Cannot setup foreground message listener - messaging not initialized');
  }
}

// Check if notifications are properly configured
export async function checkNotificationSetup() {
  const checks = {
    https: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
    serviceWorker: 'serviceWorker' in navigator,
    notification: 'Notification' in window,
    messaging: false
  };
  
  try {
    checks.messaging = await isSupported();
  } catch (err) {
    console.warn('Messaging support check failed:', err);
  }
  
  console.log('🔍 Notification Setup Checks:', checks);
  return checks;
}
