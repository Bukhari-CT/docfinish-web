"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CreditCard, FolderOpen, LayoutDashboard, LogOut, Palette, Settings, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Logo, LogoMark } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";
import { api, errorMessage } from "@/lib/api/client";
import { useSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/brand-kit", label: "Brand kit", icon: Palette },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

function useSignOut() {
  const router = useRouter();
  const qc = useQueryClient();
  return async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      toast.error("Couldn't log out", { description: errorMessage(e) });
      return;
    }
    qc.clear();
    router.replace("/login");
  };
}

export function AppLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas" role="status" aria-label="Loading your workspace">
      <div className="w-64 space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}

export function AppShellContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const signOut = useSignOut();
  const inEditor = pathname.startsWith("/editor/");

  useEffect(() => {
    if (session.status === "guest") router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [session.status, pathname, router]);

  if (session.status === "loading" || session.status === "guest") return <AppLoading />;

  if (session.status === "offline") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
        <LogoMark className="size-10" />
        <h1 className="font-display text-2xl text-navy">We can&apos;t reach DocFinish right now</h1>
        <p className="max-w-sm text-sm text-muted-foreground">Check your connection, then try again. Your editor drafts are safe.</p>
        <Button onClick={() => void session.refetch()}>Try again</Button>
      </div>
    );
  }

  const isPro = session.isPro;

  // Editor: slim rail so the document keeps the whole canvas.
  if (inEditor) {
    return (
      <div className="flex h-dvh bg-canvas">
        <aside className="hidden w-14 shrink-0 flex-col items-center gap-1 bg-navy py-3 md:flex">
          <Link href="/dashboard" aria-label="DocFinish dashboard" className="mb-3">
            <LogoMark className="size-8" />
          </Link>
          {NAV.slice(0, 3).map((n) => (
            <Tooltip key={n.href} content={n.label} side="right">
              <Link href={n.href} aria-label={n.label} className="flex size-10 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white">
                <n.icon className="size-[18px]" />
              </Link>
            </Tooltip>
          ))}
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-canvas">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col bg-navy p-4 text-white md:flex">
        <Logo href="/dashboard" inverse className="px-2 pt-1 pb-6" />
        <nav className="flex flex-col gap-0.5" aria-label="App">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(`${n.href}/`);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/8 hover:text-white",
                  active && "bg-white/12 text-white",
                )}
              >
                <n.icon className="size-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-3">
          {!isPro && (
            <Link href="/billing" className="block rounded-lg border border-white/15 bg-white/6 p-3 text-[13px] hover:bg-white/10">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="size-3.5 text-[#e9c46a]" /> Upgrade to Pro
              </span>
              <span className="mt-1 block text-white/60">Unlimited exports, Google Docs, brand kit.</span>
            </Link>
          )}
          <div className="flex items-center gap-2 border-t border-white/10 pt-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium">{session.user?.name || session.user?.email}</p>
              <Badge variant={isPro ? "pro" : "secondary"} className="mt-1">
                {isPro ? "Pro" : "Free"}
              </Badge>
            </div>
            <Tooltip content="Log out" side="top">
              <Button variant="ghost" size="icon-sm" className="text-white/70 hover:bg-white/10 hover:text-white" onClick={() => void signOut()} aria-label="Log out">
                <LogOut />
              </Button>
            </Tooltip>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-paper/90 px-4 backdrop-blur md:hidden">
          <Logo href="/dashboard" />
          <Button variant="ghost" size="icon-sm" onClick={() => void signOut()} aria-label="Log out">
            <LogOut />
          </Button>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 pb-24 sm:px-8 md:pb-10">{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-paper md:hidden" aria-label="App">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined} className={cn("flex flex-col items-center gap-0.5 py-2 text-[11px] text-muted-foreground", active && "text-cobalt")}>
                <n.icon className="size-[18px]" />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
