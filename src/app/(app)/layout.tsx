import type { Metadata } from "next";
import { Suspense } from "react";
import { AppLoading, AppShellContainer } from "@/containers/AppShellContainer";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<AppLoading />}>
      <AppShellContainer>{children}</AppShellContainer>
    </Suspense>
  );
}
