import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.docfinish.com").replace(/\/+$/, "");
export const SITE_NAME = "DocFinish";
export const SITE_TAGLINE = "Turn AI Markdown into client-ready PDFs and Google Docs.";

/** Single source of truth for prices shown in the UI. Billing itself is handled by the API. */
export const PRICING = {
  currency: "USD",
  monthly: 12,
  yearly: 96,
} as const;

export const yearlyMonthlyEquivalent = PRICING.yearly / 12;
export const yearlySavingsPct = Math.round((1 - PRICING.yearly / (PRICING.monthly * 12)) * 100);

export const TOOL_LINKS = [
  { href: "/tools/markdown-to-pdf", label: "Markdown to PDF", description: "Paginated, branded PDFs from any Markdown." },
  { href: "/tools/markdown-viewer", label: "Markdown Viewer", description: "Preview Markdown as real pages, instantly." },
  { href: "/tools/ai-markdown-to-pdf", label: "AI Markdown to PDF", description: "Polish Claude, ChatGPT, or Codex output." },
  { href: "/tools/markdown-to-google-docs", label: "Markdown to Google Docs", description: "Editable Docs with headings and tables intact." },
  { href: "/tools/pdf-to-markdown", label: "PDF to Markdown", description: "Extract clean Markdown from PDFs." },
] as const;

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Consistent metadata for public pages (canonical, OpenGraph, Twitter). */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  image,
  absoluteTitle = false,
}: {
  absoluteTitle?: boolean;
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  // Default social image comes from app/opengraph-image.tsx (file convention).
  const images = image ? [{ url: absoluteUrl(image) }] : undefined;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE_NAME, type, ...(images ? { images } : {}) },
    twitter: { card: "summary_large_image", title, description, ...(images ? { images: images.map((i) => i.url) } : {}) },
  };
}

export function jsonLd(data: Record<string, unknown>): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
