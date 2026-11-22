import type { DocumentSettings, HeaderFooterSettings, Template, TemplateSummary } from "@/lib/api/types";
import { STARTERS, type TemplateId } from "./starters";

export type { TemplateId };

const hf = (over: Partial<HeaderFooterSettings> = {}): HeaderFooterSettings => ({
  enabled: false,
  left: "",
  center: "",
  right: "",
  showOnFirstPage: false,
  ...over,
});

export function defaultSettings(over: Partial<DocumentSettings> = {}): DocumentSettings {
  return {
    pageSize: "A4",
    orientation: "portrait",
    margins: { top: 22, right: 20, bottom: 22, left: 20 },
    fontFamily: "inter",
    headingFontFamily: "source-serif",
    baseFontSize: 11,
    lineHeight: 1.55,
    textColor: "#14161a",
    accentColor: "#2448e0",
    header: hf({ enabled: true, left: "{title}", right: "{company}" }),
    footer: hf({ enabled: true, left: "{date}" }),
    pageNumbers: {
      enabled: true,
      placement: "footer",
      align: "right",
      format: "page-n",
      showOnFirstPage: true,
      startAt: 1,
    },
    logo: { dataUrl: null, placement: "header-left", heightMm: 10 },
    titlePage: false,
    companyName: "",
    ...over,
  };
}

/** Deep clone (settings are plain JSON). */
export function cloneSettings(s: DocumentSettings): DocumentSettings {
  return JSON.parse(JSON.stringify(s)) as DocumentSettings;
}

interface TemplateDef extends Template {
  id: TemplateId;
  /** Short tagline for gallery cards. */
  tagline: string;
  /** Bullet highlights for /templates/[slug]. */
  highlights: string[];
}

const T: TemplateDef[] = [
  {
    id: "client-proposal",
    name: "Client Proposal",
    category: "Sales",
    tier: "basic",
    tagline: "A confident cover page, scope tables, and a clear investment summary.",
    description:
      "Win the work with a proposal that reads like it came from a studio: a navy cover page, an executive summary, scoped deliverables, phased timeline, and a clean investment table.",
    previewImage: "/templates/client-proposal.svg",
    highlights: ["Navy cover page with title block", "Scope, timeline, and investment tables", "Phased approach diagram", "Sign-off section"],
    starterMarkdown: STARTERS["client-proposal"],
    settings: defaultSettings({
      fontFamily: "inter",
      headingFontFamily: "source-serif",
      accentColor: "#2448e0",
      titlePage: true,
      margins: { top: 24, right: 22, bottom: 22, left: 22 },
      header: hf({ enabled: true, left: "{title}", right: "{company}" }),
      footer: hf({ enabled: true, left: "Confidential · Prepared by {company}" }),
      pageNumbers: { enabled: true, placement: "footer", align: "right", format: "n-of-total", showOnFirstPage: false, startAt: 1 },
      companyName: "Lumen & Lark Consulting",
    }),
    styles: {
      "--df-h1-size": "30pt",
      "--df-h2-size": "17pt",
      "--df-h3-size": "12.5pt",
      "--df-heading-weight": "600",
      "--df-h2-border": "none",
      "--df-table-head-bg": "#0f1b2d",
      "--df-table-head-color": "#ffffff",
      "--df-table-stripe": "#f5f3ee",
      "--df-quote-bg": "#f2f5ff",
      "--df-cover-bg": "#0f1b2d",
      "--df-cover-color": "#ffffff",
    },
  },
  {
    id: "business-report",
    name: "Business Report",
    category: "Reporting",
    tier: "basic",
    tagline: "Executive-ready reporting with KPI tables, charts, and recommendations.",
    description:
      "A structured report for quarterly reviews and board updates: a teal-accented cover, KPI tables, Mermaid charts, risk registers, and numbered recommendations.",
    previewImage: "/templates/business-report.svg",
    highlights: ["Cover page with accent bar", "KPI and risk tables", "Mermaid pie and flow charts", "Appendix on its own page"],
    starterMarkdown: STARTERS["business-report"],
    settings: defaultSettings({
      fontFamily: "ibm-plex-serif",
      headingFontFamily: "ibm-plex-sans",
      baseFontSize: 10.5,
      lineHeight: 1.55,
      accentColor: "#0f766e",
      titlePage: true,
      header: hf({ enabled: true, left: "{company}", right: "{title}" }),
      footer: hf({ enabled: true, left: "{date}" }),
      pageNumbers: { enabled: true, placement: "footer", align: "right", format: "page-n", showOnFirstPage: false, startAt: 1 },
      companyName: "Harbor & Pine Outfitters",
    }),
    styles: {
      "--df-h1-size": "28pt",
      "--df-h2-size": "15pt",
      "--df-h3-size": "11.5pt",
      "--df-heading-weight": "600",
      "--df-h2-border": "2px solid var(--df-accent)",
      "--df-table-head-bg": "#e6f2f0",
      "--df-table-head-color": "#0b3f3b",
      "--df-table-stripe": "#f7faf9",
      "--df-quote-bg": "#eef7f5",
      "--df-cover-bg": "#ffffff",
      "--df-cover-color": "#14161a",
    },
  },
  {
    id: "project-brief",
    name: "Project Brief",
    category: "Planning",
    tagline: "Align stakeholders on goals, scope, metrics, and timeline in two pages.",
    tier: "basic",
    description:
      "Kick off projects with a crisp brief: goals, success metrics, in/out of scope, stakeholders, a Mermaid timeline, risks, and open questions as a checklist.",
    previewImage: "/templates/project-brief.svg",
    highlights: ["Small-caps eyebrow and sans headings", "Success-metric and stakeholder tables", "Gantt timeline", "Open-questions checklist"],
    starterMarkdown: STARTERS["project-brief"],
    settings: defaultSettings({
      fontFamily: "inter",
      headingFontFamily: "inter",
      baseFontSize: 10.5,
      accentColor: "#c2410c",
      header: hf({ enabled: true, left: "Project brief", right: "{title}" }),
      footer: hf({ enabled: true, left: "{company}", center: "" }),
      pageNumbers: { enabled: true, placement: "footer", align: "right", format: "n-of-total", showOnFirstPage: true, startAt: 1 },
      companyName: "Fieldnote Labs",
    }),
    styles: {
      "--df-h1-size": "24pt",
      "--df-h2-size": "13.5pt",
      "--df-h3-size": "11pt",
      "--df-heading-weight": "700",
      "--df-h2-border": "none",
      "--df-table-head-bg": "#fff4ec",
      "--df-table-head-color": "#7c2d12",
      "--df-table-stripe": "#fffaf6",
      "--df-quote-bg": "#fff4ec",
    },
  },
  {
    id: "meeting-notes",
    name: "Meeting Notes",
    category: "Operations",
    tier: "basic",
    tagline: "Decisions, owners, and due dates that people actually read.",
    description:
      "Compact, scannable notes with agenda, discussion, highlighted decisions, an owner/task/due table, and a checklist of action items.",
    previewImage: "/templates/meeting-notes.svg",
    highlights: ["Compact sans layout", "Highlighted decisions", "Action-item table + checklist", "Fits most meetings on one page"],
    starterMarkdown: STARTERS["meeting-notes"],
    settings: defaultSettings({
      fontFamily: "ibm-plex-sans",
      headingFontFamily: "ibm-plex-sans",
      baseFontSize: 10,
      lineHeight: 1.45,
      accentColor: "#15803d",
      margins: { top: 18, right: 18, bottom: 18, left: 18 },
      header: hf({ enabled: false }),
      footer: hf({ enabled: true, left: "{title}", right: "{date}", showOnFirstPage: true }),
      pageNumbers: { enabled: true, placement: "footer", align: "center", format: "n", showOnFirstPage: true, startAt: 1 },
      companyName: "Fieldnote Labs",
    }),
    styles: {
      "--df-h1-size": "21pt",
      "--df-h2-size": "12.5pt",
      "--df-h3-size": "10.5pt",
      "--df-heading-weight": "600",
      "--df-h2-border": "1px solid #d6e9dc",
      "--df-table-head-bg": "#ecf7ef",
      "--df-table-head-color": "#14532d",
      "--df-table-stripe": "#f8fcf9",
      "--df-quote-bg": "#ecf7ef",
      "--df-block-gap": "0.6em",
    },
  },
  {
    id: "sop",
    name: "Standard Operating Procedure",
    category: "Operations",
    tier: "premium",
    tagline: "Numbered procedures, roles, warnings, and revision history.",
    description:
      "Document repeatable processes with confidence: roles and responsibilities, prerequisites checklist, numbered steps, a process flowchart, warning callouts, and revision history.",
    previewImage: "/templates/sop.svg",
    highlights: ["Document-control header", "Numbered steps with sub-steps", "Warning and note callouts", "Process flowchart"],
    starterMarkdown: STARTERS.sop,
    settings: defaultSettings({
      fontFamily: "inter",
      headingFontFamily: "ibm-plex-sans",
      baseFontSize: 10.5,
      accentColor: "#1d4ed8",
      header: hf({ enabled: true, left: "{company}", center: "", right: "SOP · {title}", showOnFirstPage: true }),
      footer: hf({ enabled: true, left: "Controlled document · printed {date}", showOnFirstPage: true }),
      pageNumbers: { enabled: true, placement: "footer", align: "right", format: "n-of-total", showOnFirstPage: true, startAt: 1 },
      companyName: "Northgate Logistics",
    }),
    styles: {
      "--df-h1-size": "22pt",
      "--df-h2-size": "13.5pt",
      "--df-h3-size": "11pt",
      "--df-heading-weight": "600",
      "--df-h2-border": "none",
      "--df-table-head-bg": "#0f1b2d",
      "--df-table-head-color": "#ffffff",
      "--df-table-stripe": "#f4f6fb",
      "--df-quote-bg": "#fff7ed",
      "--df-quote-border": "#b45309",
    },
  },
  {
    id: "resume",
    name: "Resume",
    category: "Career",
    tier: "premium",
    tagline: "A compact, two-tone resume that fits on one to two pages.",
    description:
      "A modern two-tone resume: a navy name band, cobalt small-caps section headings, compact role entries, and tidy skills — readable by humans and parsers alike.",
    previewImage: "/templates/resume.svg",
    highlights: ["Navy name band", "Small-caps section headings", "Compact role entries", "No header/footer clutter"],
    starterMarkdown: STARTERS.resume,
    settings: defaultSettings({
      fontFamily: "inter",
      headingFontFamily: "inter",
      baseFontSize: 9.5,
      lineHeight: 1.42,
      accentColor: "#2448e0",
      margins: { top: 14, right: 16, bottom: 14, left: 16 },
      header: hf({ enabled: false }),
      footer: hf({ enabled: false }),
      pageNumbers: { enabled: false, placement: "footer", align: "right", format: "n-of-total", showOnFirstPage: false, startAt: 1 },
      companyName: "",
    }),
    styles: {
      "--df-h1-size": "22pt",
      "--df-h2-size": "9.5pt",
      "--df-h3-size": "10.5pt",
      "--df-heading-weight": "600",
      "--df-h2-border": "1px solid #d9def0",
      "--df-block-gap": "0.45em",
      "--df-table-head-bg": "#eef1fd",
      "--df-table-head-color": "#14161a",
      "--df-table-stripe": "transparent",
    },
  },
  {
    id: "invoice",
    name: "Invoice",
    category: "Finance",
    tier: "premium",
    tagline: "Line items, totals, and payment details with zero spreadsheet fuss.",
    description:
      "A crisp invoice with letter-spaced title, invoice meta, from/bill-to block, a navy line-item table, right-aligned totals, and payment instructions.",
    previewImage: "/templates/invoice.svg",
    highlights: ["Navy line-item table", "Right-aligned totals", "Payment details block", "Letter-size friendly"],
    starterMarkdown: STARTERS.invoice,
    settings: defaultSettings({
      fontFamily: "inter",
      headingFontFamily: "ibm-plex-sans",
      baseFontSize: 10,
      lineHeight: 1.5,
      accentColor: "#0f1b2d",
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
      header: hf({ enabled: false }),
      footer: hf({ enabled: true, center: "{company} · Thank you for your business", showOnFirstPage: true }),
      pageNumbers: { enabled: false, placement: "footer", align: "right", format: "n-of-total", showOnFirstPage: false, startAt: 1 },
      companyName: "Lumen & Lark Consulting",
    }),
    styles: {
      "--df-h1-size": "26pt",
      "--df-h2-size": "11pt",
      "--df-h3-size": "10.5pt",
      "--df-heading-weight": "700",
      "--df-h2-border": "none",
      "--df-table-head-bg": "#0f1b2d",
      "--df-table-head-color": "#ffffff",
      "--df-table-stripe": "#f5f3ee",
    },
  },
  {
    id: "academic-paper",
    name: "Academic Paper",
    category: "Research",
    tier: "premium",
    tagline: "Serif typography, an abstract, numbered sections, and real math.",
    description:
      "A paper layout in classic serif: centered title and authors, an indented abstract, numbered sections, KaTeX equations, booktabs-style tables, and references.",
    previewImage: "/templates/academic-paper.svg",
    highlights: ["Serif typesetting", "Indented abstract", "KaTeX display math", "Booktabs-style tables"],
    starterMarkdown: STARTERS["academic-paper"],
    settings: defaultSettings({
      fontFamily: "lora",
      headingFontFamily: "source-serif",
      baseFontSize: 10.5,
      lineHeight: 1.5,
      textColor: "#14161a",
      accentColor: "#14161a",
      pageSize: "Letter",
      margins: { top: 25, right: 25, bottom: 25, left: 25 },
      header: hf({ enabled: true, center: "{title}", showOnFirstPage: false }),
      footer: hf({ enabled: false }),
      pageNumbers: { enabled: true, placement: "footer", align: "center", format: "n", showOnFirstPage: true, startAt: 1 },
      companyName: "",
    }),
    styles: {
      "--df-h1-size": "19pt",
      "--df-h2-size": "12.5pt",
      "--df-h3-size": "11pt",
      "--df-heading-weight": "600",
      "--df-h2-border": "none",
      "--df-table-head-bg": "transparent",
      "--df-table-head-color": "#14161a",
      "--df-table-stripe": "transparent",
      "--df-quote-bg": "transparent",
    },
  },
];

export const TEMPLATES: readonly TemplateDef[] = T;
export const TEMPLATE_IDS = T.map((t) => t.id);
export const DEFAULT_TEMPLATE_ID: TemplateId = "client-proposal";

export function getTemplate(id: string | null | undefined): TemplateDef | undefined {
  return T.find((t) => t.id === id);
}

export function getTemplateOrDefault(id: string | null | undefined): TemplateDef {
  return getTemplate(id) ?? T[0];
}

export function toSummary(t: TemplateDef): TemplateSummary {
  return {
    id: t.id,
    name: t.name,
    category: t.category,
    tier: t.tier,
    description: t.description,
    previewImage: t.previewImage,
  };
}

export function isPremiumTemplate(id: string): boolean {
  return getTemplate(id)?.tier === "premium";
}

export type { TemplateDef };
