import { Check, Minus } from "lucide-react";
import type { Metadata } from "next";
import { faqJsonLd, JsonLd } from "@/components/json-ld";
import { Faq } from "@/components/marketing/faq";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { Container, SectionHeading } from "@/components/marketing/section";
import { PLAN_MATRIX } from "@/lib/plans";
import { pageMetadata, PRICING } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Pricing — Free and Pro Plans",
  description: `DocFinish is free to start with 3 watermark-free PDF exports a month. Pro is $${PRICING.monthly}/month or $${PRICING.yearly}/year for unlimited exports and Google Docs.`,
  path: "/pricing",
});

const FAQ = [
  { q: "Do free PDFs have a watermark?", a: "No. DocFinish never adds a watermark, on the free plan or on Pro." },
  { q: "What counts as a PDF export?", a: "Each PDF export (print-exact or server PDF) counts once. Free accounts get 3 per calendar month, resetting on the 1st (UTC)." },
  { q: "Can I preview without paying?", a: "Yes. Everyone can preview documents, templates (including premium ones), and branding. Pro is needed to save brand kits, export premium templates, and export to Google Docs." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel from the billing page and keep Pro until the end of your current period." },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <Check className="mx-auto size-4 text-cobalt" aria-label="Included" />;
  if (v === false) return <Minus className="mx-auto size-4 text-muted-foreground/60" aria-label="Not included" />;
  return <span>{v}</span>;
}

export default function PricingPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQ)} />
      <section className="bg-canvas py-16 sm:py-24">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Pricing"
            title="Simple plans. No watermarks."
            description="Start free. Upgrade when DocFinish becomes part of how you deliver work."
            className="mb-12"
          />
          <PricingPlans />
        </Container>
      </section>
      <section className="py-20">
        <Container className="max-w-4xl">
          <h2 className="font-display text-3xl font-medium">Compare plans</h2>
          <div className="mt-8 overflow-x-auto rounded-xl border bg-white">
            <table className="w-full min-w-[520px] text-[15px]">
              <thead>
                <tr className="border-b bg-paper text-left">
                  <th className="px-5 py-3 font-semibold">Capability</th>
                  <th className="w-44 px-5 py-3 text-center font-semibold">Free</th>
                  <th className="w-56 px-5 py-3 text-center font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody>
                {PLAN_MATRIX.map((r) => (
                  <tr key={r.feature} className="border-b last:border-0">
                    <td className="px-5 py-3">{r.feature}</td>
                    <td className="px-5 py-3 text-center text-muted-foreground">
                      <Cell v={r.free} />
                    </td>
                    <td className="px-5 py-3 text-center">
                      <Cell v={r.pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 className="mt-20 mb-6 font-display text-3xl font-medium">Pricing FAQ</h2>
          <Faq items={FAQ} />
        </Container>
      </section>
    </>
  );
}
