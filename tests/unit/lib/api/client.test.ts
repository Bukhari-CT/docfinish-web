import { describe, expect, it, vi } from "vitest";
import { ApiError, errorMessage, request } from "@/lib/api/client";

function res(status: number, body?: unknown, headers: Record<string, string> = {}) {
  return new Response(body === undefined ? null : JSON.stringify(body), { status, headers });
}

describe("api client", () => {
  it("sends credentials and the CSRF header on mutations only", async () => {
    const f = vi.fn().mockImplementation(async () => res(200, { ok: true }));
    await request("/x", { method: "POST", body: { a: 1 }, fetchImpl: f });
    await request("/x", { fetchImpl: f });
    const [, post] = f.mock.calls[0];
    const [, get] = f.mock.calls[1];
    expect(post.credentials).toBe("include");
    expect(post.headers["X-DocFinish-Client"]).toBe("web");
    expect(post.headers["Content-Type"]).toBe("application/json");
    expect(get.headers["X-DocFinish-Client"]).toBeUndefined();
  });

  it("maps the API error envelope to ApiError", async () => {
    const f = vi.fn().mockResolvedValue(res(402, { error: { code: "QUOTA_EXCEEDED", message: "Limit", details: { limit: 3, used: 3 } } }));
    const err = await request("/x", { fetchImpl: f }).catch((e: unknown) => e) as unknown as ApiError;
    expect(err).toBeInstanceOf(ApiError);
    expect(err.isQuotaExceeded).toBe(true);
    expect(err.quota).toEqual({ limit: 3, used: 3, resetsAt: undefined });
  });

  it("falls back to status-based codes and reads Retry-After", async () => {
    const f = vi.fn().mockResolvedValue(res(429, undefined, { "Retry-After": "12" }));
    const err = await request("/x", { fetchImpl: f }).catch((e: unknown) => e) as unknown as ApiError;
    expect(err.code).toBe("RATE_LIMITED");
    expect(errorMessage(err)).toContain("12s");
  });

  it("turns network failures into NETWORK_ERROR and handles 204", async () => {
    const err = await request("/x", { fetchImpl: vi.fn().mockRejectedValue(new TypeError("fail")) }).catch((e: unknown) => e) as unknown as ApiError;
    expect(err.isNetworkError).toBe(true);
    expect(await request("/x", { method: "DELETE", fetchImpl: vi.fn().mockResolvedValue(res(204)) })).toBeUndefined();
  });
});
