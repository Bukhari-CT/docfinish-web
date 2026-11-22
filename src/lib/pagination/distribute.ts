/**
 * Pure page-distribution logic. No DOM access here, so it is unit-testable.
 *
 * The DOM layer (paginate.ts) measures each top-level block of the rendered document
 * inside a hidden container that has the exact page content width, then hands the
 * measurements to `distributeBlocks`, which decides which block (or which slice of a
 * splittable block) goes on which page.
 */

export interface SplitInfo {
  /** Height that repeats on every fragment (e.g. table header + borders, list/pre padding). */
  overhead: number;
  /** Heights of each splittable unit (table body rows, list items, code lines). */
  units: number[];
  /** Minimum units to place in a fragment before preferring a fresh page (default 1). */
  minUnits?: number;
}

export interface MeasuredBlock {
  /** Border-box height in px. */
  height: number;
  /** Space between this block's bottom edge and the next block's top edge (collapsed margins). */
  gapAfter: number;
  /** Headings: try to keep on the same page as the start of the next block. */
  keepWithNext?: boolean;
  /** Manual page break marker. */
  isBreak?: boolean;
  /** Present for blocks that may be split across pages. */
  split?: SplitInfo;
}

export interface Placement {
  block: number;
  /** Unit range [from, to) for split fragments. Absent = whole block. */
  from?: number;
  to?: number;
}

export type PagePlan = Placement[][];

function sum(xs: number[], from = 0, to = xs.length) {
  let s = 0;
  for (let i = from; i < to; i++) s += xs[i];
  return s;
}

/** Minimum height the start of a block needs (used for keep-with-next). */
export function minStartHeight(b: MeasuredBlock): number {
  if (b.split && b.split.units.length > 1) {
    const n = Math.min(Math.max(b.split.minUnits ?? 1, 1), b.split.units.length);
    return b.split.overhead + sum(b.split.units, 0, n);
  }
  return b.height;
}

export function distributeBlocks(blocks: MeasuredBlock[], pageHeight: number): PagePlan {
  const pages: PagePlan = [];
  let page: Placement[] = [];
  let used = 0;
  let lastGap = 0;
  // A tiny tolerance absorbs sub-pixel rounding from getBoundingClientRect.
  const EPS = 0.5;

  const flush = () => {
    if (page.length) pages.push(page);
    page = [];
    used = 0;
    lastGap = 0;
  };
  const remaining = () => pageHeight - used - (page.length ? lastGap : 0) + EPS;
  const place = (p: Placement, h: number, gap: number) => {
    used += (page.length ? lastGap : 0) + h;
    page.push(p);
    lastGap = gap;
  };

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];

    if (b.isBreak) {
      flush();
      continue;
    }

    if (b.keepWithNext && page.length) {
      const next = blocks[i + 1];
      let need = b.height;
      if (next && !next.isBreak) {
        const room = Math.max(0, pageHeight - b.height - b.gapAfter);
        need += b.gapAfter + Math.min(minStartHeight(next), room);
      }
      if (need > remaining()) flush();
    }

    if (b.height <= remaining()) {
      place({ block: i }, b.height, b.gapAfter);
      continue;
    }

    const split = b.split;
    if (split && split.units.length > 1) {
      const units = split.units;
      const n = units.length;
      let from = 0;
      while (from < n) {
        const avail = remaining();
        let h = split.overhead;
        let to = from;
        while (to < n && h + units[to] <= avail) {
          h += units[to];
          to++;
        }
        const minUnits = Math.min(Math.max(split.minUnits ?? 1, 1), n - from);
        if (to - from < minUnits) {
          if (page.length) {
            flush();
            continue;
          }
          // Empty page and still not enough room: force progress (may overflow).
          to = Math.max(to, from + 1);
          h = split.overhead + sum(units, from, to);
        }
        const whole = from === 0 && to === n;
        place(whole ? { block: i } : { block: i, from, to }, h, to === n ? b.gapAfter : 0);
        from = to;
        if (from < n) flush();
      }
      continue;
    }

    // Unsplittable and doesn't fit: move to a fresh page (it may still overflow if taller than a page).
    if (page.length) flush();
    place({ block: i }, b.height, b.gapAfter);
  }

  flush();
  if (pages.length === 0) pages.push([]);
  return pages;
}

/**
 * Split syntax-highlighted code HTML into per-line HTML strings, closing and
 * re-opening any <span> elements that cross a newline so each line is balanced.
 */
export function splitHighlightedLines(html: string): string[] {
  const lines: string[] = [];
  const stack: string[] = [];
  let current = "";
  const re = /(<span\b[^>]*>)|(<\/span>)|([^<]+)|(<[^>]*>)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[1]) {
      stack.push(m[1]);
      current += m[1];
    } else if (m[2]) {
      stack.pop();
      current += m[2];
    } else if (m[3]) {
      const parts = m[3].split("\n");
      for (let p = 0; p < parts.length; p++) {
        current += parts[p];
        if (p < parts.length - 1) {
          current += "</span>".repeat(stack.length);
          lines.push(current);
          current = stack.join("");
        }
      }
    } else if (m[4]) {
      current += m[4];
    }
  }
  lines.push(current);
  // Drop a trailing empty line produced by a final newline.
  if (lines.length > 1 && lines[lines.length - 1].replace(/<[^>]+>/g, "") === "") lines.pop();
  return lines;
}
