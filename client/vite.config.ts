import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// TODO: use this in main branch
const allowedHost = "miletracker-client.onrender.com";

// TODO: use this in dev
// const allowedHost = "miletracker-devclient.onrender.com";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB limit
      },
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "MileTracker",
        short_name: "MileTracker",
        description: "Track your trips and mileage like a boss.",
        theme_color: "#219ebc",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [], // disables lightningcss plugin if being implicitly added
    },
  },
  build: {
    outDir: "dist",
  },
  preview: {
    host: true,
    allowedHosts: [allowedHost],
  },
});
