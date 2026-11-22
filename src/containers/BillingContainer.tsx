"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { ErrorState, PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Segmented } from "@/components/ui/segmented";
import { Skeleton } from "@/components/ui/skeleton";
import { api, errorMessage } from "@/lib/api/client";
import type { SubscriptionPlan } from "@/lib/api/types";
import { ME_KEY, useSession } from "@/lib/auth/session";
import { PLAN_MATRIX } from "@/lib/plans";
import { PRICING, yearlyMonthlyEquivalent, yearlySavingsPct } from "@/lib/site";
import { formatDate } from "@/lib/utils";

const STATUS_BADGE = {
  active: { label: "Active", variant: "success" },
  trialing: { label: "Trial", variant: "accent" },
  past_due: { label: "Payment past due", variant: "warning" },
  canceled: { label: "Canceled", variant: "secondary" },
  expired: { label: "Expired", variant: "secondary" },
} as const;

function BillingInner() {
  const qc = useQueryClient();
  const router = useRouter();
  const params = useSearchParams();
  const { me, isPro } = useSession();
  const [interval, setInterval] = useState<"monthly" | "yearly">("yearly");
  const [confirmCancel, setConfirmCancel] = useState(false);

  const sub = useQuery({ queryKey: ["subscription"], queryFn: () => api.billing.subscription() });

  // Webhooks are the source of truth: after returning from checkout, re-read entitlements a few times.
  const checkout = params.get("checkout");
  useEffect(() => {
    if (!checkout) return;
    if (checkout === "error") {
      toast.error("Checkout didn't complete", { description: "You haven't been charged. Try again or contact support." });
      router.replace("/billing");
      return;
    }
    toast.success("Thanks! Confirming your upgrade…");
    let tries = 0;
    const t = window.setInterval(() => {
      tries += 1;
      void qc.invalidateQueries({ queryKey: ME_KEY });
      void qc.invalidateQueries({ queryKey: ["subscription"] });
      if (tries >= 5) window.clearInterval(t);
    }, 2000);
    void qc.invalidateQueries({ queryKey: ME_KEY });
    router.replace("/billing");
    return () => window.clearInterval(t);
  }, [checkout, qc, router]);

  const start = useMutation({
    mutationFn: (plan: SubscriptionPlan) => api.billing.checkout(plan),
    onSuccess: ({ checkoutUrl }) => {
      window.location.assign(checkoutUrl);
    },
    onError: (e) => toast.error("Couldn't start checkout", { description: errorMessage(e) }),
  });

  const cancel = useMutation({
    mutationFn: () => api.billing.cancel(),
    onSuccess: () => {
      toast.success("Subscription canceled", { description: "You keep Pro until the end of the billing period." });
      setConfirmCancel(false);
      void qc.invalidateQueries({ queryKey: ["subscription"] });
    },
    onError: (e) => toast.error("Couldn't cancel", { description: errorMessage(e) }),
  });

  const s = sub.data?.subscription;
  const plan: SubscriptionPlan = interval === "yearly" ? "pro_yearly" : "pro_monthly";
  const billingReady = me?.billing.configured ?? true;

  return (
    <>
      <PageHeader title="Billing" description="Pro access is confirmed by our payment provider and applied automatically." />

      {sub.isPending ? (
        <Skeleton className="h-36" role="status" aria-label="Loading subscription" />
      ) : sub.isError ? (
        <ErrorState message={errorMessage(sub.error)} onRetry={() => void sub.refetch()} />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{isPro ? "DocFinish Pro" : "Free plan"}</CardTitle>
              {s && <Badge variant={STATUS_BADGE[s.status].variant}>{STATUS_BADGE[s.status].label}</Badge>}
            </div>
            <CardDescription>
              {!isPro && "3 PDF exports a month, basic templates, one saved project."}
              {isPro && s && s.currentPeriodEnd && (s.cancelAtPeriodEnd ? `Access ends ${formatDate(s.currentPeriodEnd)}. You won't be charged again.` : `Renews ${formatDate(s.currentPeriodEnd)} · ${s.plan === "pro_yearly" ? "billed yearly" : "billed monthly"}.`)}
              {isPro && !s && "Pro access is active on your account."}
            </CardDescription>
          </CardHeader>
          {isPro && s && !s.cancelAtPeriodEnd && s.status !== "canceled" && (
            <CardContent>
              <Button variant="outline" size="sm" onClick={() => setConfirmCancel(true)}>Cancel subscription</Button>
            </CardContent>
          )}
        </Card>
      )}

      {!isPro && (
        <section className="mb-10 rounded-xl border bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-navy">Upgrade to Pro</h2>
              <p className="mt-1 text-sm text-muted-foreground">Unlimited exports, Google Docs, brand kit, and premium templates. No watermark on any plan.</p>
            </div>
            <Segmented<"monthly" | "yearly"> aria-label="Billing interval" className="w-56" value={interval} onChange={setInterval} options={[{ value: "monthly", label: "Monthly" }, { value: "yearly", label: `Yearly · save ${yearlySavingsPct}%` }]} />
          </div>
          <p className="mt-6 flex items-baseline gap-1.5">
            <span className="font-display text-5xl text-navy tabular-nums">${interval === "yearly" ? yearlyMonthlyEquivalent : PRICING.monthly}</span>
            <span className="text-sm text-muted-foreground">/ month{interval === "yearly" && ` · $${PRICING.yearly} billed yearly`}</span>
          </p>
          <Button className="mt-5" variant="accent" size="lg" onClick={() => start.mutate(plan)} disabled={start.isPending || !billingReady}>
            {start.isPending && <Loader2 className="animate-spin" />} Upgrade to Pro
          </Button>
          {!billingReady && <p className="mt-2 text-xs text-warning">Billing isn&apos;t connected on this workspace yet.</p>}
        </section>
      )}

      <section aria-labelledby="compare">
        <h2 id="compare" className="mb-3 font-display text-xl text-navy">What&apos;s included</h2>
        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Feature</th>
                <th className="px-4 py-2.5 font-medium">Free</th>
                <th className="px-4 py-2.5 font-medium">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {PLAN_MATRIX.map((r) => (
                <tr key={r.feature}>
                  <td className="px-4 py-2.5">{r.feature}</td>
                  {[r.free, r.pro].map((v, i) => (
                    <td key={i} className="px-4 py-2.5 text-muted-foreground">
                      {v === true ? <Check className="size-4 text-success" aria-label="Included" /> : v === false ? <span aria-label="Not included">—</span> : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel your subscription?</DialogTitle>
            <DialogDescription>You&apos;ll keep Pro until {formatDate(s?.currentPeriodEnd)}. After that, projects beyond the free limit become read-only and premium templates are locked.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmCancel(false)}>Keep Pro</Button>
            <Button variant="destructive" onClick={() => cancel.mutate()} disabled={cancel.isPending}>
              {cancel.isPending && <Loader2 className="animate-spin" />} Cancel subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function BillingContainer() {
  return (
    <Suspense>
      <BillingInner />
    </Suspense>
  );
}
