import type {
  ApiErrorCode,
  ApiErrorEnvelope,
  BrandKitInput,
  BrandKitResponse,
  CancelResponse,
  CheckoutResponse,
  CreateProjectBody,
  FileResponse,
  GoogleExportBody,
  GoogleExportResponse,
  GoogleStatus,
  HealthResponse,
  JobResponse,
  LoginBody,
  MarkdownToPdfBody,
  MarkdownToPdfResponse,
  MeResponse,
  ProjectResponse,
  ProjectsResponse,
  ProjectWithVersionsResponse,
  QuotaExceededDetails,
  RegisterBody,
  SubscriptionPlan,
  SubscriptionResponse,
  TemplateResponse,
  TemplatesResponse,
  UpdateProjectBody,
  UploadPurpose,
  UserResponse,
  VersionDetailResponse,
} from "./types";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"
).replace(/\/+$/, "");

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Error thrown for every non-2xx response (and for network failures). */
export class ApiError extends Error {
  readonly code: ApiErrorCode | string;
  readonly status: number;
  readonly details: Record<string, unknown>;
  readonly retryAfter: number | null;

  constructor(opts: {
    code: ApiErrorCode | string;
    status: number;
    message: string;
    details?: Record<string, unknown>;
    retryAfter?: number | null;
  }) {
    super(opts.message);
    this.name = "ApiError";
    this.code = opts.code;
    this.status = opts.status;
    this.details = opts.details ?? {};
    this.retryAfter = opts.retryAfter ?? null;
  }

  get isNetworkError() {
    return this.code === "NETWORK_ERROR";
  }
  get isUnauthenticated() {
    return this.status === 401 || this.code === "UNAUTHENTICATED";
  }
  get isQuotaExceeded() {
    return this.code === "QUOTA_EXCEEDED";
  }
  get isPlanRequired() {
    return this.code === "PLAN_REQUIRED";
  }
  get isConflict() {
    return this.code === "CONFLICT";
  }
  get quota(): QuotaExceededDetails {
    const d = this.details;
    return {
      limit: typeof d.limit === "number" ? d.limit : undefined,
      used: typeof d.used === "number" ? d.used : undefined,
      resetsAt: typeof d.resetsAt === "string" ? d.resetsAt : undefined,
    };
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}

/** Human-friendly message for any thrown value. */
export function errorMessage(e: unknown, fallback = "Something went wrong. Please try again."): string {
  if (isApiError(e)) {
    if (e.isNetworkError) return "We couldn't reach DocFinish. Check your connection and try again.";
    if (e.code === "RATE_LIMITED") {
      return e.retryAfter
        ? `Too many requests. Try again in ${e.retryAfter}s.`
        : "Too many requests. Please slow down a little.";
    }
    return e.message || fallback;
  }
  if (e instanceof Error && e.message) return e.message;
  return fallback;
}

function isEnvelope(body: unknown): body is ApiErrorEnvelope {
  return (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof (body as ApiErrorEnvelope).error === "object" &&
    (body as ApiErrorEnvelope).error !== null &&
    typeof (body as ApiErrorEnvelope).error.code === "string"
  );
}

const STATUS_FALLBACK: Record<number, ApiErrorCode> = {
  400: "VALIDATION_ERROR",
  401: "UNAUTHENTICATED",
  402: "QUOTA_EXCEEDED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  413: "FILE_TOO_LARGE",
  415: "UNSUPPORTED_FILE_TYPE",
  429: "RATE_LIMITED",
  503: "PROVIDER_NOT_CONFIGURED",
};

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  /** Override fetch (tests). */
  fetchImpl?: typeof fetch;
}

/**
 * Core request helper. Always sends cookies; adds the CSRF header on non-GET.
 */
export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const method = opts.method ?? "GET";
  const headers: Record<string, string> = { Accept: "application/json" };
  let body: BodyInit | undefined;

  if (method !== "GET") headers["X-DocFinish-Client"] = "web";
  if (opts.body instanceof FormData) {
    body = opts.body;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  const doFetch = opts.fetchImpl ?? fetch;
  let res: Response;
  try {
    res = await doFetch(apiUrl(path), {
      method,
      headers,
      body,
      credentials: "include",
      signal: opts.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError({
      code: "NETWORK_ERROR",
      status: 0,
      message: "Network request failed",
      details: { cause: err instanceof Error ? err.message : String(err) },
    });
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  let parsed: unknown = undefined;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = undefined;
    }
  }

  if (!res.ok) {
    const retryHeader = res.headers.get("Retry-After");
    const retryAfter = retryHeader && !Number.isNaN(Number(retryHeader)) ? Number(retryHeader) : null;
    if (isEnvelope(parsed)) {
      throw new ApiError({
        code: parsed.error.code,
        status: res.status,
        message: parsed.error.message,
        details: parsed.error.details ?? {},
        retryAfter,
      });
    }
    throw new ApiError({
      code: STATUS_FALLBACK[res.status] ?? "INTERNAL",
      status: res.status,
      message: `Request failed with status ${res.status}`,
      retryAfter,
    });
  }

  return parsed as T;
}

/* ---------- Typed endpoint functions ---------- */

export const api = {
  health: () => request<HealthResponse>("/health"),

  auth: {
    register: (body: RegisterBody) => request<UserResponse>("/auth/register", { method: "POST", body }),
    login: (body: LoginBody) => request<UserResponse>("/auth/login", { method: "POST", body }),
    logout: () => request<void>("/auth/logout", { method: "POST" }),
    me: (signal?: AbortSignal) => request<MeResponse>("/auth/me", { signal }),
  },

  templates: {
    list: () => request<TemplatesResponse>("/templates"),
    get: (id: string) => request<TemplateResponse>(`/templates/${encodeURIComponent(id)}`),
  },

  projects: {
    list: () => request<ProjectsResponse>("/projects"),
    create: (body: CreateProjectBody) => request<ProjectResponse>("/projects", { method: "POST", body }),
    get: (id: string) => request<ProjectWithVersionsResponse>(`/projects/${encodeURIComponent(id)}`),
    update: (id: string, body: UpdateProjectBody, signal?: AbortSignal) =>
      request<ProjectResponse>(`/projects/${encodeURIComponent(id)}`, { method: "PATCH", body, signal }),
    remove: (id: string) => request<void>(`/projects/${encodeURIComponent(id)}`, { method: "DELETE" }),
    version: (id: string, versionId: string) =>
      request<VersionDetailResponse>(
        `/projects/${encodeURIComponent(id)}/versions/${encodeURIComponent(versionId)}`,
      ),
  },

  brandKit: {
    get: () => request<BrandKitResponse>("/brand-kit"),
    put: (body: BrandKitInput) => request<{ brandKit: NonNullable<BrandKitResponse["brandKit"]> }>("/brand-kit", { method: "PUT", body }),
  },

  files: {
    upload: (file: File, purpose?: UploadPurpose) => {
      const fd = new FormData();
      fd.append("file", file);
      if (purpose) fd.append("purpose", purpose);
      return request<FileResponse>("/files/upload", { method: "POST", body: fd });
    },
  },

  conversions: {
    markdownToPdf: (body: MarkdownToPdfBody) =>
      request<MarkdownToPdfResponse>("/conversions/markdown-to-pdf", { method: "POST", body }),
    pdfToMarkdown: (fileId: string) =>
      request<JobResponse>("/conversions/pdf-to-markdown", { method: "POST", body: { fileId } }),
    get: (id: string, signal?: AbortSignal) =>
      request<JobResponse>(`/conversions/${encodeURIComponent(id)}`, { signal }),
  },

  google: {
    status: () => request<GoogleStatus>("/google/status"),
    connectUrl: () => apiUrl("/google/connect"),
    disconnect: () => request<void>("/google/disconnect", { method: "POST" }),
    exportDocument: (body: GoogleExportBody) =>
      request<GoogleExportResponse>("/google/export-document", { method: "POST", body }),
  },

  billing: {
    checkout: (plan: SubscriptionPlan) =>
      request<CheckoutResponse>("/billing/checkout", { method: "POST", body: { plan } }),
    subscription: () => request<SubscriptionResponse>("/billing/subscription"),
    cancel: () => request<CancelResponse>("/billing/cancel", { method: "POST" }),
  },
};

/** Resolve a download URL from a job result (may be relative to the API). */
export function resolveDownloadUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return apiUrl(url);
}

/** Poll a conversion job until it reaches a terminal state. */
export async function pollJob(
  id: string,
  opts: { intervalMs?: number; timeoutMs?: number; signal?: AbortSignal; onUpdate?: (job: JobResponse["job"]) => void } = {},
): Promise<JobResponse["job"]> {
  const interval = opts.intervalMs ?? 1500;
  const deadline = Date.now() + (opts.timeoutMs ?? 3 * 60_000);
  for (;;) {
    const { job } = await api.conversions.get(id, opts.signal);
    opts.onUpdate?.(job);
    if (job.status === "succeeded" || job.status === "failed") return job;
    if (Date.now() > deadline) {
      throw new ApiError({ code: "INTERNAL", status: 0, message: "The conversion is taking longer than expected." });
    }
    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(resolve, interval);
      opts.signal?.addEventListener("abort", () => {
        clearTimeout(t);
        reject(new DOMException("Aborted", "AbortError"));
      });
    });
  }
}
