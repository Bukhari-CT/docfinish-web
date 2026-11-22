"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api, errorMessage } from "@/lib/api/client";
import { ME_KEY, useSession } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";

function SettingsInner() {
  const router = useRouter();
  const params = useSearchParams();
  const qc = useQueryClient();
  const { user, me, isPro } = useSession();

  const googleResult = params.get("google");
  useEffect(() => {
    if (!googleResult) return;
    if (googleResult === "connected") toast.success("Google account connected");
    else if (googleResult === "not_configured") toast.message("Google export isn't active yet", { description: "It activates once Google credentials are added to this workspace." });
    else toast.error("Couldn't connect Google", { description: "The authorization didn't complete. Please try again." });
    void qc.invalidateQueries({ queryKey: ME_KEY });
    router.replace("/settings");
  }, [googleResult, qc, router]);

  const disconnect = useMutation({
    mutationFn: () => api.google.disconnect(),
    onSuccess: () => {
      toast.success("Google account disconnected");
      void qc.invalidateQueries({ queryKey: ME_KEY });
    },
    onError: (e) => toast.error("Couldn't disconnect", { description: errorMessage(e) }),
  });

  const google = me?.google;

  return (
    <>
      <PageHeader title="Settings" description="Your account and connected services." />
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Account</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
              <div><dt className="text-xs text-muted-foreground">Name</dt><dd className="mt-0.5">{user?.name || "—"}</dd></div>
              <div>
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd className="mt-0.5 flex items-center gap-2">
                  {user?.email}
                  <Badge variant={user?.emailVerified ? "success" : "secondary"}>{user?.emailVerified ? "Verified" : "Unverified"}</Badge>
                </dd>
              </div>
              <div><dt className="text-xs text-muted-foreground">Plan</dt><dd className="mt-0.5">{isPro ? "Pro" : "Free"}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Member since</dt><dd className="mt-0.5">{formatDate(user?.createdAt)}</dd></div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Google Docs</CardTitle>
              {!isPro && <Badge variant="pro">Pro</Badge>}
            </div>
            <CardDescription>Export documents as editable Google Docs. DocFinish only gets access to files it creates in your Drive.</CardDescription>
          </CardHeader>
          <CardContent>
            {!google ? null : !google.configured ? (
              <div className="flex items-start gap-2 rounded-lg border border-[#ecd9ab] bg-[#fdf8ea] p-3 text-sm text-[#6b4f12]">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>Google Docs export isn&apos;t active yet. It turns on once Google credentials are connected to this workspace. PDF export is unaffected.</p>
              </div>
            ) : google.connected ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-sm"><CheckCircle2 className="size-4 text-success" /> Connected as <strong>{google.email}</strong></p>
                <Button variant="outline" size="sm" onClick={() => disconnect.mutate()} disabled={disconnect.isPending}>
                  {disconnect.isPending && <Loader2 className="animate-spin" />} Disconnect
                </Button>
              </div>
            ) : isPro ? (
              <Button asChild variant="accent"><a href={api.google.connectUrl()}>Connect Google account</a></Button>
            ) : (
              <p className="text-sm text-muted-foreground">Upgrade to Pro to connect Google and export editable Docs.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export function SettingsContainer() {
  return (
    <Suspense>
      <SettingsInner />
    </Suspense>
  );
}
