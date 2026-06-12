import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],

    // lucide-react tree shaking 최적화: 개별 아이콘만 번들에 포함되도록
    optimizeDeps: {
      include: ["lucide-react"],
    },

    build: {
      rollupOptions: {
        output: {
          // lucide-react를 별도 청크로 분리하여 캐싱 효율 향상
          manualChunks: {
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    server: {
      proxy: {
        "/api/notifications/subscribe": {
          target: env.VITE_DEV_API_PROXY_TARGET,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on("proxyRes", (proxyRes) => {
              if (proxyRes.headers) {
                proxyRes.headers["cache-control"] = "no-cache";
                proxyRes.headers["x-accel-buffering"] = "no";
              }
            });
          },
        },
        "/api": {
          target: env.VITE_DEV_API_PROXY_TARGET,
          changeOrigin: true,
        },
        "/terms": {
          target: env.VITE_DEV_API_PROXY_TARGET,
          changeOrigin: true,
        },
      },
    },

    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/setupTests.ts"],
      coverage: {
        provider: "v8",
        reporter: ["text", "lcov"],
      },
    },
  };
});