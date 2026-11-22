import type { Metadata } from "next";
import Link from "next/link";
import { faqJsonLd, JsonLd } from "@/components/json-ld";
import { Faq } from "@/components/marketing/faq";
import { PdfToMarkdownTool } from "@/components/marketing/pdf-to-markdown-tool";
import { Container, Eyebrow } from "@/components/marketing/section";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "PDF to Markdown Converter — Extract Clean Markdown",
  description: "Convert PDFs to clean, editable Markdown with headings, lists, and tables. Re-brand the result and export it again as a polished PDF or Google Doc.",
  path: "/tools/pdf-to-markdown",
});

const FAQ = [
  { q: "Is PDF to Markdown free?", a: "PDF to Markdown runs on DocFinish servers, so it's included with Pro. Markdown to PDF and the viewer are free." },
  { q: "What happens to my uploaded PDF?", a: "Uploads are temporary and expire after 24 hours unless attached to a saved project." },
  { q: "Does it work on scanned PDFs?", a: "Results are best on PDFs with selectable text. Scanned images may produce limited text." },
];

export default function Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQ)} />
      <section className="border-b bg-paper">
        <Container className="py-12">
          <Eyebrow>Pro tool</Eyebrow>
          <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight font-medium tracking-tight sm:text-5xl">PDF to Markdown, ready to edit and re-brand</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Pull the text, headings, and tables out of an existing PDF, tidy it up in Markdown, and export it again with your template. Read the{" "}
            <Link href="/resources/pdf-to-markdown" className="text-cobalt underline underline-offset-4">PDF to Markdown guide</Link>.
          </p>
        </Container>
      </section>
      <section className="py-14">
        <Container className="max-w-4xl">
          <PdfToMarkdownTool />
        </Container>
      </section>
      <section className="pb-20">
        <Container className="max-w-4xl">
          <h2 className="mb-6 font-display text-3xl font-medium">FAQ</h2>
          <Faq items={FAQ} />
        </Container>
      </section>
    </>
  );
}
