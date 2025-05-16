import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// use this in main branch
// const allowedHost = "miletracker-client.onrender.com";

// TODO: comment this out when pushing to main
const allowedHost = "miletracker-devclient.onrender.com";

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
