"use client";

import { renderMermaidBlocks } from "@/lib/markdown/mermaid";
import { distributeBlocks, splitHighlightedLines, type MeasuredBlock, type Placement } from "./distribute";

export interface PaginatedPage {
  html: string;
  isCover: boolean;
}

export interface PaginateOptions {
  /** Height in px available for body content on each page. */
  contentHeightPx: number;
  /** Treat the content before the first H2 (or first manual break) as a cover page. */
  titlePage: boolean;
  /** Logo placed at the top of the first page (logo.placement === "title"). */
  titleLogo?: { dataUrl: string; heightMm: number } | null;
  /** Abort when a newer pagination run starts. */
  isStale?: () => boolean;
}

const IMAGE_TIMEOUT_MS = 4000;

function waitForImages(root: HTMLElement): Promise<void> {
  const imgs = Array.from(root.querySelectorAll("img")).filter((img) => !img.complete);
  if (imgs.length === 0) return Promise.resolve();
  return Promise.race([
    Promise.all(
      imgs.map(
        (img) =>
          new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          }),
      ),
    ).then(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, IMAGE_TIMEOUT_MS)),
  ]);
}

async function waitForFonts(): Promise<void> {
  try {
    if (typeof document !== "undefined" && document.fonts) await document.fonts.ready;
  } catch {
    /* ignore */
  }
}

function insertCoverBreak(root: HTMLElement): boolean {
  const children = Array.from(root.children);
  const idx = children.findIndex((el) => el.tagName === "H2" || el.classList.contains("df-page-break"));
  if (idx <= 0) return false;
  const target = children[idx];
  if (target.classList.contains("df-page-break")) return true;
  const brk = document.createElement("div");
  brk.className = "df-page-break";
  root.insertBefore(brk, target);
  return true;
}

function rowsOf(table: HTMLTableElement): HTMLTableRowElement[] {
  const bodies = Array.from(table.tBodies);
  if (bodies.length) return bodies.flatMap((b) => Array.from(b.rows));
  return Array.from(table.rows).filter((r) => r.parentElement?.tagName !== "THEAD");
}

function measure(root: HTMLElement): { blocks: MeasuredBlock[]; els: HTMLElement[]; codeLines: Map<number, string[]> } {
  const els = Array.from(root.children) as HTMLElement[];
  const rects = els.map((el) => el.getBoundingClientRect());
  const codeLines = new Map<number, string[]>();

  const blocks: MeasuredBlock[] = els.map((el, i) => {
    const r = rects[i];
    const next = rects[i + 1];
    const block: MeasuredBlock = {
      height: r.height,
      gapAfter: next ? Math.max(0, next.top - r.bottom) : 0,
    };
    const tag = el.tagName;
    if (el.classList.contains("df-page-break")) {
      block.isBreak = true;
      block.height = 0;
      block.gapAfter = 0;
      return block;
    }
    if (/^H[1-6]$/.test(tag)) block.keepWithNext = true;

    if (tag === "TABLE") {
      const rows = rowsOf(el as HTMLTableElement);
      if (rows.length > 1) {
        const units = rows.map((row) => row.getBoundingClientRect().height);
        const overhead = Math.max(0, r.height - units.reduce((a, b) => a + b, 0));
        block.split = { overhead, units, minUnits: 1 };
      }
    } else if (tag === "UL" || tag === "OL") {
      const items = Array.from(el.children).filter((c) => c.tagName === "LI") as HTMLElement[];
      if (items.length > 1) {
        const tops = items.map((li) => li.getBoundingClientRect());
        const units = tops.map((t, k) => (k < tops.length - 1 ? tops[k + 1].top - t.top : t.height));
        const overhead = Math.max(0, r.height - units.reduce((a, b) => a + b, 0));
        block.split = { overhead, units, minUnits: 1 };
      }
    } else if (tag === "PRE") {
      const code = el.querySelector("code");
      if (code) {
        const lines = splitHighlightedLines(code.innerHTML);
        if (lines.length > 3) {
          const codeHeight = code.getBoundingClientRect().height;
          const lh = codeHeight / lines.length;
          codeLines.set(i, lines);
          block.split = { overhead: Math.max(0, r.height - codeHeight), units: lines.map(() => lh), minUnits: 2 };
        }
      }
    }
    return block;
  });

  return { blocks, els, codeLines };
}

function fragmentHtml(el: HTMLElement, p: Placement, codeLines: string[] = []): string {
  if (p.from === undefined || p.to === undefined) return el.outerHTML;
  const { from, to } = p;
  const tag = el.tagName;
  if (tag === "TABLE") {
    const table = el as HTMLTableElement;
    const clone = table.cloneNode(false) as HTMLTableElement;
    if (table.tHead) clone.appendChild(table.tHead.cloneNode(true));
    const tbody = document.createElement("tbody");
    rowsOf(table)
      .slice(from, to)
      .forEach((row) => tbody.appendChild(row.cloneNode(true)));
    clone.appendChild(tbody);
    if (from > 0) clone.classList.add("df-continued");
    return clone.outerHTML;
  }
  if (tag === "UL" || tag === "OL") {
    const clone = el.cloneNode(false) as HTMLElement;
    const items = Array.from(el.children).filter((c) => c.tagName === "LI");
    items.slice(from, to).forEach((li) => clone.appendChild(li.cloneNode(true)));
    if (tag === "OL") {
      const start = Number((el as HTMLOListElement).getAttribute("start") ?? "1") || 1;
      clone.setAttribute("start", String(start + from));
    }
    if (from > 0) clone.classList.add("df-continued");
    return clone.outerHTML;
  }
  if (tag === "PRE") {
    const lines = codeLines;
    const code = el.querySelector("code");
    const pre = el.cloneNode(false) as HTMLElement;
    const c = (code?.cloneNode(false) as HTMLElement) ?? document.createElement("code");
    c.innerHTML = lines.slice(from, to).join("\n");
    pre.appendChild(c);
    if (from > 0) pre.classList.add("df-continued");
    return pre.outerHTML;
  }
  return el.outerHTML;
}

/**
 * Paginate sanitized document HTML using a hidden measuring container.
 * `root` must already have the document CSS applied and the exact page content width.
 */
export async function paginate(root: HTMLElement, html: string, opts: PaginateOptions): Promise<PaginatedPage[] | null> {
  root.innerHTML = html;
  if (opts.titleLogo?.dataUrl) {
    const wrap = document.createElement("div");
    wrap.className = "df-title-logo";
    const img = document.createElement("img");
    img.src = opts.titleLogo.dataUrl;
    img.alt = "";
    img.style.height = `${opts.titleLogo.heightMm}mm`;
    wrap.appendChild(img);
    root.insertBefore(wrap, root.firstChild);
  }

  await renderMermaidBlocks(root);
  if (opts.isStale?.()) return null;
  await Promise.all([waitForImages(root), waitForFonts()]);
  if (opts.isStale?.()) return null;

  const hasCover = opts.titlePage ? insertCoverBreak(root) : false;
  const { blocks, els, codeLines } = measure(root);
  const plan = distributeBlocks(blocks, opts.contentHeightPx);

  return plan.map((placements, pageIndex) => ({
    html: placements.map((p) => fragmentHtml(els[p.block], p, codeLines.get(p.block))).join("\n"),
    isCover: hasCover && pageIndex === 0,
  }));
}
