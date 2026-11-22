"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { LiveTemplatePreview } from "@/components/document/live-template-preview";
import { cn } from "@/lib/utils";

export const HERO_MARKDOWN = `# Website Redesign Proposal

Prepared for **Northwind Studio** · October 2026

## Executive summary

Northwind's site converts well on desktop but loses **38% of mobile visitors** before the pricing page. We propose a focused six-week redesign of the four highest-traffic templates.

| Phase | Weeks | Deliverable |
|---|---|---|
| Discovery | 1 | Analytics review, interviews |
| Design | 2–4 | Responsive templates |
| Launch | 5–6 | QA, rollout, handover |

## Next steps

- [x] Kickoff call scheduled
- [ ] Sign the statement of work
- [ ] Share analytics access
`;

const OVERRIDE = { titlePage: false, companyName: "Lumen & Lark" } as const;

export function HeroDemo() {
  const [view, setView] = useState<"split" | "markdown" | "document">("split");
  return (
    <div className="relative">
      <div className="mb-3 flex justify-center gap-1 lg:hidden">
        {(["markdown", "document"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium capitalize",
              (view === v || (view === "split" && v === "document")) ? "bg-navy text-white" : "bg-white text-muted-foreground",
            )}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="grid items-center gap-6 lg:grid-cols-[0.9fr_auto_1fr]">
        <div
          className={cn(
            "overflow-hidden rounded-xl border border-[#2a3a55] bg-navy shadow-xl",
            view === "document" || view === "split" ? "hidden lg:block" : "",
          )}
        >
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-white/20" />
            <span className="size-2.5 rounded-full bg-white/20" />
            <span className="size-2.5 rounded-full bg-white/20" />
            <span className="ml-3 font-mono text-[11px] text-white/50">ai-output.md</span>
          </div>
          <pre className="max-h-[440px] overflow-hidden px-5 py-4 font-mono text-[12px] leading-[1.7] whitespace-pre-wrap text-[#c9d3e6]">
            {HERO_MARKDOWN.split("\n").map((line, i) => (
              <span key={i} className={cn("block", line.startsWith("#") && "text-white", line.startsWith("|") && "text-[#9fb0d6]", line.startsWith("- [") && "text-[#b6c4ff]")}>
                {line || " "}
              </span>
            ))}
          </pre>
        </div>
        <div className="hidden flex-col items-center gap-2 text-muted-foreground lg:flex">
          <span className="flex size-10 items-center justify-center rounded-full border bg-white shadow-sm">
            <ArrowRight className="size-4 text-cobalt" />
          </span>
        </div>
        <div className={cn(view === "markdown" ? "hidden lg:block" : "")}>
          <div className="mx-auto max-w-[460px] rotate-[0.6deg]">
            <LiveTemplatePreview templateId="client-proposal" markdown={HERO_MARKDOWN} settingsOverride={OVERRIDE} />
          </div>
        </div>
      </div>
    </div>
  );
}
