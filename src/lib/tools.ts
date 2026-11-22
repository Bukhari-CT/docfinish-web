import type { TemplateId } from "@/lib/templates";

export interface ToolConfig {
  slug: string;
  path: string;
  name: string;
  title: string;
  metaTitle: string;
  description: string;
  lede: string;
  templateId: TemplateId;
  article: string;
  steps: string[];
  bullets: string[];
  faq: Array<{ q: string; a: string }>;
}

const AI_SAMPLE = `# Q4 Customer Onboarding Plan

*Drafted with an AI assistant, finished in DocFinish.*

## Summary

New customers currently take **11 days** on average to reach their first successful export. This plan targets **5 days** by the end of Q4 through a guided checklist, templated welcome emails, and a weekly office hour.

## Goals

1. Reduce time-to-first-value from 11 to 5 days
2. Raise week-one activation from 42% to 60%
3. Cut onboarding support tickets by a third

## Workstreams

| Workstream | Owner | Due | Status |
|---|---|---|---|
| In-app checklist | Priya N. | Oct 18 | In progress |
| Welcome email series | Marcus L. | Oct 25 | Not started |
| Office hours | Dana K. | Nov 1 | Scheduled |
| Success metrics dashboard | Priya N. | Nov 8 | Not started |

## Rollout

\`\`\`mermaid
flowchart LR
  A[Sign-up] --> B[Checklist]
  B --> C{First export?}
  C -- yes --> D[Activated]
  C -- no --> E[Nudge email]
  E --> B
\`\`\`

## Measuring success

We will track activation as the share of new workspaces with at least one export in the first 7 days:

$$
\\text{activation} = \\frac{\\text{workspaces exporting within 7 days}}{\\text{new workspaces}}
$$

## Open items

- [x] Agree on activation definition
- [ ] Confirm email sending domain
- [ ] Book office-hour calendar slots
`;

export const TOOLS: Record<string, ToolConfig & { sample?: string }> = {
  "markdown-to-pdf": {
    slug: "markdown-to-pdf",
    path: "/tools/markdown-to-pdf",
    name: "Markdown to PDF",
    title: "Markdown to PDF, with real pages",
    metaTitle: "Markdown to PDF Converter — Branded, Paginated PDFs",
    description:
      "Convert Markdown to a polished PDF with headers, footers, page numbers, and templates. Preview free in your browser, no watermark on exports.",
    lede: "Paste Markdown, pick a template, and export a PDF that matches the preview page for page—headers, footers, and page numbers included.",
    templateId: "business-report",
    article: "markdown-to-pdf",
    steps: ["Paste or drop your .md file into the editor.", "Choose a template, page size, and margins.", "Set header, footer, and page-number text.", "Click Export PDF and save."],
    bullets: ["Tables split across pages with repeated headers", "Manual page breaks with <!-- pagebreak -->", "A4 or Letter, portrait or landscape", "No watermark, even on the free plan"],
    faq: [
      { q: "Is the Markdown to PDF converter free?", a: "Yes. Preview is free with no login, and a free account includes 3 PDF exports per month with no watermark." },
      { q: "Will my tables and code blocks break across pages?", a: "Long tables split by row and repeat their header row, long lists split by item, and code blocks split by line." },
      { q: "Can I force a page break?", a: "Yes. Put <!-- pagebreak -->, \\newpage, or \\pagebreak on its own line." },
    ],
  },
  "markdown-viewer": {
    slug: "markdown-viewer",
    path: "/tools/markdown-viewer",
    name: "Markdown Viewer",
    title: "An online Markdown viewer that shows real pages",
    metaTitle: "Online Markdown Viewer — Preview Markdown as Pages",
    description:
      "View Markdown online as formatted, paginated pages. Tables, task lists, code highlighting, Mermaid diagrams, and math render instantly in your browser.",
    lede: "Drop in a .md file or paste Markdown to see it rendered as print-ready pages. Everything renders locally—nothing is uploaded.",
    templateId: "project-brief",
    article: "markdown-viewer",
    steps: ["Paste Markdown or drop a .md file.", "Zoom and scroll through the paginated preview.", "Switch templates to see different styles.", "Export when you're ready."],
    bullets: ["GitHub-flavored Markdown", "Syntax-highlighted code", "Mermaid diagrams and KaTeX math", "Private: rendering stays in your browser"],
    faq: [
      { q: "Do I need to sign up to view Markdown?", a: "No. The viewer works without an account and keeps your draft in your browser's local storage." },
      { q: "Is my file uploaded?", a: "No. Files are read locally with your browser's FileReader and rendered on your device." },
      { q: "Which files can I open?", a: ".md, .markdown, and .txt files up to 2 MB." },
    ],
  },
  "ai-markdown-to-pdf": {
    slug: "ai-markdown-to-pdf",
    path: "/tools/ai-markdown-to-pdf",
    name: "AI Markdown to PDF",
    title: "Turn AI output into a document you can send",
    metaTitle: "AI Markdown to PDF — Polish Claude & ChatGPT Output",
    description:
      "Turn Markdown from Claude, ChatGPT, or Codex into a branded PDF with your logo, headers, footers, and page numbers. Free preview, no watermark.",
    lede: "AI assistants write great Markdown. DocFinish turns it into a branded document—cover page, headers, footers, and page numbers—in under a minute.",
    templateId: "client-proposal",
    article: "ai-markdown-to-pdf",
    sample: AI_SAMPLE,
    steps: ["Ask your AI assistant to answer in Markdown.", "Copy the response and paste it here.", "Apply a template and your brand.", "Export a PDF or a Google Doc."],
    bullets: ["Keeps AI tables, checklists, and code intact", "Renders Mermaid and math from AI output", "Adds a cover page and branding", "Works with Claude, ChatGPT, and Codex"],
    faq: [
      { q: "How do I get Markdown from ChatGPT or Claude?", a: "Most assistants answer in Markdown by default. Use the copy button on the response, or ask it to reply in Markdown." },
      { q: "Will Mermaid diagrams from the AI render?", a: "Yes. Fenced ```mermaid blocks render as SVG diagrams in the preview and the PDF." },
      { q: "Can I add my company logo?", a: "Yes. Add a logo, colors, and fonts in the Brand tab. Pro saves them as a reusable brand kit." },
    ],
  },
  "markdown-to-google-docs": {
    slug: "markdown-to-google-docs",
    path: "/tools/markdown-to-google-docs",
    name: "Markdown to Google Docs",
    title: "Markdown to Google Docs, formatting intact",
    metaTitle: "Markdown to Google Docs — Keep Headings & Tables",
    description:
      "Export Markdown to an editable Google Doc with headings, lists, tables, code, and your header and footer intact. Preview free, export with Pro.",
    lede: "Preview your Markdown here, then send an editable Google Doc to your Drive with headings, lists, tables, and headers and footers preserved.",
    templateId: "meeting-notes",
    article: "markdown-to-google-docs",
    steps: ["Paste your Markdown and preview it.", "Connect Google once (DocFinish only accesses files it creates).", "Choose Export → Google Docs.", "Open the new doc in your Drive."],
    bullets: ["Headings, bold, italic, links, and code", "Bullet, numbered, and checklist items", "Tables and blockquotes", "Header and footer text"],
    faq: [
      { q: "Is Google Docs export free?", a: "Google Docs export is part of DocFinish Pro. Previewing and PDF export are available on the free plan." },
      { q: "What access does DocFinish need?", a: "Only the drive.file scope, which lets DocFinish see and manage files it creates for you—not the rest of your Drive." },
      { q: "Will Mermaid diagrams appear in Google Docs?", a: "Google Docs export focuses on text structure. Diagrams render in the PDF export." },
    ],
  },
};

export function getTool(slug: string) {
  return TOOLS[slug];
}
