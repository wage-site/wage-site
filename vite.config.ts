import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vrp from "vite-raw-plugin";
import pnr from "@rollup/plugin-node-resolve";

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
      plugins: [pnr()],
    },
    chunkSizeWarningLimit: 1600,
  },
});
