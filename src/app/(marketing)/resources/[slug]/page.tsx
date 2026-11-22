import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { faqJsonLd, JsonLd } from "@/components/json-ld";
import { Faq } from "@/components/marketing/faq";
import { Container } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { renderMarkdown } from "@/lib/markdown/pipeline";
import { ARTICLES, getArticle } from "@/lib/resources/articles";
import { absoluteUrl, pageMetadata, SITE_NAME } from "@/lib/site";
import { getTemplate } from "@/lib/templates";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return pageMetadata({ title: a.title, description: a.description, path: `/resources/${a.slug}`, type: "article" });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const html = renderMarkdown(a.body);
  const template = a.relatedTemplate ? getTemplate(a.relatedTemplate) : undefined;
  const more = ARTICLES.filter((x) => x.slug !== a.slug && (x.kind === a.kind || x.relatedTemplate === a.relatedTemplate)).slice(0, 3);

  return (
    <article className="bg-paper">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.description,
          datePublished: a.publishedAt,
          dateModified: a.updatedAt,
          mainEntityOfPage: absoluteUrl(`/resources/${a.slug}`),
          author: { "@type": "Organization", name: SITE_NAME },
          publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") } },
        }}
      />
      {a.faq && a.faq.length > 0 && <JsonLd data={faqJsonLd(a.faq)} />}

      <header className="border-b bg-canvas">
        <Container className="max-w-3xl py-14 sm:py-20">
          <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink">
            <ArrowLeft className="size-4" /> Resources
          </Link>
          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="accent">{a.category}</Badge>
            <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> {a.readingMinutes} min read</span>
            <span>Updated {formatDate(a.updatedAt)}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl leading-[1.1] font-medium tracking-tight text-ink sm:text-5xl">{a.title}</h1>
          <p className="mt-5 text-xl leading-relaxed text-muted-foreground">{a.excerpt}</p>
        </Container>
      </header>

      <Container className="grid max-w-6xl gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <div className="prose-article mx-auto max-w-[680px]" dangerouslySetInnerHTML={{ __html: html }} />
          {a.faq && a.faq.length > 0 && (
            <div className="mx-auto mt-16 max-w-[680px]">
              <h2 className="mb-6 font-display text-[1.75rem] font-medium">Frequently asked questions</h2>
              <Faq items={a.faq} />
            </div>
          )}
        </div>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border bg-navy p-5 text-white">
            <p className="text-xs font-semibold tracking-wider text-white/60 uppercase">Free tool</p>
            <p className="mt-2 font-display text-xl">{a.relatedTool.label}</p>
            <p className="mt-2 text-sm text-white/70">Try it in your browser—no login needed to preview.</p>
            <Button asChild variant="inverse" size="sm" className="mt-4">
              <Link href={a.relatedTool.href}>Open tool <ArrowRight /></Link>
            </Button>
          </div>
          {template && (
            <Link href={`/templates/${template.id}`} className="group block rounded-xl border bg-white p-5">
              <p className="text-xs font-semibold tracking-wider text-cobalt uppercase">Template</p>
              <div className="mt-3 flex gap-4">
                <div className="relative aspect-[300/424] w-16 shrink-0 overflow-hidden rounded-sm border">
                  <Image src={template.previewImage} alt="" fill sizes="64px" className="object-cover" unoptimized />
                </div>
                <div>
                  <p className="font-medium">{template.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground group-hover:text-ink">View template →</p>
                </div>
              </div>
            </Link>
          )}
        </aside>
      </Container>

      {more.length > 0 && (
        <section className="border-t bg-canvas py-14">
          <Container className="max-w-6xl">
            <h2 className="font-display text-2xl font-medium">Keep reading</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {more.map((m) => (
                <Link key={m.slug} href={`/resources/${m.slug}`} className="rounded-xl border bg-white p-5 transition-colors hover:border-cobalt/40">
                  <Badge variant="secondary">{m.category}</Badge>
                  <p className="mt-3 font-medium">{m.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{m.excerpt}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
