"use client";

import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useGate } from "@/components/providers/gate-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { api, errorMessage, isApiError } from "@/lib/api/client";
import type { SubscriptionPlan } from "@/lib/api/types";
import { useSession } from "@/lib/auth/session";
import { PRICING, yearlyMonthlyEquivalent, yearlySavingsPct } from "@/lib/site";

const FREE = ["3 PDF exports per month", "1 project", "Basic templates", "Headers, footers & page numbers", "Preview branding", "No watermark"];
const PRO = [
  "Unlimited PDF exports",
  "Unlimited projects + version history",
  "Premium templates (SOP, Resume, Invoice, Academic Paper)",
  "Saved brand kit & header/footer presets",
  "Google Docs export",
  "PDF → Markdown",
  "Priority conversion queue",
];

export function PricingPlans() {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [busy, setBusy] = useState(false);
  const session = useSession();
  const gate = useGate();
  const isPro = session.isPro;

  async function checkout() {
    if (session.status !== "authenticated") {
      gate.requireAuth({ title: "Create an account first", reason: "Sign up or log in, then upgrade to Pro.", next: "/pricing" });
      return;
    }
    const plan: SubscriptionPlan = cycle === "monthly" ? "pro_monthly" : "pro_yearly";
    setBusy(true);
    try {
      const { checkoutUrl } = await api.billing.checkout(plan);
      window.location.assign(checkoutUrl);
    } catch (e) {
      setBusy(false);
      if (isApiError(e) && e.code === "PROVIDER_NOT_CONFIGURED") {
        toast.error("Billing isn't set up yet", { description: "Checkout activates once billing is configured for this workspace." });
      } else toast.error("Couldn't start checkout", { description: errorMessage(e) });
    }
  }

  const price = cycle === "monthly" ? PRICING.monthly : PRICING.yearly;

  return (
    <div>
      <div className="mx-auto mb-10 flex max-w-xs flex-col items-center gap-2">
        <Segmented
          aria-label="Billing cycle"
          value={cycle}
          onChange={setCycle}
          className="bg-white"
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "yearly", label: `Yearly · save ${yearlySavingsPct}%` },
          ]}
        />
      </div>
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        <div className="flex flex-col rounded-2xl border bg-white p-8">
          <h2 className="text-lg font-semibold">Free</h2>
          <p className="mt-1 text-sm text-muted-foreground">For trying DocFinish and occasional documents.</p>
          <p className="mt-6 font-display text-5xl font-medium">$0</p>
          <p className="mt-1 text-sm text-muted-foreground">forever</p>
          <ul className="mt-8 flex-1 space-y-3 text-[15px]">
            {FREE.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-cobalt" /> {f}
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" size="lg" className="mt-8">
            <Link href={session.status === "authenticated" ? "/dashboard" : "/signup"}>
              {session.status === "authenticated" ? "Go to dashboard" : "Start free"}
            </Link>
          </Button>
        </div>
        <div className="relative flex flex-col rounded-2xl border-2 border-navy bg-navy p-8 text-white shadow-xl">
          <Badge className="absolute -top-3 left-8 bg-cobalt">Most popular</Badge>
          <h2 className="text-lg font-semibold">Pro</h2>
          <p className="mt-1 text-sm text-white/65">For consultants, teams, and anyone sending documents weekly.</p>
          <p className="mt-6 font-display text-5xl font-medium">
            ${price}
            <span className="ml-1 font-sans text-base font-normal text-white/60">/{cycle === "monthly" ? "month" : "year"}</span>
          </p>
          <p className="mt-1 text-sm text-white/60">
            {cycle === "yearly"
              ? `$${yearlyMonthlyEquivalent.toFixed(0)}/month billed yearly`
              : `or $${PRICING.yearly}/year (save ${yearlySavingsPct}%)`}
          </p>
          <ul className="mt-8 flex-1 space-y-3 text-[15px]">
            {PRO.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-[#9fb2ff]" /> {f}
              </li>
            ))}
          </ul>
          {isPro ? (
            <Button asChild variant="inverse" size="lg" className="mt-8">
              <Link href="/billing">Manage subscription</Link>
            </Button>
          ) : (
            <Button variant="inverse" size="lg" className="mt-8" onClick={() => void checkout()} disabled={busy}>
              {busy && <Loader2 className="animate-spin" />} Upgrade to Pro
            </Button>
          )}
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">No watermark on any plan, including free PDFs. Cancel anytime.</p>
    </div>
  );
}
