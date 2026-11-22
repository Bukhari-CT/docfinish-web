"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DocumentSettings } from "@/lib/api/types";
import { extractTitle } from "@/lib/markdown/pipeline";
import { getTemplateOrDefault } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { PagesView } from "./pages-view";
import { usePaginatedDocument } from "./use-paginated-document";

/**
 * Live rendering of a template's starter content with the real renderer + paginator.
 * Scales to fit its container width.
 */
export function LiveTemplatePreview({
  templateId,
  maxPages = 1,
  className,
  markdown,
  direction = "column",
  settingsOverride,
}: {
  templateId: string;
  maxPages?: number;
  className?: string;
  markdown?: string;
  direction?: "column" | "row";
  settingsOverride?: Partial<DocumentSettings>;
}) {
  const t = getTemplateOrDefault(templateId);
  const md = markdown ?? t.starterMarkdown;
  const settings = useMemo(() => ({ ...t.settings, ...settingsOverride }), [t, settingsOverride]);
  const doc = usePaginatedDocument({
    markdown: md,
    settings,
    templateId: t.id,
    title: extractTitle(md),
  });

  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.35);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pageW = doc.geometry.widthPx;
    const update = () => {
      const w = el.clientWidth;
      if (!w) return;
      const perRow = direction === "row" ? Math.max(1, maxPages) : 1;
      const gap = direction === "row" ? 24 * (perRow - 1) : 0;
      setZoom(Math.max(0.15, (w - 1) / (pageW * perRow + gap)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [doc.geometry.widthPx, maxPages, direction]);

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      {doc.measurer}
      <PagesView
        doc={doc}
        settings={settings}
        templateId={t.id}
        zoom={zoom}
        maxPages={maxPages}
        className={direction === "row" ? "!flex-row !items-start justify-center" : undefined}
        pageClassName="shadow-[0_1px_2px_rgba(20,22,26,0.06),0_12px_32px_-12px_rgba(20,22,26,0.22)]"
      />
    </div>
  );
}
