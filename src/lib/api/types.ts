/**
 * Types mirrored 1:1 from docs/API.md (DocFinish API Contract v1).
 * When the contract changes, update docs/API.md and this file together.
 */

export type Plan = "free" | "pro";

export interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  plan: Plan;
  createdAt: string;
}

export interface Entitlements {
  plan: Plan;
  pdfExportsPerMonth: number | null;
  maxProjects: number | null;
  googleDocsExport: boolean;
  brandKit: boolean;
  premiumTemplates: boolean;
  headerFooterPresets: boolean;
  customBranding: boolean;
  pdfToMarkdown: boolean;
  priorityQueue: boolean;
}

export interface Usage {
  periodStart: string;
  periodEnd: string;
  pdfExports: number;
  projects: number;
}

export type PageSize = "A4" | "Letter";
export type Orientation = "portrait" | "landscape";
export type Align = "left" | "center" | "right";

export interface HeaderFooterSettings {
  enabled: boolean;
  left: string;
  center: string;
  right: string;
  showOnFirstPage: boolean;
}

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type PageNumberFormat = "n" | "page-n" | "n-of-total";
export type LogoPlacement = "header-left" | "header-right" | "title";

export interface DocumentSettings {
  pageSize: PageSize;
  orientation: Orientation;
  margins: Margins;
  fontFamily: string;
  headingFontFamily: string;
  baseFontSize: number;
  lineHeight: number;
  textColor: string;
  accentColor: string;
  header: HeaderFooterSettings;
  footer: HeaderFooterSettings;
  pageNumbers: {
    enabled: boolean;
    placement: "header" | "footer";
    align: Align;
    format: PageNumberFormat;
    showOnFirstPage: boolean;
    startAt: number;
  };
  logo: {
    dataUrl: string | null;
    placement: LogoPlacement;
    heightMm: number;
  };
  titlePage: boolean;
  companyName: string;
}

export type TemplateTier = "basic" | "premium";

export interface TemplateSummary {
  id: string;
  name: string;
  category: string;
  tier: TemplateTier;
  description: string;
  previewImage: string;
}

export interface Template extends TemplateSummary {
  starterMarkdown: string;
  settings: DocumentSettings;
  styles: Record<string, string>;
}

export interface ProjectSummary {
  id: string;
  name: string;
  templateId: string;
  updatedAt: string;
  createdAt: string;
  excerpt: string;
}

export interface Project extends ProjectSummary {
  markdown: string;
  settings: DocumentSettings;
  version: number;
}

export interface DocumentVersion {
  id: string;
  version: number;
  createdAt: string;
  excerpt: string;
}

export interface HeaderPreset {
  id: string;
  name: string;
  header: HeaderFooterSettings;
  footer: HeaderFooterSettings;
}

export interface BrandKit {
  name: string;
  companyName: string;
  logoDataUrl: string | null;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  headerPresets: HeaderPreset[];
  defaultPageSize: PageSize;
  defaultMargins: Margins;
  updatedAt: string;
}

export type BrandKitInput = Omit<BrandKit, "updatedAt">;

export type JobStatus = "queued" | "processing" | "succeeded" | "failed";

export interface ConversionJob {
  id: string;
  type: "markdown_to_pdf" | "pdf_to_markdown";
  status: JobStatus;
  mode: "browser" | "server";
  provider: string;
  createdAt: string;
  completedAt: string | null;
  error: { code: string; message: string } | null;
  result: {
    downloadUrl?: string;
    expiresAt?: string;
    markdown?: string;
  } | null;
}

export interface StoredFile {
  id: string;
  kind: "markdown" | "pdf" | "image";
  name: string;
  size: number;
  mimeType: string;
  expiresAt: string | null;
  text?: string;
}

export type SubscriptionPlan = "pro_monthly" | "pro_yearly";

export interface Subscription {
  provider: string;
  status: "active" | "trialing" | "past_due" | "canceled" | "expired";
  plan: SubscriptionPlan;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

/* ---------- Error envelope ---------- */

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "CSRF_REJECTED"
  | "PLAN_REQUIRED"
  | "QUOTA_EXCEEDED"
  | "NOT_FOUND"
  | "CONFLICT"
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_FILE_TYPE"
  | "RATE_LIMITED"
  | "PROVIDER_NOT_CONFIGURED"
  | "INTERNAL"
  /** Client-side only: the API could not be reached (network/CORS/offline). */
  | "NETWORK_ERROR";

export interface ApiErrorEnvelope {
  error: {
    code: ApiErrorCode | string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface QuotaExceededDetails {
  limit?: number;
  used?: number;
  resetsAt?: string;
}

/* ---------- Endpoint request/response shapes ---------- */

export interface HealthResponse {
  status: "ok";
  version: string;
  time: string;
}

export interface GoogleStatus {
  configured: boolean;
  connected: boolean;
  email: string | null;
}

export interface MeResponse {
  user: User;
  entitlements: Entitlements;
  usage: Usage;
  google: GoogleStatus;
  billing: { provider: string; configured: boolean };
}

export interface RegisterBody {
  email: string;
  password: string;
  name?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface UserResponse {
  user: User;
}

export interface TemplatesResponse {
  templates: TemplateSummary[];
}

export interface TemplateResponse {
  template: Template;
}

export interface ProjectsResponse {
  projects: ProjectSummary[];
}

export interface CreateProjectBody {
  name: string;
  templateId: string;
  markdown?: string;
  settings?: DocumentSettings;
}

export interface ProjectResponse {
  project: Project;
}

export interface ProjectWithVersionsResponse {
  project: Project;
  versions: DocumentVersion[];
}

export interface UpdateProjectBody {
  name?: string;
  templateId?: string;
  markdown?: string;
  settings?: DocumentSettings;
  baseVersion?: number;
  snapshot?: boolean;
}

export interface VersionDetailResponse {
  version: DocumentVersion & { markdown: string; settings: DocumentSettings };
}

export interface BrandKitResponse {
  brandKit: BrandKit | null;
}

export type UploadPurpose = "markdown" | "pdf" | "logo";

export interface FileResponse {
  file: StoredFile;
}

export interface MarkdownToPdfBody {
  projectId?: string;
  title: string;
  mode: "browser" | "server";
  html?: string;
  markdown?: string;
  settings: DocumentSettings;
}

export interface MarkdownToPdfResponse {
  job: ConversionJob;
  usage: Usage;
}

export interface JobResponse {
  job: ConversionJob;
}

export interface GoogleExportBody {
  projectId?: string;
  title: string;
  markdown: string;
  settings: DocumentSettings;
}

export interface GoogleExportResponse {
  documentId: string;
  url: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
}

export interface SubscriptionResponse {
  subscription: Subscription | null;
  entitlements: Entitlements;
}

export interface CancelResponse {
  subscription: Subscription;
}
