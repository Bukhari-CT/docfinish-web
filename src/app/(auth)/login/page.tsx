import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { RedirectIfAuthed } from "@/components/auth/redirect-if-authed";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Log in",
  description: "Log in to DocFinish to export PDFs, save projects, and manage your brand kit.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-medium text-navy">Welcome back</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">Log in to export, save projects, and pick up where you left off.</p>
      <Suspense>
        <RedirectIfAuthed />
        <AuthForm mode="login" />
      </Suspense>
    </>
  );
}
