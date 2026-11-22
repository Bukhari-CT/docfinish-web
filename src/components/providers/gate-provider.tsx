"use client";

import { CalendarClock, Check, LockKeyhole, Sparkles } from "lucide-react";
import Link from "next/link";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import type { QuotaExceededDetails } from "@/lib/api/types";
import { formatDate } from "@/lib/utils";

interface UpgradeRequest {
  title?: string;
  reason: string;
  quota?: QuotaExceededDetails;
}
interface AuthRequest {
  title?: string;
  reason: string;
  next?: string;
}

interface GateCtx {
  requireUpgrade: (r: UpgradeRequest) => void;
  requireAuth: (r: AuthRequest) => void;
}

const Ctx = createContext<GateCtx | null>(null);

export function useGate(): GateCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useGate must be used inside <GateProvider>");
  return c;
}

const PRO_PERKS = [
  "Unlimited PDF exports",
  "Unlimited projects with version history",
  "Premium templates: SOP, Resume, Invoice, Academic Paper",
  "Saved brand kit and header/footer presets",
  "Google Docs export and PDF → Markdown",
];

export function GateProvider({ children }: { children: React.ReactNode }) {
  const [upgrade, setUpgrade] = useState<UpgradeRequest | null>(null);
  const [auth, setAuth] = useState<AuthRequest | null>(null);

  const requireUpgrade = useCallback((r: UpgradeRequest) => setUpgrade(r), []);
  const requireAuth = useCallback((r: AuthRequest) => setAuth(r), []);
  const value = useMemo(() => ({ requireUpgrade, requireAuth }), [requireUpgrade, requireAuth]);

  // Only read once the dialog is open (client-side), so the root layout stays prerenderable.
  const next = encodeURIComponent(auth?.next ?? (auth && typeof window !== "undefined" ? window.location.pathname : "/dashboard"));
  const q = upgrade?.quota;
  const pct = q?.limit ? Math.min(100, ((q.used ?? q.limit) / q.limit) * 100) : 0;

  return (
    <Ctx.Provider value={value}>
      {children}

      <Dialog open={!!upgrade} onOpenChange={(o) => !o && setUpgrade(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-[#fbf3dc] text-[#7a5a12]">
              <Sparkles className="size-5" />
            </div>
            <DialogTitle>{upgrade?.title ?? "Upgrade to DocFinish Pro"}</DialogTitle>
            <DialogDescription>{upgrade?.reason}</DialogDescription>
          </DialogHeader>
          {q && (q.limit !== undefined || q.used !== undefined) && (
            <div className="rounded-lg border bg-paper p-4">
              <div className="mb-2 flex items-baseline justify-between text-sm">
                <span className="font-medium">Used this month</span>
                <span className="tabular-nums text-muted-foreground">
                  {q.used ?? q.limit} / {q.limit ?? "—"}
                </span>
              </div>
              <Progress value={pct} indicatorClassName="bg-warning" />
              {q.resetsAt && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarClock className="size-3.5" /> Resets on {formatDate(q.resetsAt, { month: "long", day: "numeric", year: "numeric" })}
                </p>
              )}
            </div>
          )}
          <ul className="space-y-2 text-sm">
            {PRO_PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 text-cobalt" /> {p}
              </li>
            ))}
          </ul>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUpgrade(null)}>
              Not now
            </Button>
            <Button variant="accent" asChild onClick={() => setUpgrade(null)}>
              <Link href="/pricing">See Pro plans</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!auth} onOpenChange={(o) => !o && setAuth(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-cobalt-soft text-cobalt">
              <LockKeyhole className="size-5" />
            </div>
            <DialogTitle>{auth?.title ?? "Create a free account to continue"}</DialogTitle>
            <DialogDescription>{auth?.reason}</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Your draft stays saved in this browser. After you sign in, you can import it into a project.
          </p>
          <DialogFooter>
            <Button variant="outline" asChild onClick={() => setAuth(null)}>
              <Link href={`/login?next=${next}`}>Log in</Link>
            </Button>
            <Button variant="accent" asChild onClick={() => setAuth(null)}>
              <Link href={`/signup?next=${next}`}>Sign up free</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Ctx.Provider>
  );
}
