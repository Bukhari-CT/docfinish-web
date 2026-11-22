"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GateProvider } from "./gate-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, retry: 1 },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      <TooltipProvider>
        <GateProvider>{children}</GateProvider>
      </TooltipProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{ classNames: { toast: "!rounded-lg !border-border !font-sans !text-[13px]" } }}
      />
    </QueryClientProvider>
  );
}
