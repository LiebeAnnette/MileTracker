import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Replace this with your actual Render frontend URL
const allowedHost = "miletracker-client.onrender.com";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  preview: {
    host: true,
    allowedHosts: [allowedHost],
  },
});
