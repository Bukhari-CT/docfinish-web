export type ResourceKind = "guide" | "tool" | "template";

export interface ResourceFaq {
  q: string;
  a: string;
}

export interface ResourceArticle {
  /** URL slug under /resources/[slug] */
  slug: string;
  /** H1 + <title> (keep under ~60 chars) */
  title: string;
  /** Meta description (140–160 chars) */
  description: string;
  kind: ResourceKind;
  /** Short label shown on cards, e.g. "Guide", "Free tool", "Template" */
  category: string;
  /** Primary search keyword this page targets */
  keyword: string;
  readingMinutes: number;
  /** ISO date */
  publishedAt: string;
  updatedAt: string;
  /** One-sentence summary shown on cards and under the H1 */
  excerpt: string;
  /** Internal link to the relevant free tool */
  relatedTool: { href: string; label: string };
  /** Template id from src/lib/templates (e.g. "client-proposal") */
  relatedTemplate?: string;
  faq?: ResourceFaq[];
  /** Long-form article body as GitHub-flavoured Markdown (no H1; start with H2s). */
  body: string;
}
