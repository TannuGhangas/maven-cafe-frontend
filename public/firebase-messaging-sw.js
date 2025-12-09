// -----------------------------------------
// public/firebase-messaging-sw.js
// -----------------------------------------

// Load Firebase scripts (compat version for SW)
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBpYWI6mQQzNBMT4rjvZXAhh-RXuiD1Uyo",
  authDomain: "cafeapp-11a07.firebaseapp.com",
  projectId: "cafeapp-11a07",
  storageBucket: "cafeapp-11a07.firebasestorage.app",
  messagingSenderId: "726921778154",
  appId: "1:726921778154:web:baad8d1094ffa594e91893",
  measurementId: "G-8Y583Y9CQ0"
});

const messaging = firebase.messaging();

// -----------------------------------------
// BACKGROUND MESSAGE HANDLER
// -----------------------------------------
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message:", payload);

  const title = payload.notification?.title || payload.data?.title || "🍽️ Maven Cafe";
  const body = payload.notification?.body || payload.data?.body || "You have a new update";

  const options = {
    body,
    icon: "/icons/icon-192-v2.png",
    badge: "/icons/icon-192-v2.png",
    vibrate: [200, 100, 200],
    tag: payload.data?.type || "maven-cafe-notif",
    renotify: true,
    requireInteraction: true,
    data: {
      ...payload.data,
      timestamp: Date.now(),
    },
    actions: [
      { action: "open_app", title: "📱 Open App" },
      { action: "dismiss", title: "❌ Dismiss" }
    ]
  };

  return self.registration.showNotification(title, options);
});

// -----------------------------------------
// NOTIFICATION CLICK HANDLER
// -----------------------------------------
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification clicked");
  event.notification.close();

  if (event.action === "dismiss") return;

  const notificationData = event.notification.data;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.postMessage({ type: "notification_click", data: notificationData });
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow("/").then((newClient) => {
          if (newClient) {
            setTimeout(() => {
              newClient.postMessage({ type: "notification_click", data: notificationData });
            }, 1000);
          }
        });
      }
    })
  );
});

// -----------------------------------------
// FALLBACK PUSH HANDLER (for raw push)
// -----------------------------------------
self.addEventListener("push", (event) => {
  console.log("[firebase-messaging-sw.js] Push event received");

  if (!event.data) return;

  try {
    const data = event.data.json();

    const title = data.notification?.title || data.title || "🍽️ Maven Cafe";
    const body = data.notification?.body || data.body || "New notification received";

    const options = {
      body,
      icon: "/icons/icon-192-v2.png",
      badge: "/icons/icon-192-v2.png",
      vibrate: [200, 100, 200],
      tag: data.tag || Date.now().toString(),  // unique tag to avoid merging notifications
      renotify: true,
      requireInteraction: true,
      data,
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.warn("[firebase-messaging-sw.js] Push data not JSON, fallback text:", event.data.text());
    event.waitUntil(
      self.registration.showNotification("🍽️ Maven Cafe", {
        body: event.data.text(),
        icon: "/icons/icon-192-v2.png",
        badge: "/icons/icon-192-v2.png",
        tag: Date.now().toString(),
        renotify: true,
        requireInteraction: true,
      })
    );
  }
});

// -----------------------------------------
// SERVICE WORKER INSTALL + ACTIVATE
// -----------------------------------------
self.addEventListener("install", (event) => {
  console.log("[firebase-messaging-sw.js] Service Worker installing");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[firebase-messaging-sw.js] Service Worker activated");
  event.waitUntil(clients.claim());
});
