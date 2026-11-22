import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { RedirectIfAuthed } from "@/components/auth/redirect-if-authed";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Create your free account",
  description: "Sign up for DocFinish free: three PDF exports a month, basic templates, and no watermarks.",
  path: "/signup",
});

export default function SignupPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-medium text-navy">Create your free account</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">Three PDF exports a month, basic templates, one saved project. No watermarks, no card.</p>
      <Suspense>
        <RedirectIfAuthed />
        <AuthForm mode="signup" />
      </Suspense>
    </>
  );
}
