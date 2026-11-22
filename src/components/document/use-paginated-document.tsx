"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { DocumentSettings } from "@/lib/api/types";
import { renderMarkdown } from "@/lib/markdown/pipeline";
import { computeGeometry } from "@/lib/pagination/geometry";
import { paginate, type PaginatedPage } from "@/lib/pagination/paginate";
import { documentStyleVars } from "@/lib/pagination/style";
import { formatDocDate, getPageChrome } from "@/lib/pagination/tokens";
import { getTemplate } from "@/lib/templates";

export type PaginationStatus = "idle" | "paginating" | "ready" | "error";

export interface UsePaginatedDocumentArgs {
  markdown: string;
  settings: DocumentSettings;
  templateId: string;
  title: string;
  debounceMs?: number;
}

/**
 * Renders Markdown → sanitized HTML, then paginates it in a hidden measuring
 * container that has the exact page content width and the same CSS as the pages.
 * Re-paginates (debounced) on content/settings changes and when web fonts finish loading.
 */
export function usePaginatedDocument({ markdown, settings, templateId, title, debounceMs = 220 }: UsePaginatedDocumentArgs) {
  const deferred = useDeferredValue(markdown);
  const html = useMemo(() => renderMarkdown(deferred), [deferred]);
  const geometry = useMemo(() => computeGeometry(settings), [settings]);
  const template = getTemplate(templateId);
  const styleVars = useMemo(() => documentStyleVars(settings, template?.styles), [settings, template]);
  const styleKey = useMemo(() => JSON.stringify(styleVars), [styleVars]);

  const measureRef = useRef<HTMLDivElement>(null);
  const runId = useRef(0);
  const [pages, setPages] = useState<PaginatedPage[] | null>(null);
  const [status, setStatus] = useState<PaginationStatus>("idle");
  const [fontsTick, setFontsTick] = useState(0);
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(formatDocDate());
    if (typeof document === "undefined" || !document.fonts) return;
    const onFonts = () => setFontsTick((t) => t + 1);
    document.fonts.addEventListener("loadingdone", onFonts);
    return () => document.fonts.removeEventListener("loadingdone", onFonts);
  }, []);

  const titleLogo =
    settings.logo.dataUrl && settings.logo.placement === "title"
      ? { dataUrl: settings.logo.dataUrl, heightMm: settings.logo.heightMm }
      : null;

  useEffect(() => {
    const root = measureRef.current;
    if (!root) return;
    const id = ++runId.current;
    setStatus("paginating");
    const t = setTimeout(
      async () => {
        try {
          const result = await paginate(root, html, {
            contentHeightPx: geometry.contentHeightPx,
            titlePage: settings.titlePage,
            titleLogo,
            isStale: () => id !== runId.current,
          });
          if (id !== runId.current || !result) return;
          setPages(result);
          setStatus("ready");
        } catch (err) {
          if (id !== runId.current) return;
          console.error("Pagination failed", err);
          setStatus("error");
        }
      },
      pages === null ? 0 : debounceMs,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- titleLogo/pages are derived; keyed by primitives below
  }, [html, geometry.contentWidthPx, geometry.contentHeightPx, styleKey, templateId, settings.titlePage, titleLogo?.dataUrl, titleLogo?.heightMm, fontsTick, debounceMs]);

  const resolvedTitle = title || "Untitled document";
  const chromes = useMemo(
    () => (pages ?? []).map((_, i) => getPageChrome(settings, i, pages?.length ?? 1, { title: resolvedTitle, date })),
    [pages, settings, resolvedTitle, date],
  );

  const measurer = (
    <div
      aria-hidden
      data-df-template={templateId}
      style={{ ...styleVars, position: "absolute", left: -100000, top: 0, visibility: "hidden", pointerEvents: "none", contain: "layout style" }}
    >
      <div ref={measureRef} className="df-doc" style={{ width: geometry.contentWidthPx }} />
    </div>
  );

  return { html, pages, chromes, geometry, styleVars, status, measurer };
}

export type PaginatedDocument = ReturnType<typeof usePaginatedDocument>;
