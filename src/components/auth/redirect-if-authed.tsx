"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { safeNext, useSession } from "@/lib/auth/session";

/** Sends already-signed-in visitors on to the app instead of showing the form. */
export function RedirectIfAuthed() {
  const router = useRouter();
  const params = useSearchParams();
  const { status } = useSession();
  const next = safeNext(params.get("next"));
  useEffect(() => {
    if (status === "authenticated") router.replace(next);
  }, [status, next, router]);
  return null;
}
