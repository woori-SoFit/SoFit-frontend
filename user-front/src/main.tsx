import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { router } from "./router/routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5분간 fresh 상태 유지
      staleTime: 1000 * 60 * 5,
      // 네트워크 오류 시 1회 재시도
      retry: 1,
      // 창 포커스 시 자동 refetch 비활성화
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
