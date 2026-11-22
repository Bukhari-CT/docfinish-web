import type { Align, DocumentSettings, HeaderFooterSettings, PageNumberFormat } from "@/lib/api/types";

export interface TokenContext {
  title: string;
  date: string;
  page: number;
  pages: number;
  company: string;
}

const TOKEN_RE = /\{(title|date|page|pages|company)\}/g;

/** Replace {title} {date} {page} {pages} {company}. Unknown tokens are left untouched. */
export function resolveTokens(text: string, ctx: TokenContext): string {
  if (!text) return "";
  return text.replace(TOKEN_RE, (_, key: keyof TokenContext) => String(ctx[key] ?? ""));
}

export function formatPageNumber(format: PageNumberFormat, page: number, total: number): string {
  switch (format) {
    case "page-n":
      return `Page ${page}`;
    case "n-of-total":
      return `${page} / ${total}`;
    case "n":
    default:
      return String(page);
  }
}

export function formatDocDate(d: Date = new Date()): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export interface BandSlots {
  left: string;
  center: string;
  right: string;
}

export interface PageChrome {
  header: BandSlots | null;
  footer: BandSlots | null;
  /** Displayed page number (after startAt offset) */
  pageNumber: number;
}

function bandVisible(band: HeaderFooterSettings, isFirst: boolean) {
  return band.enabled && (!isFirst || band.showOnFirstPage);
}

function resolveBand(band: HeaderFooterSettings, ctx: TokenContext): BandSlots {
  return {
    left: resolveTokens(band.left, ctx),
    center: resolveTokens(band.center, ctx),
    right: resolveTokens(band.right, ctx),
  };
}

function appendToSlot(slots: BandSlots, align: Align, text: string): BandSlots {
  const current = slots[align];
  return { ...slots, [align]: current ? `${current} · ${text}` : text };
}

/**
 * Compute the resolved header/footer text for a page.
 * `pageIndex` is 0-based; `totalPages` is the number of rendered pages.
 */
export function getPageChrome(
  settings: Pick<DocumentSettings, "header" | "footer" | "pageNumbers" | "companyName">,
  pageIndex: number,
  totalPages: number,
  base: { title: string; date: string },
): PageChrome {
  const start = Number.isFinite(settings.pageNumbers.startAt) ? settings.pageNumbers.startAt : 1;
  const pageNumber = start + pageIndex;
  const lastNumber = start + totalPages - 1;
  const ctx: TokenContext = {
    title: base.title,
    date: base.date,
    page: pageNumber,
    pages: lastNumber,
    company: settings.companyName ?? "",
  };
  const isFirst = pageIndex === 0;

  let header: BandSlots | null = bandVisible(settings.header, isFirst) ? resolveBand(settings.header, ctx) : null;
  let footer: BandSlots | null = bandVisible(settings.footer, isFirst) ? resolveBand(settings.footer, ctx) : null;

  const pn = settings.pageNumbers;
  if (pn.enabled && (!isFirst || pn.showOnFirstPage)) {
    const label = formatPageNumber(pn.format, pageNumber, lastNumber);
    if (pn.placement === "header") {
      header = appendToSlot(header ?? { left: "", center: "", right: "" }, pn.align, label);
    } else {
      footer = appendToSlot(footer ?? { left: "", center: "", right: "" }, pn.align, label);
    }
  }

  return { header, footer, pageNumber };
}

export const TOKEN_HELP: Array<{ token: string; label: string }> = [
  { token: "{title}", label: "Document title" },
  { token: "{date}", label: "Today's date" },
  { token: "{page}", label: "Page number" },
  { token: "{pages}", label: "Total pages" },
  { token: "{company}", label: "Company name" },
];
