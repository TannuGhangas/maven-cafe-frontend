// -----------------------------------------------------------
// Firebase Messaging Service Worker
// -----------------------------------------------------------
// Load Firebase scripts for service worker
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
// -----------------------------------------------------------
// Initialize Firebase
// -----------------------------------------------------------
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
// -----------------------------------------------------------
// BACKGROUND MESSAGE HANDLER (App CLOSED / Minimized)
// -----------------------------------------------------------
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message:", payload);
  const title =
    payload.notification?.title ||
    payload.data?.title ||
    ":knife_fork_plate: Maven Cafe";
  const body =
    payload.notification?.body ||
    payload.data?.body ||
    "You have a new update";
  const options = {
    body,
    icon: "/icons/icon-192-v2.png",
    badge: "/icons/icon-192-v2.png",
    vibrate: [200, 100, 200],
    tag: payload.data?.type || Date.now().toString(),
    renotify: true,
    requireInteraction: true,
    data: {
      ...payload.data,
      timestamp: Date.now()
    },
    actions: [
      { action: "open_app", title: ":iphone: Open App" },
      { action: "dismiss", title: ":x: Dismiss" }
    ]
  };
  return self.registration.showNotification(title, options);
});
// -----------------------------------------------------------
// NOTIFICATION CLICK HANDLER
// -----------------------------------------------------------
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked");
  event.notification.close();
  if (event.action === "dismiss") return;
  const data = event.notification.data;
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If app already open → focus + send message
      for (const client of clientList) {
        if (client.url.includes(self.location.origin)) {
          client.postMessage({
            type: "notification_click",
            data
          });
          return client.focus();
        }
      }
      // If app closed → open new window
      return clients.openWindow("/").then((newClient) => {
        if (newClient) {
          setTimeout(() => {
            newClient.postMessage({
              type: "notification_click",
              data
            });
          }, 700);
        }
      });
    })
  );
});
// -----------------------------------------------------------
// FALLBACK RAW PUSH (non-FCM / custom payloads)
// -----------------------------------------------------------
self.addEventListener("push", (event) => {
  console.log("[SW] Raw push received");
  if (!event.data) return;
  try {
    const data = event.data.json();
    const title =
      data.notification?.title ||
      data.title ||
      ":knife_fork_plate: Maven Cafe";
    const body =
      data.notification?.body ||
      data.body ||
      "New notification received";
    const options = {
      body,
      icon: "/icons/icon-192-v2.png",
      badge: "/icons/icon-192-v2.png",
      vibrate: [200, 100, 200],
      tag: data.tag || Date.now().toString(),
      renotify: true,
      requireInteraction: true,
      data
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.warn("[SW] Could not parse push JSON:", err);
    event.waitUntil(
      self.registration.showNotification(":knife_fork_plate: Maven Cafe", {
        body: event.data.text(),
        icon: "/icons/icon-192-v2.png",
        badge: "/icons/icon-192-v2.png",
        requireInteraction: true,
        tag: Date.now().toString()
      })
    );
  }
});
// -----------------------------------------------------------
// SERVICE WORKER LIFECYCLE
// -----------------------------------------------------------
self.addEventListener("install", () => {
  console.log("[SW] Installed");
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");
  event.waitUntil(clients.claim());
});
