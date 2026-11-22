import { ChevronDown } from "lucide-react";

export function Faq({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <div className="divide-y rounded-xl border bg-white">
      {items.map((it) => (
        <details key={it.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-ink">
            {it.q}
            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
