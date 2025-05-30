import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// use this in main branch
const allowedHost = "miletracker-client.onrender.com";

// TODO: use this in dev
// const allowedHost = "miletracker-devclient.onrender.com";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
