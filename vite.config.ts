import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import type { Plugin } from "vite";
import pkg from "./package.json";

// Single source for the site's public URL: package.json "homepage". Files that
// need it absolute (index.html canonical/OG/JSON-LD, sitemap.xml, robots.txt)
// write %SITE_URL% and get it substituted at build time.
const SITE_URL = pkg.homepage.replace(/\/$/, "");
const SITE_URL_PUBLIC_FILES = ["sitemap.xml", "robots.txt"];

function siteUrl(): Plugin {
  let outDir = "build";
  return {
    name: "site-url",
    configResolved: (config) => {
      outDir = config.build.outDir;
    },
    transformIndexHtml: (html) => html.replaceAll("%SITE_URL%", SITE_URL),
    closeBundle() {
      for (const file of SITE_URL_PUBLIC_FILES) {
        const target = path.resolve(outDir, file);
        if (fs.existsSync(target)) fs.writeFileSync(target, fs.readFileSync(target, "utf8").replaceAll("%SITE_URL%", SITE_URL));
      }
    },
  };
}

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "build",
  },
  plugins: [
    react(),
    siteUrl(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    css: false,
  },
}));