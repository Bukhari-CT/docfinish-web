/**
 * Manual page breaks.
 *
 * Supported markers (each must be alone on its own line, outside fenced code):
 *   <!-- pagebreak -->      (also <!-- page-break --> and <!-- newpage -->)
 *   \newpage
 *   \pagebreak
 *
 * Before Markdown parsing, every marker line is replaced with a sentinel paragraph.
 * A rehype plugin turns that paragraph into <div class="df-page-break"></div>.
 */

export const PAGE_BREAK_SENTINEL = "DFPAGEBREAKSENTINEL";

const MARKER_RE = /^\s*(?:<!--\s*(?:page-?break|newpage)\s*-->|\\newpage|\\pagebreak)\s*$/i;
const FENCE_RE = /^\s{0,3}(`{3,}|~{3,})/;

export function isPageBreakLine(line: string): boolean {
  return MARKER_RE.test(line);
}

/** Replace page-break marker lines (outside code fences) with a sentinel paragraph. */
export function normalizePageBreaks(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  let fence: string | null = null;
  const out: string[] = [];
  for (const line of lines) {
    const m = FENCE_RE.exec(line);
    if (m) {
      const marker = m[1];
      if (fence === null) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null;
      out.push(line);
      continue;
    }
    if (fence === null && isPageBreakLine(line)) {
      out.push("", PAGE_BREAK_SENTINEL, "");
    } else {
      out.push(line);
    }
  }
  return out.join("\n");
}

/** Count manual page breaks in a markdown document (outside code fences). */
export function countPageBreaks(markdown: string): number {
  return normalizePageBreaks(markdown).split("\n").filter((l) => l === PAGE_BREAK_SENTINEL).length;
}
