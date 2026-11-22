"use client";

import { AlertCircle, CheckCircle2, Copy, Download, FileInput, FileText, Loader2, Lock, PenLine, RotateCcw, Upload, WifiOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { api, errorMessage, isApiError, pollJob } from "@/lib/api/client";
import { useSession } from "@/lib/auth/session";
import { getTemplateOrDefault } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { checkPdfFile, formatBytes } from "@/lib/workspace/files";
import { saveGuestDraft } from "@/lib/workspace/guest-draft";

type Phase =
  | { kind: "idle" }
  | { kind: "uploading"; file: File }
  | { kind: "converting"; file: File; progress: number }
  | { kind: "done"; file: File; markdown: string }
  | { kind: "error"; message: string; file?: File };

export function PdfToMarkdownTool() {
  const session = useSession();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function start(file: File | undefined) {
    if (!file) return;
    const check = checkPdfFile(file);
    if (!check.ok) {
      toast.error(check.error);
      return;
    }
    setPhase({ kind: "uploading", file });
    try {
      const { file: stored } = await api.files.upload(file, "pdf");
      setPhase({ kind: "converting", file, progress: 20 });
      const { job } = await api.conversions.pdfToMarkdown(stored.id);
      const final =
        job.status === "succeeded" || job.status === "failed"
          ? job
          : await pollJob(job.id, {
              onUpdate: () => setPhase((p) => (p.kind === "converting" ? { ...p, progress: Math.min(92, p.progress + 8) } : p)),
            });
      if (final.status === "failed" || typeof final.result?.markdown !== "string") {
        setPhase({ kind: "error", file, message: final.error?.message ?? "We couldn't extract text from this PDF." });
        return;
      }
      setPhase({ kind: "done", file, markdown: final.result.markdown });
    } catch (e) {
      setPhase({ kind: "error", file, message: errorMessage(e) });
      if (isApiError(e) && e.isPlanRequired) toast.error("PDF to Markdown is a Pro feature.");
    }
  }

  function openInEditor(markdown: string) {
    const t = getTemplateOrDefault("business-report");
    saveGuestDraft({ markdown, settings: { ...t.settings, titlePage: false }, templateId: t.id });
    router.push("/tools/markdown-to-pdf");
  }

  if (session.status === "loading") {
    return (
      <div className="space-y-4 rounded-2xl border bg-white p-8">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (session.status === "offline") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border bg-white p-8">
        <WifiOff className="mt-0.5 size-5 text-warning" />
        <div>
          <p className="font-medium">DocFinish is temporarily unreachable</p>
          <p className="mt-1 text-muted-foreground">PDF conversion runs on our servers. Please try again in a moment—other tools still work offline.</p>
        </div>
      </div>
    );
  }

  if (!session.entitlements?.pdfToMarkdown) {
    const guest = session.status !== "authenticated";
    return (
      <div className="grid gap-8 rounded-2xl border bg-white p-8 sm:p-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Badge variant="pro">
            <Lock /> Pro feature
          </Badge>
          <h2 className="mt-4 font-display text-2xl font-medium">Extract clean Markdown from any PDF</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Upload a PDF up to 20 MB and get structured Markdown—headings, lists, and tables—ready to edit, re-brand, and export again. PDF to Markdown runs on our servers, so it&apos;s part of DocFinish Pro.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {guest ? (
              <>
                <Button asChild variant="accent">
                  <Link href="/signup?next=/pricing">Create an account</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/login?next=/tools/pdf-to-markdown">Log in</Link>
                </Button>
              </>
            ) : (
              <Button asChild variant="accent">
                <Link href="/pricing">Upgrade to Pro</Link>
              </Button>
            )}
          </div>
        </div>
        <ol className="space-y-3 text-sm">
          {["Upload a PDF (up to 20 MB)", "We extract text, headings, and tables", "Edit the Markdown and re-export with your brand"].map((s, i) => (
            <li key={s} className="flex items-center gap-3 rounded-lg border bg-paper px-4 py-3">
              <span className="flex size-6 items-center justify-center rounded-full bg-navy text-[12px] font-semibold text-white">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 sm:p-8">
      {phase.kind === "idle" && (
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            void start(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-16 text-center transition-colors",
            drag ? "border-cobalt bg-cobalt-soft/40" : "border-border hover:border-cobalt/60",
          )}
        >
          <Upload className="size-7 text-cobalt" />
          <span className="text-lg font-medium">Drop a PDF here, or click to choose</span>
          <span className="text-sm text-muted-foreground">PDF up to 20 MB · files are deleted after 24 hours</span>
        </button>
      )}
      <input
        ref={input}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          void start(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {(phase.kind === "uploading" || phase.kind === "converting") && (
        <div className="mx-auto max-w-md py-12 text-center">
          <FileText className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 font-medium">{phase.file.name}</p>
          <p className="text-sm text-muted-foreground">{formatBytes(phase.file.size)}</p>
          <Progress className="mt-6" value={phase.kind === "uploading" ? 12 : phase.progress} />
          <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {phase.kind === "uploading" ? "Uploading…" : "Converting to Markdown…"}
          </p>
        </div>
      )}

      {phase.kind === "error" && (
        <div className="mx-auto max-w-md py-12 text-center">
          <AlertCircle className="mx-auto size-8 text-destructive" />
          <p className="mt-3 font-medium">Conversion failed</p>
          <p className="mt-1 text-sm text-muted-foreground">{phase.message}</p>
          <div className="mt-6 flex justify-center gap-2">
            {phase.file && (
              <Button variant="outline" onClick={() => void start(phase.file)}>
                <RotateCcw /> Retry
              </Button>
            )}
            <Button variant="ghost" onClick={() => setPhase({ kind: "idle" })}>
              Choose another file
            </Button>
          </div>
        </div>
      )}

      {phase.kind === "done" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <CheckCircle2 className="size-5 text-success" />
            <p className="font-medium">Converted {phase.file.name}</p>
            <div className="ml-auto flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => void navigator.clipboard.writeText(phase.markdown).then(() => toast.success("Markdown copied"))}
              >
                <Copy /> Copy
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={`data:text/markdown;charset=utf-8,${encodeURIComponent(phase.markdown)}`} download={phase.file.name.replace(/\.pdf$/i, "") + ".md"}>
                  <Download /> Download .md
                </a>
              </Button>
              <Button size="sm" variant="accent" onClick={() => openInEditor(phase.markdown)}>
                <PenLine /> Open in editor
              </Button>
            </div>
          </div>
          <Textarea readOnly value={phase.markdown} className="h-[420px] font-mono text-[13px]" aria-label="Converted Markdown" />
          <Button variant="ghost" size="sm" onClick={() => setPhase({ kind: "idle" })}>
            <FileInput /> Convert another PDF
          </Button>
        </div>
      )}
    </div>
  );
}
