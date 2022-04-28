import pnr from "@rollup/plugin-node-resolve";
import react from "@vitejs/plugin-react";
import css from "rollup-plugin-import-css";
import { defineConfig } from "vite";
import vrp from "vite-raw-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vrp({
      fileRegex: /\.md$/,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        minifyInternalExports: true,
      },
      plugins: [pnr(), css()],
    },
    chunkSizeWarningLimit: 1600,
  },
});
