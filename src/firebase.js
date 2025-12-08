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
isSupported().then(supported => {
  if (supported) {
    messaging = getMessaging(app);
  } else {
    console.log('Firebase Messaging not supported on this browser');
  }
}).catch(err => {
  console.warn('Firebase Messaging support check failed:', err);
});

export { messaging };

// request FCM token (vapidKey from Console)
export async function requestNotificationPermissionAndGetToken() {
  try {
    // Check if messaging is supported
    const supported = await isSupported();
    if (!supported) {
      console.log('Firebase Messaging not supported on this device');
      return null;
    }
    
    if (!messaging) {
      messaging = getMessaging(app);
    }
    
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;
    const token = await getToken(messaging, { vapidKey: "BLPpu8OZN-PgmVq4-D1SjVHBI5fa0T-VPAsLMD-p-WKB35YGWSkr1QYXoYFt-cX8KUasd1isRG4UnZRHWOSFmdU" });
    return token; // send this token to your backend and save it
  } catch (err) {
    console.error("FCM token error:", err);
    return null;
  }
}

// optional: receive foreground messages
export function onForegroundMessage(callback) {
  if (messaging) {
    onMessage(messaging, (payload) => callback(payload));
  }
}
