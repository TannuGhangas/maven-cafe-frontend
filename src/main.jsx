import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { requestNotificationPermissionAndGetToken, onForegroundMessage } from "./firebase";

// Basic global style reset
const globalStyles = `
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f7f7f7; }
    h1, h2, h3 { color: #333; }
    button { cursor: pointer; }
    main { max-width: 600px; margin: 0 auto; min-height: calc(100vh - 60px); background-color: white; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

// Render app
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

// ✅ Existing PWA Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Existing PWA SW
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("✔ Service Worker Registered"))
      .catch(err => console.log("❌ SW registration failed:", err));

    // Firebase Messaging SW
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then(() => console.log("✔ Firebase Messaging SW Registered"))
      .catch(err => console.log("❌ Firebase SW registration failed:", err));
  });
}

// ✅ Request FCM token and send to backend (with error handling for mobile)
(async () => {
  try {
    // Check if Firebase messaging is supported
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.log('⚠️ Push notifications not supported on this device');
      return;
    }
    
    const token = await requestNotificationPermissionAndGetToken();
    if (token) {
      // Get current user from localStorage (this should be set after login)
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = currentUser.id;
      const userRole = currentUser.role;
      
      if (userId && userRole) {
        // send token to your backend: POST /save-fcm-token { userId, token, userRole }
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        
        // Remove trailing /api if present to avoid double /api/api/ issue
        const cleanApiUrl = apiUrl.replace(/\/api\/?$/, '');
        
        try {
          const response = await fetch(`${cleanApiUrl}/api/save-fcm-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, userId, userRole })
          });
          
          if (response.ok) {
            console.log('✅ FCM token sent to backend for', userRole, 'UserID:', userId);
          } else {
            console.error('❌ Failed to send FCM token to backend:', response.status);
          }
        } catch (fetchError) {
          console.error('❌ Network error sending FCM token:', fetchError.message);
        }
      } else {
        console.log('⚠️ No user logged in, skipping FCM token registration');
      }
    } else {
      console.log('⚠️ No FCM token received');
    }
  } catch (err) {
    console.warn('⚠️ FCM initialization failed (may not be supported on this device):', err.message);
  }
})();
