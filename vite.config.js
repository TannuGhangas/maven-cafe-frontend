import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
  registerType: "autoUpdate",
  includeAssets: ["favicon.svg", "robots.txt"],

  devOptions: {
    enabled: false   // disable PWA during development
  },

  manifest: {
    name: "Maven Cafe",
    short_name: "Cafe",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff7f41",
    icons: [
      {
        src: "/icons/icon-192-v2.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512-v2.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  },


      // Rename PWA SW to avoid conflict with FCM SW
      filename: "pwa-sw.js",

      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: { cacheName: "pages-cache" }
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "NetworkFirst",
            options: {
              cacheName: "images-cache",
              expiration: { maxEntries: 200, maxAgeSeconds: 86400 }
            }
          }
        ]
      }
    })
  ],

  // Development server configuration
  server: {
    port: 5173,
    host: true,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0"
    }
  },

  // Build configuration
  build: {
    rollupOptions: {
      output: { manualChunks: undefined }
    },
    sourcemap: true
  },

  // Development optimization
  optimizeDeps: {
    include: ["react", "react-dom"]
  }
});
