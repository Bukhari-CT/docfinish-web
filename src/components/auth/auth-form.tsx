"use client";

import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, errorMessage, isApiError } from "@/lib/api/client";
import { ME_KEY, safeNext } from "@/lib/auth/session";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const qc = useQueryClient();
  const next = safeNext(params.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fe: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) fe.email = "Enter a valid email address.";
    if (mode === "signup" && (password.length < 8 || password.length > 128)) fe.password = "Use 8–128 characters.";
    if (mode === "login" && !password) fe.password = "Enter your password.";
    setFieldErrors(fe);
    if (Object.keys(fe).length) return;

    setBusy(true);
    try {
      if (mode === "login") await api.auth.login({ email, password });
      else await api.auth.register({ email, password, ...(name.trim() ? { name: name.trim() } : {}) });
      await qc.invalidateQueries({ queryKey: ME_KEY });
      router.replace(next);
      router.refresh();
    } catch (err) {
      setBusy(false);
      if (isApiError(err)) {
        if (mode === "login" && err.isUnauthenticated) return setError("That email and password don't match. Try again.");
        if (mode === "signup" && err.isConflict) return setError("An account with that email already exists. Log in instead.");
        if (err.code === "VALIDATION_ERROR") return setError("Please check the highlighted fields and try again.");
      }
      setError(errorMessage(err));
    }
  }

  const other = mode === "login" ? "/signup" : "/login";
  const nextQuery = params.get("next") ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-lg border border-[#f1c8c2] bg-[#fdf0ee] px-3 py-2.5 text-sm text-[#7c2219]">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error}
        </div>
      )}
      {mode === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="name">Name <span className="font-normal text-muted-foreground">(optional)</span></Label>
          <Input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="h-10" />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!fieldErrors.email}
          className="h-10"
          required
        />
        {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!fieldErrors.password}
          className="h-10"
          required
        />
        {fieldErrors.password ? (
          <p className="text-xs text-destructive">{fieldErrors.password}</p>
        ) : (
          mode === "signup" && <p className="text-xs text-muted-foreground">At least 8 characters.</p>
        )}
      </div>
      <Button type="submit" variant="accent" size="lg" className="w-full" disabled={busy}>
        {busy && <Loader2 className="animate-spin" />}
        {mode === "login" ? "Log in" : "Create free account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {mode === "login" ? "New to DocFinish? " : "Already have an account? "}
        <Link href={`${other}${nextQuery}`} className="font-medium text-cobalt hover:underline">
          {mode === "login" ? "Create an account" : "Log in"}
        </Link>
      </p>
    </form>
  );
}
