import type { Element, Root as HastRoot, Text } from "hast";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex, { type Options as KatexOptions } from "rehype-katex";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { normalizePageBreaks, PAGE_BREAK_SENTINEL } from "@/lib/pagination/pagebreaks";

type Schema = typeof defaultSchema;

/**
 * Sanitization schema: GitHub defaults plus what the document renderer needs
 * (math/mermaid code classes, page-break divs, data: images, table alignment).
 * Runs BEFORE KaTeX and highlighting so their trusted output is never stripped,
 * while user-authored HTML (scripts, iframes, event handlers, styles) always is.
 */
export const sanitizeSchema: Schema = {
  ...defaultSchema,
  // Keep ids readable but namespaced to avoid DOM clobbering.
  clobberPrefix: "df-",
  attributes: {
    ...defaultSchema.attributes,
    code: [["className", /^language-./, "math-inline", "math-display"]],
    div: [...(defaultSchema.attributes?.div ?? []), ["className", "df-page-break"]],
    td: [...(defaultSchema.attributes?.td ?? []), "align", ["style", /^text-align:\s*(left|center|right);?$/]],
    th: [...(defaultSchema.attributes?.th ?? []), "align", ["style", /^text-align:\s*(left|center|right);?$/]],
    img: [...(defaultSchema.attributes?.img ?? []), "title", "width", "height"],
    a: [...(defaultSchema.attributes?.a ?? []), "title"],
  },
  protocols: {
    ...defaultSchema.protocols,
    src: ["http", "https", "data"],
    href: ["http", "https", "mailto", "tel"],
  },
};

/** Turn the sentinel paragraph produced by normalizePageBreaks into a page-break div. */
function rehypePageBreaks() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (!parent || index === undefined || node.tagName !== "p") return;
      if (node.children.length !== 1) return;
      const only = node.children[0];
      if (only.type !== "text" || (only as Text).value.trim() !== PAGE_BREAK_SENTINEL) return;
      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["df-page-break"] },
        children: [],
      };
    });
  };
}

/** Open external links in a new tab, safely. */
function rehypeExternalLinks() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "a") return;
      const href = String(node.properties?.href ?? "");
      if (/^https?:\/\//i.test(href)) {
        node.properties = { ...node.properties, target: "_blank", rel: ["noopener", "noreferrer"] };
      }
    });
  };
}

const katexOptions: KatexOptions = { output: "htmlAndMathml", errorColor: "#9a2a20" };

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypePageBreaks)
  .use(rehypeSanitize, sanitizeSchema)
  .use(rehypeExternalLinks)
  .use(rehypeKatex, katexOptions)
  .use(rehypeHighlight, { detect: false, plainText: ["mermaid", "text", "txt", "plain"], ignoreMissing: true } as never)
  .use(rehypeStringify)
  .freeze();

/** Render Markdown to a sanitized HTML string. Synchronous; safe on server and client. */
export function renderMarkdown(markdown: string): string {
  try {
    return String(processor.processSync(normalizePageBreaks(markdown ?? "")));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return `<p class="df-render-error">Could not render this document: ${escapeHtml(msg)}</p>`;
  }
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** First H1 text in a markdown document, used as the default title. */
export function extractTitle(markdown: string, fallback = "Untitled document"): string {
  const lines = (markdown ?? "").split(/\r?\n/);
  let inFence = false;
  for (const line of lines) {
    if (/^\s{0,3}(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = /^#\s+(.+?)\s*#*\s*$/.exec(line);
    if (m) return stripInlineMarkdown(m[1]).slice(0, 140) || fallback;
  }
  return fallback;
}

export function stripInlineMarkdown(s: string): string {
  return s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]+/g, "")
    .trim();
}

/** Plain-text excerpt (used for cards). */
export function excerpt(markdown: string, max = 160): string {
  const text = (markdown ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#+\s+/gm, "")
    .replace(/[>*_`|#-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
