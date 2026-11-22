import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { faqJsonLd, JsonLd } from "@/components/json-ld";
import { Faq } from "@/components/marketing/faq";
import { Container, Eyebrow } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";
import { DocumentWorkspace } from "@/components/workspace/document-workspace";
import { getArticle } from "@/lib/resources/articles";
import { getTemplate } from "@/lib/templates";
import type { getTool } from "@/lib/tools";

export function ToolPage({ tool }: { tool: NonNullable<ReturnType<typeof getTool>> }) {
  const article = getArticle(tool.article);
  const template = getTemplate(tool.templateId);
  return (
    <>
      <JsonLd data={faqJsonLd(tool.faq)} />
      <section className="border-b bg-paper">
        <Container className="py-10 sm:py-12">
          <Eyebrow>Free tool</Eyebrow>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl leading-tight font-medium tracking-tight sm:text-5xl">{tool.title}</h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{tool.lede}</p>
            </div>
            <ul className="grid gap-1.5 text-sm text-muted-foreground">
              {tool.bullets.slice(0, 3).map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <Check className="size-4 text-cobalt" /> {b}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="h-[calc(100dvh-4rem)] min-h-[620px] border-b" aria-label={`${tool.name} workspace`}>
        <DocumentWorkspace mode="guest" defaultTemplateId={tool.templateId} sampleMarkdown={tool.sample} />
      </section>

      <section className="py-20">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-medium tracking-tight">How to use the {tool.name} tool</h2>
            <ol className="mt-6 space-y-4">
              {tool.steps.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy text-[13px] font-semibold text-white">{i + 1}</span>
                  <span className="pt-0.5 text-[16px] leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {tool.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-[15px] text-muted-foreground">
                  <Check className="mt-1 size-4 shrink-0 text-cobalt" /> {b}
                </li>
              ))}
            </ul>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {article && (
                <Link href={`/resources/${article.slug}`} className="group rounded-xl border bg-white p-5 transition-colors hover:border-cobalt/50">
                  <p className="text-xs font-semibold tracking-wider text-cobalt uppercase">Guide</p>
                  <p className="mt-2 font-medium">{article.title}</p>
                  <p className="mt-3 inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-ink">
                    Read the guide <ArrowRight className="size-3.5" />
                  </p>
                </Link>
              )}
              {template && (
                <Link href={`/templates/${template.id}`} className="group rounded-xl border bg-white p-5 transition-colors hover:border-cobalt/50">
                  <p className="text-xs font-semibold tracking-wider text-cobalt uppercase">Template</p>
                  <p className="mt-2 font-medium">{template.name}</p>
                  <p className="mt-3 inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-ink">
                    View template <ArrowRight className="size-3.5" />
                  </p>
                </Link>
              )}
            </div>
          </div>
          <div>
            <h2 className="mb-6 font-display text-3xl font-medium tracking-tight">FAQ</h2>
            <Faq items={tool.faq} />
            <div className="mt-8 rounded-xl border bg-navy p-6 text-white">
              <p className="font-display text-xl">Export without the watermark.</p>
              <p className="mt-2 text-sm text-white/70">Free accounts get 3 PDF exports a month. Pro is unlimited.</p>
              <Button asChild variant="inverse" className="mt-4">
                <Link href="/pricing">See pricing</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
