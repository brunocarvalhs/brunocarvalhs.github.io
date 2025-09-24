import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "/brunocarvalhs.github.io/",
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "docs",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
