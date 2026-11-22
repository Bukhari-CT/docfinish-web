import type { Metadata } from "next";
import Link from "next/link";
import { LazyLivePreview } from "@/components/marketing/lazy-live-preview";
import { Container, SectionHeading } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { pageMetadata } from "@/lib/site";
import { TEMPLATES } from "@/lib/templates";

export const metadata: Metadata = pageMetadata({
  title: "Document Templates for Markdown — Proposals, Reports, SOPs",
  description: "Professionally designed templates for Markdown documents: client proposals, business reports, project briefs, meeting notes, SOPs, resumes, invoices, and papers.",
  path: "/templates",
});

export default function TemplatesPage() {
  return (
    <section className="bg-canvas py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Templates"
          title="Templates that make Markdown look designed."
          description="Each preview below is rendered live by the same engine that exports your PDFs. Basic templates are free; premium templates are part of Pro."
        />
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLATES.map((t) => (
            <Link key={t.id} href={`/templates/${t.id}`} className="group">
              <div className="rounded-lg transition-transform group-hover:-translate-y-1">
                <LazyLivePreview templateId={t.id} previewImage={t.previewImage} alt={`${t.name} template preview`} />
              </div>
              <div className="mt-5 flex items-center gap-2">
                <h2 className="font-semibold">{t.name}</h2>
                <Badge variant={t.tier === "premium" ? "pro" : "secondary"}>{t.tier === "premium" ? "Pro" : "Free"}</Badge>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.tagline}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
