"use client";

import { ArrowRight, FileUp, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { NewProjectDialogContainer } from "@/containers/NewProjectDialogContainer";
import { PageHeader } from "@/components/app/page-header";
import { ProjectsGridContainer } from "@/containers/ProjectsGridContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth/session";
import { checkMarkdownFile, readFileAsText } from "@/lib/workspace/files";
import { formatDate } from "@/lib/utils";

export function DashboardContainer() {
  const { user, entitlements, usage, isPro, me } = useSession();
  const [open, setOpen] = useState(false);
  const [upload, setUpload] = useState<{ markdown: string; name: string } | null>(null);
  const input = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    const check = checkMarkdownFile(file);
    if (!check.ok) return void toast.error("Can't open that file", { description: check.error });
    try {
      setUpload({ markdown: await readFileAsText(file), name: file.name.replace(/\.(md|markdown|txt)$/i, "") });
      setOpen(true);
    } catch {
      toast.error("Couldn't read that file.");
    }
  }

  const exportsLimit = entitlements?.pdfExportsPerMonth ?? null;
  const used = usage?.pdfExports ?? 0;
  const first = user?.name?.split(" ")[0];

  return (
    <>
      <PageHeader
        title={first ? `Welcome back, ${first}` : "Welcome back"}
        description="Paste Markdown, choose a template, and export a document you're proud to send."
        actions={
          <>
            <input ref={input} type="file" accept=".md,.markdown,.txt,text/markdown,text/plain" className="hidden" onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ""; }} />
            <Button variant="outline" onClick={() => input.current?.click()}>
              <FileUp /> Upload .md
            </Button>
            <Button variant="accent" onClick={() => { setUpload(null); setOpen(true); }}>
              <Plus /> New document
            </Button>
          </>
        }
      />

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>PDF exports this month</CardDescription>
            {usage ? (
              <CardTitle className="text-3xl font-medium tabular-nums">
                {used}
                <span className="text-base font-normal text-muted-foreground">{exportsLimit === null ? " · unlimited" : ` / ${exportsLimit}`}</span>
              </CardTitle>
            ) : (
              <Skeleton className="h-9 w-24" />
            )}
          </CardHeader>
          <CardContent>
            {exportsLimit !== null && <Progress value={Math.min(100, (used / exportsLimit) * 100)} indicatorClassName={used >= exportsLimit ? "bg-warning" : undefined} />}
            {usage && <p className="mt-2 text-xs text-muted-foreground">{exportsLimit === null ? "No limits on Pro." : `Resets ${formatDate(usage.periodEnd)}.`}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Saved projects</CardDescription>
            {usage ? (
              <CardTitle className="text-3xl font-medium tabular-nums">
                {usage.projects}
                <span className="text-base font-normal text-muted-foreground">{entitlements?.maxProjects == null ? " · unlimited" : ` / ${entitlements.maxProjects}`}</span>
              </CardTitle>
            ) : (
              <Skeleton className="h-9 w-24" />
            )}
          </CardHeader>
          <CardContent>
            <Link href="/projects" className="text-xs font-medium text-cobalt hover:underline">View all projects →</Link>
          </CardContent>
        </Card>
        <Card className={isPro ? "" : "border-[#d9c48f] bg-[#fdf9ee]"}>
          <CardHeader className="pb-2">
            <CardDescription>Plan</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl font-medium">
              {isPro ? "Pro" : "Free"} {isPro && <Badge variant="pro">Active</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPro ? (
              <p className="text-xs text-muted-foreground">Google Docs export {me?.google.connected ? `connected (${me.google.email})` : "ready to connect in Settings"}.</p>
            ) : (
              <Link href="/billing" className="inline-flex items-center gap-1 text-xs font-medium text-[#7a5a12] hover:underline">
                <Sparkles className="size-3" /> Unlock Google Docs, brand kit &amp; unlimited exports <ArrowRight className="size-3" />
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <section aria-labelledby="recent">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="recent" className="font-display text-xl text-navy">Recent documents</h2>
          <Link href="/projects" className="text-sm text-cobalt hover:underline">See all</Link>
        </div>
        <ProjectsGridContainer limit={3} onCreate={() => { setUpload(null); setOpen(true); }} />
      </section>

      {open && <NewProjectDialogContainer open={open} onOpenChange={setOpen} initialMarkdown={upload?.markdown} initialName={upload?.name} />}
    </>
  );
}
