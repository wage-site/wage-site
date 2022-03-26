import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vrp from "vite-raw-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vrp({
      fileRegex: /\.md$/,
    }),
  ],
});
