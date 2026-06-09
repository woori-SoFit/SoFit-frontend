import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import dns from "node:dns";

// Node 17+ 에서 IPv6 우선 해석으로 인한 ECONNREFUSED 방지
dns.setDefaultResultOrder("ipv4first");

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname), "");

  return {
    plugins: [react(), tailwindcss()] as never[],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      host: "localhost",
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:8081",
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/setupTests.ts",
    },
  };
});
