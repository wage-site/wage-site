import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vrp from "vite-raw-plugin";
import pnr from "@rollup/plugin-node-resolve";
import pb from "@rollup/plugin-babel";
import pcss from "rollup-plugin-postcss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vrp({
      fileRegex: /\.md$/,
    }),
    pnr(),
  ],
  build: {
    rollupOptions: {
      output: {
        minifyInternalExports: true,
      },
    },
  },
});
