import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      includeAssets: ["favicon.svg", "robots.txt"],

      manifest: {
        name: "Maven Cafe",
        short_name: "Cafe",
        start_url: "/",
        display: "standalone",
        background_color: "white",
        theme_color: "#ff7f41",

        icons: [
          {
            src: "/icons/icon-192-v2.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512-v2.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,

        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "NetworkFirst",
            options: {
              cacheName: "images-cache",
              expiration: { maxEntries: 200, maxAgeSeconds: 86400 },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages-cache",
            },
          },
        ],
      },

      devOptions: {
        enabled: false, // disables PWA in local dev
      },
    }),
  ],

  build: {
    rollupOptions: {
      output: { manualChunks: undefined },
    },
  },

  server: {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  },

  preview: {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  },
});
