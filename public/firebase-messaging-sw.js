// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

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

// Handle background messages (when app is closed or in background)
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] ✅ Received background message:', payload);
  
  // Extract notification data with fallbacks
  const notificationTitle = payload.notification?.title || 
                           payload.data?.title || 
                           '🍽️ Maven Cafe';
  
  const notificationBody = payload.notification?.body || 
                          payload.data?.body || 
                          'You have a new notification';
  
  const notificationIcon = '/icons/icon-192-v2.png';
  const notificationBadge = '/icons/icon-192-v2.png';
  
  // Enhanced notification options for better visibility
  const notificationOptions = {
    body: notificationBody,
    icon: notificationIcon,
    badge: notificationBadge,
    vibrate: [200, 100, 200, 100, 200], // More distinctive vibration pattern
    tag: payload.data?.type || 'maven-cafe-notification',
    requireInteraction: true, // Keep notification visible until user interacts
    silent: false,
    renotify: true,
    data: {
      ...payload.data,
      timestamp: Date.now(),
      click_action: 'FLUTTER_NOTIFICATION_CLICK'
    },
    actions: [
      { 
        action: 'open_app', 
        title: '📱 Open App',
        icon: '/icons/icon-192-v2.png'
      },
      { 
        action: 'dismiss', 
        title: '❌ Dismiss' 
      }
    ]
  };

  console.log('[firebase-messaging-sw.js] 📢 Showing notification:', {
    title: notificationTitle,
    body: notificationBody,
    tag: notificationOptions.tag
  });

  // Show notification with promise handling
  return self.registration.showNotification(notificationTitle, notificationOptions)
    .then(() => {
      console.log('[firebase-messaging-sw.js] ✅ Notification displayed successfully');
    })
    .catch((error) => {
      console.error('[firebase-messaging-sw.js] ❌ Failed to show notification:', error);
    });
});

// Handle notification click events
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] 🔔 Notification clicked:', event);
  
  event.notification.close();
  
  const action = event.action;
  const notificationData = event.notification.data;
  
  if (action === 'dismiss') {
    console.log('[firebase-messaging-sw.js] 👋 Notification dismissed');
    return;
  }
  
  // Default action or 'open_app' - open the application
  event.waitUntil(
    clients.matchAll({ 
      type: 'window', 
      includeUncontrolled: true 
    }).then(function(clientList) {
      
      // Try to focus existing app window first
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          console.log('[firebase-messaging-sw.js] 🎯 Focusing existing app window');
          // Pass notification data to the app
          client.postMessage({
            type: 'notification_click',
            data: notificationData
          });
          return client.focus();
        }
      }
      
      // If no existing window, open new one
      if (clients.openWindow) {
        console.log('[firebase-messaging-sw.js] 🆕 Opening new app window');
        return clients.openWindow('/')
          .then((newClient) => {
            // Pass data to new window after it's loaded
            if (newClient) {
              setTimeout(() => {
                newClient.postMessage({
                  type: 'notification_click',
                  data: notificationData
                });
              }, 1000);
            }
          });
      }
    }).catch((error) => {
      console.error('[firebase-messaging-sw.js] ❌ Error handling notification click:', error);
    })
  );
});

// Handle push events directly (fallback for non-FCM push notifications)
self.addEventListener('push', function(event) {
  console.log('[firebase-messaging-sw.js] 📨 Push event received');
  
  if (event.data) {
    try {
      const data = event.data.json();
      console.log('[firebase-messaging-sw.js] 📋 Push event data:', data);
      
      // Auto-convert push events to notifications if they have notification data
      if (data.notification || data.title) {
        const title = data.notification?.title || data.title || '🍽️ Maven Cafe';
        const body = data.notification?.body || data.body || 'New notification received';
        
        event.waitUntil(
          self.registration.showNotification(title, {
            body: body,
            icon: '/icons/icon-192-v2.png',
            badge: '/icons/icon-192-v2.png',
            vibrate: [200, 100, 200],
            tag: 'push-fallback',
            requireInteraction: true,
            data: data
          })
        );
      }
    } catch (e) {
      console.log('[firebase-messaging-sw.js] 📝 Push data (text):', event.data.text());
    }
  }
});

// Handle service worker installation
self.addEventListener('install', function(event) {
  console.log('[firebase-messaging-sw.js] 🔧 Service Worker installing');
  // Skip waiting to ensure immediate activation
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', function(event) {
  console.log('[firebase-messaging-sw.js] 🚀 Service Worker activated');
  // Take control of all clients immediately
  event.waitUntil(clients.claim());
});
