"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, isApiError } from "@/lib/api/client";
import type { MeResponse } from "@/lib/api/types";

export const ME_KEY = ["auth", "me"] as const;

export type SessionStatus = "loading" | "authenticated" | "guest" | "offline";

/**
 * Current session from GET /auth/me.
 * 401 → guest (null). Network failure → "offline" so public pages keep working.
 */
export function useSession() {
  const q = useQuery<MeResponse | null>({
    queryKey: ME_KEY,
    queryFn: async ({ signal }) => {
      try {
        return await api.auth.me(signal);
      } catch (e) {
        if (isApiError(e) && e.isUnauthenticated) return null;
        throw e;
      }
    },
    retry: (count, e) => isApiError(e) && e.isNetworkError && count < 1,
    staleTime: 30_000,
  });

  let status: SessionStatus = "loading";
  if (q.data) status = "authenticated";
  else if (q.data === null) status = "guest";
  else if (q.isError) status = isApiError(q.error) && !q.error.isNetworkError ? "guest" : "offline";

  const me = q.data ?? null;
  return {
    status,
    me,
    user: me?.user ?? null,
    entitlements: me?.entitlements ?? null,
    usage: me?.usage ?? null,
    isPro: me?.entitlements.plan === "pro",
    refetch: q.refetch,
  };
}

export function useInvalidateSession() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ME_KEY });
}

/** Only allow same-origin relative redirect targets. */
export function safeNext(next: string | null | undefined, fallback = "/dashboard"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
