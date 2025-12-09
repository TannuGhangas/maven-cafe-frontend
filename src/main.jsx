import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { requestNotificationPermissionAndGetToken } from "./firebase";

// Global styles
const globalStyles = `
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f7f7f7; }
    h1, h2, h3 { color: #333; }
    button { cursor: pointer; }
    main { max-width: 600px; margin: 0 auto; min-height: calc(100vh - 60px); background-color: white; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

// Render App
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

/* ======================================================================
   🔥 FIXED: ONLY ONE SERVICE WORKER SHOULD EXIST
   - Remove service-worker.js registration
   - Do NOT register any default SW with Vite
   - Only register firebase-messaging-sw.js
====================================================================== */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then(() => console.log("✔ Firebase Messaging SW registered"))
      .catch((err) =>
        console.error("❌ Firebase Messaging SW registration failed:", err)
      );
  });
}

/* ======================================================================
   🔥 Request FCM Token + Send Token To Backend
====================================================================== */
(async () => {
  try {
    // Browser capability check
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      console.log("⚠️ Push notifications not supported on this device");
      return;
    }

    // Ask permission + get token
    const token = await requestNotificationPermissionAndGetToken();
    if (!token) {
      console.log("⚠️ No FCM token received");
      return;
    }

    console.log("🔑 FCM Token:", token);

    // Get user from localStorage
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const { id: userId, role: userRole } = currentUser;

    if (!userId || !userRole) {
      console.log("⚠️ No logged-in user → Skipping FCM token send");
      return;
    }

    // Build clean backend URL
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
    const cleanApiUrl = apiUrl.replace(/\/api\/?$/, "");

    // Send token → backend
    const response = await fetch(`${cleanApiUrl}/api/save-fcm-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, userId, userRole }),
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
