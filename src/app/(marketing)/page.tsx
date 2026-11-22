import { ArrowRight, Check, FileText, Hash, LayoutTemplate, PanelTop, Sigma, Upload, Wand2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { faqJsonLd, JsonLd } from "@/components/json-ld";
import { Faq } from "@/components/marketing/faq";
import { HeroDemo } from "@/components/marketing/hero-demo";
import { Container, Eyebrow, SectionHeading } from "@/components/marketing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { absoluteUrl, pageMetadata, PRICING, SITE_NAME } from "@/lib/site";
import { TEMPLATES } from "@/lib/templates";

export const metadata: Metadata = pageMetadata({
  title: "DocFinish — Turn AI Markdown into client-ready PDFs and Google Docs",
  description:
    "Paste Markdown from Claude, ChatGPT, or Codex and get a branded, paginated document with headers, footers, and page numbers. Export to PDF or Google Docs.",
  path: "/",
  absoluteTitle: true,
});

const STEPS = [
  { icon: Upload, title: "Paste or drop your Markdown", body: "Bring output from Claude, ChatGPT, Codex, or any editor. Tables, task lists, code, Mermaid, and math all render." },
  { icon: Wand2, title: "Pick a template and brand it", body: "Choose a layout, add your logo and colors, and set headers, footers, and page numbers with live tokens." },
  { icon: FileText, title: "Export a finished document", body: "Download a PDF that matches the preview page for page, or send an editable copy to Google Docs." },
];

const FEATURES = [
  { icon: PanelTop, title: "Headers & footers", body: "Left, center, and right slots with {title}, {date}, {page}, {pages}, and {company} tokens. Hide them on the cover." },
  { icon: Hash, title: "Real page numbers", body: "“3”, “Page 3”, or “3 / 12”, in the header or footer, starting at any number." },
  { icon: LayoutTemplate, title: "Templates that look designed", body: "Proposals with cover pages, reports with KPI tables, SOPs, resumes, invoices, and papers." },
  { icon: Sigma, title: "Mermaid and math", body: "Flowcharts, Gantt charts, and pie charts render as crisp SVG. LaTeX math renders with KaTeX." },
  { icon: FileText, title: "Google Docs export", body: "Send an editable Google Doc with headings, lists, tables, and your header and footer intact." },
  { icon: Check, title: "True page breaks", body: "Tables split by row with repeated headers, headings stay with their content, and <!-- pagebreak --> just works." },
];

const FAQ = [
  { q: "Do I need an account to try DocFinish?", a: "No. The Markdown viewer and PDF tools preview your document without logging in, and your draft is saved in your browser. You need a free account to export." },
  { q: "Is my Markdown uploaded to your servers?", a: "Rendering and preview happen locally in your browser. Content is only sent to DocFinish when you save a project, use server PDF rendering, or export to Google Docs." },
  { q: "Do free PDFs have a watermark?", a: "No. Free and Pro PDFs never have a watermark. Free includes 3 PDF exports per month." },
  { q: "Will the PDF look exactly like the preview?", a: "Yes. DocFinish paginates the document into real-sized pages and prints those same pages, so page breaks, headers, and footers match the preview." },
  { q: "Which Markdown features are supported?", a: "GitHub-flavored Markdown (tables, task lists, strikethrough, autolinks), images, code with syntax highlighting, Mermaid diagrams, KaTeX math, and manual page breaks." },
  { q: "Can I use my own logo and colors?", a: "Everyone can preview a logo, colors, and fonts. Pro saves them as a reusable brand kit along with header and footer presets." },
];

export default function LandingPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: SITE_NAME,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: absoluteUrl("/"),
          description: "Turn AI-generated Markdown into branded, paginated PDFs and Google Docs.",
          offers: [
            { "@type": "Offer", name: "Free", price: "0", priceCurrency: PRICING.currency },
            { "@type": "Offer", name: "Pro (monthly)", price: String(PRICING.monthly), priceCurrency: PRICING.currency },
          ],
        }}
      />
      <JsonLd data={faqJsonLd(FAQ)} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-canvas">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(#e7e1d6_1px,transparent_1px),linear-gradient(90deg,#e7e1d6_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
        />
        <Container className="relative pt-16 pb-20 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6 bg-white px-3 py-1 text-[12px] font-normal text-muted-foreground">
              Works with Claude, ChatGPT, Codex, and any Markdown editor
            </Badge>
            <h1 className="font-display text-[2.6rem] leading-[1.05] font-medium tracking-tight text-ink sm:text-6xl lg:text-[4.2rem]">
              From AI Markdown to a client-ready document.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Add your brand, headers, footers, and page numbers—then export to PDF or Google Docs.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="accent">
                <Link href="/tools/markdown-to-pdf">
                  Paste your Markdown <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/templates">Browse templates</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">No login to preview · No watermark · Free plan forever</p>
          </div>
          <div className="mt-16">
            <HeroDemo />
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-24">
        <Container>
          <SectionHeading eyebrow="How it works" title="Three steps from chat window to client inbox." />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative rounded-xl border bg-white p-7">
                <span className="absolute top-6 right-6 font-display text-4xl text-ink/10">{i + 1}</span>
                <s.icon className="size-6 text-cobalt" />
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Features */}
      <section className="border-y bg-paper py-24">
        <Container>
          <SectionHeading
            eyebrow="Built for documents"
            title="Everything a real document needs, none of the word-processor wrangling."
            description="DocFinish paginates your Markdown into true pages, so what you see is exactly what you send."
          />
          <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-cobalt-soft text-cobalt">
                  <f.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Templates strip */}
      <section className="py-24">
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Templates" title="Start from a layout that already looks finished." />
            <Button asChild variant="outline">
              <Link href="/templates">
                All templates <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-12 -mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-8">
            {TEMPLATES.map((t) => (
              <Link key={t.id} href={`/templates/${t.id}`} className="group w-40 shrink-0 snap-start sm:w-auto">
                <div className="relative aspect-[300/424] overflow-hidden rounded-md border bg-white shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-lg">
                  <Image src={t.previewImage} alt={`${t.name} template preview`} fill sizes="200px" className="object-cover" unoptimized />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{t.name}</span>
                  {t.tier === "premium" && <Badge variant="pro">Pro</Badge>}
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Works with */}
      <section className="border-y bg-navy py-14 text-white">
        <Container className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <p className="max-w-md text-lg text-white/75">Made for the Markdown your AI tools already write.</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 font-display text-2xl text-white/90">
            <li>Claude</li>
            <li className="text-white/30">·</li>
            <li>ChatGPT</li>
            <li className="text-white/30">·</li>
            <li>Codex</li>
            <li className="text-white/30">·</li>
            <li>Any editor</li>
          </ul>
        </Container>
      </section>

      {/* Pricing teaser */}
      <section className="py-24">
        <Container>
          <div className="grid gap-10 rounded-2xl border bg-white p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <Eyebrow>Pricing</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">Free to start. ${PRICING.monthly}/month when it&apos;s part of your workflow.</h2>
              <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-muted-foreground">
                Free includes 3 PDF exports a month, one project, and every basic template—with no watermark. Pro unlocks unlimited exports, premium templates, brand kits, and Google Docs.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild variant="accent">
                  <Link href="/pricing">Compare plans</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/signup">Create a free account</Link>
                </Button>
              </div>
            </div>
            <ul className="grid gap-3 text-[15px]">
              {["Preview without logging in", "No watermark on any plan", "Exact print-matched PDFs", "Cancel anytime"].map((x) => (
                <li key={x} className="flex items-center gap-3 rounded-lg border bg-paper px-4 py-3">
                  <Check className="size-4 text-cobalt" /> {x}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="border-t bg-paper py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="FAQ" title="Questions, answered." description="Still curious? The resources section has step-by-step guides." />
          <Faq items={FAQ} />
        </Container>
      </section>
    </>
  );
}
