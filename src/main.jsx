// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { requestNotificationPermissionAndGetToken } from "./firebase";

// ------------------------------------------------------
// 🟦 Global Styles
// ------------------------------------------------------
const globalStyles = `
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f7f7f7; }
  h1, h2, h3 { color: #333; }
  button { cursor: pointer; }
  main { max-width: 600px; margin: 0 auto; min-height: calc(100vh - 60px); background-color: white; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

// ------------------------------------------------------
// 🟦 Render App
// ------------------------------------------------------
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

// ------------------------------------------------------
// 🟦 Register Service Worker for Background Notifications
// ------------------------------------------------------
(async () => {
  try {
    if ('serviceWorker' in navigator) {
      console.log('📱 Registering service worker for background notifications...');
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('✅ Service worker registered:', registration.scope);
    } else {
      console.log('❌ Service workers not supported in this browser');
    }
  } catch (err) {
    console.warn('⚠️ Service worker registration failed:', err.message);
  }
})();

// ------------------------------------------------------
// 🟦 Request Notification Permission (ONLY after login)
// ------------------------------------------------------
(async () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const { id: userId, role: userRole } = currentUser;

    if (!userId || !userRole) {
      console.log("⚠️ User not logged in → Not requesting FCM token yet");
      return;
    }

    // Ask permission + get token
    const token = await requestNotificationPermissionAndGetToken();
    if (!token) return;

    console.log("🔑 FCM Token:", token);

    // Clean backend URL
    const apiUrl = import.meta.env.VITE_API_URL || "http://10.119.41.34:3001";
    const cleanApiUrl = apiUrl.replace(/\/api\/?$/, "");

    // Send token to backend
    const response = await fetch(`${cleanApiUrl}/api/save-fcm-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, userId, userRole })
    });

    if (response.ok) {
      console.log(`✅ Token saved for ${userRole}, UserID: ${userId}`);
    } else {
      console.error("❌ Failed to save token:", response.status);
    }
  } catch (err) {
    console.warn("⚠️ FCM initialization failed:", err.message);
  }
})();
