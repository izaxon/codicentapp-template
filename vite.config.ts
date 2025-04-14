import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";
import dotenv from "dotenv";
import { readFileSync } from "fs";

let buildTarget = "codicent";
try {
  buildTarget = readFileSync("build_target", "utf-8").trim();
  console.log("Build target:", buildTarget);
} catch {
  buildTarget = "codicent";
  console.warn("Error reading build_target file, defaults to 'codicent'");
}

dotenv.config({ path: __dirname + "/config/.env." + buildTarget });

if (!process.env.VITE_MANIFEST_SCOPE) {
  throw new Error("VITE_MANIFEST_SCOPE is not defined in the environment variables");
}

const logo192 = process.env.VITE_MANIFEST_SCOPE + "images/logo192.png";
const logo512 = process.env.VITE_MANIFEST_SCOPE + "images/logo512.png";
const indexTitle = process.env.VITE_INDEX_TITLE;
const indexDescription = process.env.VITE_INDEX_DESCRIPTION;
const indexThemeColor = process.env.VITE_INDEX_THEME_COLOR;
const id = process.env.VITE_MANIFEST_ID;
const scope = process.env.VITE_MANIFEST_SCOPE;
const startUrl = process.env.VITE_MANIFEST_START_URL;

if (!id || !logo192 || !logo512 || !indexTitle || !indexDescription || !indexThemeColor || !scope || !startUrl) {
  const missingVariables = [
    !id ? "VITE_MANIFEST_ID" : null,
    !logo192 ? "VITE_MANIFEST_LOGO_192" : null,
    !logo512 ? "VITE_MANIFEST_LOGO_512" : null,
    !indexTitle ? "VITE_INDEX_TITLE" : null,
    !indexDescription ? "VITE_INDEX_DESCRIPTION" : null,
    !indexThemeColor ? "VITE_INDEX_THEME_COLOR" : null,
    !scope ? "VITE_MANIFEST_SCOPE" : null,
    !startUrl ? "VITE_MANIFEST_START_URL" : null,
  ].filter(Boolean);
  throw new Error("Missing required environment variables: " + missingVariables.join(", "));
}

if (process.env.VITE_AUTH_REDIRECT_URL?.includes("localhost")) {
  console.warn("\nVITE_AUTH_REDIRECT_URL contains localhost, this may cause issues in production.\n");
}

export default defineConfig({
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: "autoUpdate",
      // includeAssets: [logo192, logo512],
      manifest: {
        name: indexTitle,
        short_name: indexTitle,
        description: indexDescription,
        theme_color: "#" + indexThemeColor,
        start_url: startUrl,
        scope: scope,
        icons: [
          {
            src: logo192,
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: logo512,
            sizes: "512x512",
            type: "image/png",
          },
        ],
        display: "standalone",
        display_override: ["window-controls-overlay", "standalone", "browser"],
        orientation: "portrait",
        id: id,
        dir: "ltr",
        share_target: {
          action: "./#/new",
          method: "GET",
          params: {
            text: "text",
            url: "url",
          },
        },
        categories: ["business", "education", "finance", "productivity", "utilities"],
        shortcuts: [
          {
            name: "Spara",
            url: process.env.VITE_MANIFEST_SCOPE + "#/new",
            icons: [
              {
                src: logo192,
                type: "image/png",
                sizes: "192x192",
              },
            ],
          },
          {
            name: "Chatta",
            url: process.env.VITE_MANIFEST_SCOPE + "#/chat",
            icons: [
              {
                src: logo192,
                type: "image/png",
                sizes: "192x192",
              },
            ],
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 3600000,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/izaxon\.github\.io\/.*$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "codicent-cache",
            },
          },
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "cdn-cache",
            },
          },
          {
            urlPattern: /\/api\//,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
            },
          },
          {
            urlPattern: /\/.*\.(png|jpg|jpeg|gif|svg)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
        ],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/\/app\//], // Matches /app/ anywhere in the URL
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
    https: {},
  },
  base: process.env.VITE_MANIFEST_SCOPE,
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        },
      },
    },
    chunkSizeWarningLimit: 3600000, // Optional: Adjust the limit as needed
  },
});
