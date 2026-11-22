"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useGate } from "@/components/providers/gate-provider";
import { Button } from "@/components/ui/button";
import { api, errorMessage, isApiError } from "@/lib/api/client";
import { useSession } from "@/lib/auth/session";
import { cloneSettings, getTemplateOrDefault } from "@/lib/templates";
import { saveGuestDraft } from "@/lib/workspace/guest-draft";

export function UseTemplateButton({ templateId, size = "lg", label = "Use this template" }: { templateId: string; size?: "sm" | "default" | "lg"; label?: string }) {
  const session = useSession();
  const gate = useGate();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const t = getTemplateOrDefault(templateId);

  async function go() {
    if (session.status !== "authenticated") {
      saveGuestDraft({ markdown: t.starterMarkdown, settings: cloneSettings(t.settings), templateId: t.id });
      router.push("/tools/markdown-to-pdf");
      return;
    }
    if (t.tier === "premium" && !session.isPro) {
      gate.requireUpgrade({ reason: `${t.name} is a premium template. Upgrade to Pro to use it in your projects.` });
      return;
    }
    setBusy(true);
    try {
      const { project } = await api.projects.create({ name: t.name, templateId: t.id, markdown: t.starterMarkdown, settings: t.settings });
      router.push(`/editor/${project.id}`);
    } catch (e) {
      if (isApiError(e) && e.isQuotaExceeded) {
        gate.requireUpgrade({ title: "Free includes one project", reason: "Upgrade to Pro for unlimited projects, or open your existing project.", quota: e.quota });
      } else if (isApiError(e) && e.isPlanRequired) {
        gate.requireUpgrade({ reason: `${t.name} is a premium template.` });
      } else {
        toast.error("Couldn't create the project", { description: errorMessage(e) });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button size={size} variant="accent" onClick={() => void go()} disabled={busy}>
      {busy ? <Loader2 className="animate-spin" /> : null}
      {label} <ArrowRight />
    </Button>
  );
}
