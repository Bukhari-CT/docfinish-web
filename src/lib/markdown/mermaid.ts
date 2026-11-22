"use client";

import { escapeHtml } from "./pipeline";

type MermaidApi = typeof import("mermaid").default;

let mermaidPromise: Promise<MermaidApi> | null = null;
const svgCache = new Map<string, string>();
let counter = 0;

function loadMermaid(): Promise<MermaidApi> {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((m) => {
      const mermaid = m.default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "neutral",
        fontFamily: "inherit",
        flowchart: { htmlLabels: false },
      });
      return mermaid;
    });
  }
  return mermaidPromise;
}

/**
 * Replace every <pre><code class="language-mermaid"> inside `root` with rendered SVG.
 * Mermaid is only downloaded when a document actually contains a diagram.
 */
export async function renderMermaidBlocks(root: HTMLElement): Promise<number> {
  const blocks = Array.from(root.querySelectorAll<HTMLElement>("pre > code.language-mermaid"));
  if (blocks.length === 0) return 0;
  const mermaid = await loadMermaid();
  for (const code of blocks) {
    const pre = code.parentElement;
    if (!pre) continue;
    const source = code.textContent ?? "";
    const wrapper = document.createElement("div");
    wrapper.className = "df-mermaid";
    let svg = svgCache.get(source);
    if (!svg) {
      try {
        const id = `df-mermaid-${Date.now().toString(36)}-${counter++}`;
        const out = await mermaid.render(id, source);
        svg = out.svg;
        svgCache.set(source, svg);
        if (svgCache.size > 64) svgCache.delete(svgCache.keys().next().value as string);
      } catch (err) {
        // Mermaid leaves an error element in the body on failure; clean it up.
        document.querySelectorAll('[id^="ddf-mermaid-"], [id^="df-mermaid-"]').forEach((el) => {
          if (!root.contains(el)) el.remove();
        });
        const msg = err instanceof Error ? err.message.split("\n")[0] : "Invalid diagram";
        wrapper.className = "df-mermaid df-mermaid--error";
        wrapper.innerHTML = `<strong>Diagram error</strong><span>${escapeHtml(msg)}</span>`;
        pre.replaceWith(wrapper);
        continue;
      }
    }
    wrapper.innerHTML = svg;
    pre.replaceWith(wrapper);
  }
  return blocks.length;
}
