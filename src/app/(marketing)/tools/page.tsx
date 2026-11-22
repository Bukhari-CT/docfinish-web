import { ArrowRight, Cloud, Eye, FileDown, FileInput, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Free Markdown Tools — PDF, Viewer, Google Docs",
  description: "Free Markdown tools from DocFinish: convert Markdown to PDF, view Markdown as pages, polish AI output, export to Google Docs, and extract Markdown from PDFs.",
  path: "/tools",
});

const TOOLS = [
  { href: "/tools/markdown-to-pdf", icon: FileDown, name: "Markdown to PDF", body: "Branded, paginated PDFs with headers, footers, and page numbers.", badge: "Free" },
  { href: "/tools/markdown-viewer", icon: Eye, name: "Markdown Viewer", body: "See Markdown as real pages, rendered privately in your browser.", badge: "Free" },
  { href: "/tools/ai-markdown-to-pdf", icon: Sparkles, name: "AI Markdown to PDF", body: "Turn Claude, ChatGPT, or Codex output into a client-ready document.", badge: "Free" },
  { href: "/tools/markdown-to-google-docs", icon: Cloud, name: "Markdown to Google Docs", body: "Editable Google Docs with headings, lists, and tables intact.", badge: "Pro" },
  { href: "/tools/pdf-to-markdown", icon: FileInput, name: "PDF to Markdown", body: "Extract clean, editable Markdown from existing PDFs.", badge: "Pro" },
];

export default function ToolsPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Tools"
          title="Markdown in, finished documents out."
          description="Every tool shares the same document engine: real pages, real page breaks, and exports that match the preview."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className="group flex flex-col rounded-xl border bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-cobalt/40 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-cobalt-soft text-cobalt">
                  <t.icon className="size-5" />
                </span>
                <Badge variant={t.badge === "Pro" ? "pro" : "secondary"}>{t.badge}</Badge>
              </div>
              <h2 className="mt-5 text-lg font-semibold">{t.name}</h2>
              <p className="mt-2 flex-1 leading-relaxed text-muted-foreground">{t.body}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-cobalt">
                Open tool <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
