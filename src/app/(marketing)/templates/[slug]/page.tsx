import { ArrowLeft, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveTemplatePreview } from "@/components/document/live-template-preview";
import { Container, Eyebrow } from "@/components/marketing/section";
import { UseTemplateButton } from "@/components/marketing/use-template-button";
import { Badge } from "@/components/ui/badge";
import { DOC_FONTS, type DocFontKey } from "@/lib/fonts";
import { ARTICLES } from "@/lib/resources/articles";
import { pageMetadata } from "@/lib/site";
import { getTemplate, TEMPLATES } from "@/lib/templates";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.id }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) return {};
  return pageMetadata({
    title: `${t.name} Template for Markdown`,
    description: `${t.description.slice(0, 120).replace(/\s+\S*$/, "")}. Free to preview; export to PDF or Google Docs.`.slice(0, 160),
    path: `/templates/${t.id}`,
    image: t.previewImage,
  });
}

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) notFound();
  const related = ARTICLES.filter((a) => a.relatedTemplate === t.id).slice(0, 3);
  const font = (k: string) => DOC_FONTS[k as DocFontKey]?.label ?? k;

  return (
    <section className="bg-canvas py-12 sm:py-16">
      <Container>
        <Link href="/templates" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink">
          <ArrowLeft className="size-4" /> All templates
        </Link>
        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <Eyebrow>{t.category}</Eyebrow>
            <div className="mt-3 flex items-center gap-3">
              <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">{t.name}</h1>
              <Badge variant={t.tier === "premium" ? "pro" : "secondary"}>{t.tier === "premium" ? "Pro" : "Free"}</Badge>
            </div>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t.description}</p>
            <ul className="mt-6 space-y-2.5">
              {t.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2.5 text-[15px]">
                  <Check className="size-4 text-cobalt" /> {h}
                </li>
              ))}
            </ul>
            <dl className="mt-8 grid grid-cols-2 gap-4 rounded-xl border bg-white p-5 text-sm">
              <div><dt className="text-muted-foreground">Page</dt><dd className="mt-0.5 font-medium">{t.settings.pageSize}, {t.settings.orientation}</dd></div>
              <div><dt className="text-muted-foreground">Body font</dt><dd className="mt-0.5 font-medium">{font(t.settings.fontFamily)}</dd></div>
              <div><dt className="text-muted-foreground">Headings</dt><dd className="mt-0.5 font-medium">{font(t.settings.headingFontFamily)}</dd></div>
              <div><dt className="text-muted-foreground">Cover page</dt><dd className="mt-0.5 font-medium">{t.settings.titlePage ? "Yes" : "No"}</dd></div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <UseTemplateButton templateId={t.id} />
            </div>
            {t.tier === "premium" && <p className="mt-3 text-sm text-muted-foreground">Preview free. Exporting and saving premium templates requires Pro.</p>}
            {related.length > 0 && (
              <div className="mt-10">
                <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">Related guides</h2>
                <ul className="mt-3 space-y-2">
                  {related.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/resources/${a.slug}`} className="text-cobalt underline-offset-4 hover:underline">{a.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="rounded-2xl border bg-[#efebe3] p-4 sm:p-8">
            <LiveTemplatePreview templateId={t.id} maxPages={3} />
          </div>
        </div>
      </Container>
    </section>
  );
}
