import { ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { ARTICLES } from "@/lib/resources/articles";
import type { ResourceArticle } from "@/lib/resources/types";
import { pageMetadata } from "@/lib/site";
import { getTemplate, TEMPLATES } from "@/lib/templates";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Resources — Guides for Markdown, PDFs, and AI Documents",
  description: "Practical guides for turning Markdown and AI output into polished documents: Markdown to PDF, Google Docs, headers and footers, templates, and more.",
  path: "/resources",
});

function ArticleCard({ a, featured }: { a: ResourceArticle; featured?: boolean }) {
  const t = a.relatedTemplate ? getTemplate(a.relatedTemplate) : undefined;
  return (
    <Link
      href={`/resources/${a.slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border bg-white transition-all hover:-translate-y-0.5 hover:shadow-md ${featured ? "lg:col-span-2 lg:flex-row" : ""}`}
    >
      <div className={`relative flex items-end justify-center overflow-hidden bg-[#efebe3] ${featured ? "h-56 lg:h-auto lg:w-1/2" : "h-40"}`}>
        {t && (
          <div className={`relative ${featured ? "w-40 translate-y-6" : "w-28 translate-y-8"} aspect-[300/424] rotate-[-3deg] shadow-lg transition-transform group-hover:rotate-0`}>
            <Image src={t.previewImage} alt="" fill sizes="160px" className="rounded-sm object-cover" unoptimized />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant={a.kind === "template" ? "accent" : a.kind === "tool" ? "secondary" : "outline"}>{a.category}</Badge>
          <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {a.readingMinutes} min</span>
        </div>
        <h2 className={`mt-3 font-display font-medium tracking-tight text-ink ${featured ? "text-3xl" : "text-xl"}`}>{a.title}</h2>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">{a.excerpt}</p>
        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{formatDate(a.updatedAt)}</span>
          <span className="inline-flex items-center gap-1 font-medium text-cobalt">Read <ArrowRight className="size-3.5" /></span>
        </div>
      </div>
    </Link>
  );
}

export default function ResourcesPage() {
  const guides = ARTICLES.filter((a) => a.kind === "guide");
  const tools = ARTICLES.filter((a) => a.kind === "tool");
  const templates = ARTICLES.filter((a) => a.kind === "template");
  return (
    <section className="bg-canvas py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Resources" title="Guides for finishing documents." description="Step-by-step guides for turning Markdown and AI output into documents you're proud to send." />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {guides.map((a, i) => (
            <ArticleCard key={a.slug} a={a} featured={i === 0} />
          ))}
        </div>

        <h2 className="mt-20 font-display text-2xl font-medium">Tool guides</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((a) => (
            <ArticleCard key={a.slug} a={a} />
          ))}
        </div>

        <h2 className="mt-20 font-display text-2xl font-medium">Template guides</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((a) => (
            <ArticleCard key={a.slug} a={a} />
          ))}
        </div>

        <h2 className="mt-20 font-display text-2xl font-medium">Template library</h2>
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-8">
          {TEMPLATES.map((t) => (
            <Link key={t.id} href={`/templates/${t.id}`} className="group">
              <div className="relative aspect-[300/424] overflow-hidden rounded-md border bg-white shadow-sm transition-transform group-hover:-translate-y-1">
                <Image src={t.previewImage} alt={`${t.name} template`} fill sizes="160px" className="object-cover" unoptimized />
              </div>
              <p className="mt-2 text-sm font-medium">{t.name}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
