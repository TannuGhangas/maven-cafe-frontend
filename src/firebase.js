// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBpYWI6mQQzNBMT4rjvZXAhh-RXuiD1Uyo",
  authDomain: "cafeapp-11a07.firebaseapp.com",
  projectId: "cafeapp-11a07",
  storageBucket: "cafeapp-11a07.firebasestorage.app",
  messagingSenderId: "726921778154",
  appId: "1:726921778154:web:baad8d1094ffa594e91893",
  measurementId: "G-8Y583Y9CQ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let messaging = null;
let messagingInitialized = false;

// ------------------------------------------------------------
// INITIALIZE MESSAGING SAFELY
// ------------------------------------------------------------
const initializeMessaging = async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
      messagingInitialized = true;
      console.log("✅ Messaging ready");
    } else {
      console.log("❌ Messaging not supported");
    }
  } catch (err) {
    console.warn("⚠️ Messaging init failed:", err);
  }
};

initializeMessaging();

export { messaging };

// ------------------------------------------------------------
// REQUEST NOTIFICATION PERMISSION + GET TOKEN
// ------------------------------------------------------------
export async function requestNotificationPermissionAndGetToken() {
  try {
    if (!messagingInitialized) await initializeMessaging();
    if (!messaging) return null;

    // Register the service worker ONCE
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    console.log("🔥 SW registered for FCM:", registration);

    const permission = await Notification.requestPermission();
    console.log("Permission result:", permission);
    if (permission !== "granted") return null;

    const token = await getToken(messaging, {
      vapidKey:
        "BLPpu8OZN-PgmVq4-D1SjVHBI5fa0T-VPAsLMD-p-WKB35YGWSkr1QYXoYFt-cX8KUasd1isRG4UnZRHWOSFmdU",
      serviceWorkerRegistration: registration
    });

    if (!token) {
      console.log("⚠️ No FCM token generated");
      return null;
    }

    console.log("✅ Token:", token.substring(0, 12), "...");

    return token;
  } catch (err) {
    console.error("❌ Token generation error:", err);
    return null;
  }
}

// ------------------------------------------------------------
// FOREGROUND MESSAGES
// ------------------------------------------------------------
export function onForegroundMessage(callback) {
  if (messaging && messagingInitialized) {
    onMessage(messaging, (payload) => {
      console.log("📱 Foreground message received:", payload);
      callback(payload);
    });
  }
}

// ------------------------------------------------------------
// DIAGNOSTICS
// ------------------------------------------------------------
export async function checkNotificationSetup() {
  const result = {
    https:
      window.location.protocol === "https:" ||
      window.location.hostname === "10.119.41.34",
    serviceWorker: "serviceWorker" in navigator,
    notification: "Notification" in window,
    messaging: false
  };

  try {
    result.messaging = await isSupported();
  } catch (err) {}

  console.log("🔍 Notification diagnostics:", result);
  return result;
}
