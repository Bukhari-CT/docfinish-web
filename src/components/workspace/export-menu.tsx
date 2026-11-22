"use client";

import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, ChevronDown, Cloud, Download, ExternalLink, FileDown, Loader2, Lock, Printer, ServerCog } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { DocumentPage } from "@/components/document/document-page";
import type { PaginatedDocument } from "@/components/document/use-paginated-document";
import { useGate } from "@/components/providers/gate-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { api, errorMessage, isApiError, pollJob, resolveDownloadUrl } from "@/lib/api/client";
import type { ConversionJob, DocumentSettings } from "@/lib/api/types";
import { ME_KEY, useSession } from "@/lib/auth/session";
import { isPremiumTemplate } from "@/lib/templates";
import { slugifyFilename } from "@/lib/utils";

export interface ExportMenuProps {
  doc: PaginatedDocument;
  settings: DocumentSettings;
  templateId: string;
  title: string;
  markdown: string;
  projectId?: string;
  /** Called before export in guest mode to persist the draft. */
  beforeAuthPrompt?: () => void;
  compact?: boolean;
}

function pageSizeCss(s: DocumentSettings) {
  const size = s.pageSize === "Letter" ? "letter" : "A4";
  return `${size} ${s.orientation}`;
}

type GoogleState =
  | { kind: "idle" }
  | { kind: "exporting" }
  | { kind: "success"; url: string }
  | { kind: "error"; message: string }
  | { kind: "not-connected" };

type ServerState =
  | { kind: "idle" }
  | { kind: "running"; job: ConversionJob | null; progress: number }
  | { kind: "success"; url: string }
  | { kind: "error"; message: string };

export function ExportMenu({ doc, settings, templateId, title, markdown, projectId, beforeAuthPrompt, compact }: ExportMenuProps) {
  const session = useSession();
  const gate = useGate();
  const qc = useQueryClient();
  const [printing, setPrinting] = useState(false);
  const [busy, setBusy] = useState<null | "pdf">(null);
  const printRoot = useRef<HTMLDivElement>(null);
  const waiters = useRef<Array<() => void>>([]);
  const [googleOpen, setGoogleOpen] = useState(false);
  const [google, setGoogle] = useState<GoogleState>({ kind: "idle" });
  const [serverOpen, setServerOpen] = useState(false);
  const [server, setServer] = useState<ServerState>({ kind: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const ready = doc.status === "ready" && !!doc.pages?.length;
  const fileTitle = slugifyFilename(title);

  useEffect(() => {
    if (printing && printRoot.current) {
      const ws = waiters.current;
      waiters.current = [];
      ws.forEach((w) => w());
    }
  });

  const mountPrintRoot = useCallback(
    () =>
      new Promise<HTMLDivElement>((resolve) => {
        waiters.current.push(() => requestAnimationFrame(() => requestAnimationFrame(() => resolve(printRoot.current as HTMLDivElement))));
        setPrinting(true);
      }),
    [],
  );

  /** Common gate for anything that records usage. Returns false if the user was prompted. */
  const ensureAllowed = (featureLabel: string): boolean => {
    if (session.status === "offline") {
      toast.error("DocFinish is unreachable right now", { description: "Exports need a connection to verify your plan. Your draft is safe." });
      return false;
    }
    if (session.status !== "authenticated") {
      beforeAuthPrompt?.();
      gate.requireAuth({
        title: "Sign in to export",
        reason: `${featureLabel} needs a free account. Free includes 3 PDF exports a month with no watermark.`,
      });
      return false;
    }
    if (isPremiumTemplate(templateId) && !session.isPro) {
      gate.requireUpgrade({ reason: "This document uses a premium template. Upgrade to export it, or switch to a basic template." });
      return false;
    }
    return true;
  };

  const handleApiError = (e: unknown, feature: string) => {
    if (isApiError(e)) {
      if (e.isUnauthenticated) {
        beforeAuthPrompt?.();
        gate.requireAuth({ title: "Your session expired", reason: "Log in again to export. Your draft is safe." });
        return;
      }
      if (e.isQuotaExceeded) {
        gate.requireUpgrade({
          title: "You've used this month's free PDF exports",
          reason: "Free includes 3 PDF exports per month. Upgrade for unlimited exports, or wait for your allowance to reset.",
          quota: e.quota,
        });
        return;
      }
      if (e.isPlanRequired) {
        gate.requireUpgrade({ reason: `${feature} is part of DocFinish Pro.` });
        return;
      }
    }
    toast.error(`${feature} failed`, { description: errorMessage(e) });
  };

  async function exportBrowserPdf() {
    if (!ready || !ensureAllowed("PDF export")) return;
    setBusy("pdf");
    try {
      const { usage } = await api.conversions.markdownToPdf({ projectId, title, mode: "browser", markdown, settings });
      qc.setQueryData(ME_KEY, (old: unknown) => (old && typeof old === "object" ? { ...(old as object), usage } : old));
    } catch (e) {
      setBusy(null);
      handleApiError(e, "PDF export");
      return;
    }

    const style = document.createElement("style");
    style.id = "df-print-page";
    style.textContent = `@page { size: ${pageSizeCss(settings)}; margin: 0; }`;
    document.head.appendChild(style);
    const prevTitle = document.title;
    document.title = fileTitle;
    try {
      await mountPrintRoot();
      window.print();
    } finally {
      // window.print() blocks in most browsers; afterprint covers the rest.
      const cleanup = () => {
        document.title = prevTitle;
        style.remove();
        setPrinting(false);
        setBusy(null);
      };
      if ("onafterprint" in window) {
        let done = false;
        const once = () => {
          if (done) return;
          done = true;
          window.removeEventListener("afterprint", once);
          cleanup();
        };
        window.addEventListener("afterprint", once);
        setTimeout(once, 1500);
      } else cleanup();
    }
  }

  async function exportServerPdf() {
    if (!ready || !ensureAllowed("Server PDF")) return;
    setServerOpen(true);
    setServer({ kind: "running", job: null, progress: 8 });
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const root = await mountPrintRoot();
      const pagesHtml = root.innerHTML;
      setPrinting(false);
      const html = `<div class="df-print-root" data-page-size="${settings.pageSize}" data-orientation="${settings.orientation}">${pagesHtml}</div>`;
      const { job, usage } = await api.conversions.markdownToPdf({ projectId, title, mode: "server", html, markdown, settings });
      qc.setQueryData(ME_KEY, (old: unknown) => (old && typeof old === "object" ? { ...(old as object), usage } : old));
      setServer({ kind: "running", job, progress: 30 });
      const final =
        job.status === "succeeded" || job.status === "failed"
          ? job
          : await pollJob(job.id, {
              signal: ac.signal,
              onUpdate: (j) => setServer((s) => (s.kind === "running" ? { kind: "running", job: j, progress: Math.min(92, s.progress + 9) } : s)),
            });
      if (final.status === "failed" || !final.result?.downloadUrl) {
        setServer({ kind: "error", message: final.error?.message ?? "The server could not produce a PDF." });
        return;
      }
      setServer({ kind: "success", url: resolveDownloadUrl(final.result.downloadUrl) });
    } catch (e) {
      setPrinting(false);
      if (e instanceof DOMException && e.name === "AbortError") return;
      if (isApiError(e) && (e.isQuotaExceeded || e.isUnauthenticated || e.isPlanRequired)) {
        setServerOpen(false);
        setServer({ kind: "idle" });
        handleApiError(e, "Server PDF");
        return;
      }
      setServer({ kind: "error", message: errorMessage(e) });
    }
  }

  function openGoogle() {
    if (session.status === "offline") {
      toast.error("DocFinish is unreachable right now");
      return;
    }
    if (session.status !== "authenticated") {
      beforeAuthPrompt?.();
      gate.requireAuth({ title: "Sign in to export to Google Docs", reason: "Google Docs export is part of DocFinish Pro." });
      return;
    }
    if (!session.entitlements?.googleDocsExport) {
      gate.requireUpgrade({ reason: "Export editable Google Docs with your headings, tables, headers, and footers intact." });
      return;
    }
    setGoogle(session.me?.google.connected ? { kind: "idle" } : { kind: "not-connected" });
    setGoogleOpen(true);
  }

  async function runGoogleExport() {
    setGoogle({ kind: "exporting" });
    try {
      const res = await api.google.exportDocument({ projectId, title, markdown, settings });
      setGoogle({ kind: "success", url: res.url });
    } catch (e) {
      if (isApiError(e) && e.isConflict && e.details.reason === "google_not_connected") {
        setGoogle({ kind: "not-connected" });
        return;
      }
      if (isApiError(e) && (e.isPlanRequired || e.isUnauthenticated)) {
        setGoogleOpen(false);
        handleApiError(e, "Google Docs export");
        return;
      }
      setGoogle({ kind: "error", message: errorMessage(e) });
    }
  }

  const googleConfigured = session.me?.google.configured ?? true;
  const usage = session.usage;
  const limit = session.entitlements?.pdfExportsPerMonth;

  return (
    <>
      <div className="flex items-center">
        <Button
          variant="accent"
          size="sm"
          className="rounded-r-none"
          onClick={() => void exportBrowserPdf()}
          disabled={!ready || busy === "pdf"}
          aria-label="Export PDF"
        >
          {busy === "pdf" ? <Loader2 className="animate-spin" /> : <FileDown />}
          {!compact && "Export PDF"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="accent" size="sm" className="rounded-l-none border-l border-white/20 px-2" aria-label="More export options">
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Export</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => void exportBrowserPdf()} disabled={!ready}>
              <Printer />
              <div className="flex flex-col">
                <span>PDF (print-exact)</span>
                <span className="text-[11px] text-muted-foreground">Matches the preview page for page</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void exportServerPdf()} disabled={!ready}>
              <ServerCog />
              <div className="flex flex-col">
                <span className="flex items-center gap-1.5">
                  Server PDF <Badge variant="secondary">beta</Badge>
                </span>
                <span className="text-[11px] text-muted-foreground">Rendered on our servers, download link</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={openGoogle}>
              <Cloud />
              <div className="flex flex-1 flex-col">
                <span className="flex items-center gap-1.5">
                  Google Docs {!session.isPro && <Badge variant="pro"><Lock /> Pro</Badge>}
                </span>
                <span className="text-[11px] text-muted-foreground">Editable doc in your Drive</span>
              </div>
            </DropdownMenuItem>
            {session.status === "authenticated" && limit != null && usage && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-[11px] text-muted-foreground">
                  {Math.max(0, limit - usage.pdfExports)} of {limit} free PDF exports left this month · no watermark
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {printing &&
        createPortal(
          <div className="df-print-root" ref={printRoot}>
            {(doc.pages ?? []).map((p, i) => (
              <DocumentPage
                key={i}
                html={p.html}
                isCover={p.isCover}
                chrome={doc.chromes[i]}
                geometry={doc.geometry}
                settings={settings}
                templateId={templateId}
                styleVars={doc.styleVars}
                pageIndex={i}
              />
            ))}
          </div>,
          document.body,
        )}

      {/* Server PDF dialog */}
      <Dialog
        open={serverOpen}
        onOpenChange={(o) => {
          if (!o) abortRef.current?.abort();
          setServerOpen(o);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Server PDF (beta)</DialogTitle>
            <DialogDescription>We render your paginated pages on our servers and give you a download link valid for 10 minutes.</DialogDescription>
          </DialogHeader>
          {server.kind === "running" && (
            <div className="space-y-2">
              <Progress value={server.progress} />
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                {server.job?.status === "processing" ? "Rendering pages…" : "Queued…"}
              </p>
            </div>
          )}
          {server.kind === "success" && (
            <div className="flex items-start gap-3 rounded-lg border border-[#cfe7d9] bg-[#f1f9f4] p-3 text-sm">
              <CheckCircle2 className="mt-0.5 size-5 text-success" />
              <div>
                <p className="font-medium">Your PDF is ready.</p>
                <p className="text-muted-foreground">The link expires in 10 minutes.</p>
              </div>
            </div>
          )}
          {server.kind === "error" && (
            <div className="flex items-start gap-3 rounded-lg border border-[#f1c8c2] bg-[#fdf0ee] p-3 text-sm">
              <AlertCircle className="mt-0.5 size-5 text-destructive" />
              <div>
                <p className="font-medium">Server PDF failed</p>
                <p className="text-muted-foreground">{server.message} The print-exact PDF export still works.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            {server.kind === "error" && (
              <Button variant="outline" onClick={() => void exportServerPdf()}>
                Try again
              </Button>
            )}
            {server.kind === "success" && (
              <Button variant="accent" asChild>
                <a href={server.url} download={`${fileTitle}.pdf`}>
                  <Download /> Download PDF
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Google Docs dialog */}
      <Dialog open={googleOpen} onOpenChange={setGoogleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export to Google Docs</DialogTitle>
            <DialogDescription>Creates an editable Google Doc with headings, lists, tables, header, and footer.</DialogDescription>
          </DialogHeader>
          {!googleConfigured ? (
            <div className="rounded-lg border bg-paper p-4 text-sm">
              <p className="font-medium">Google export isn&apos;t active yet</p>
              <p className="mt-1 text-muted-foreground">
                Google Docs export activates once this DocFinish workspace connects its Google credentials. PDF export works in the meantime.
              </p>
            </div>
          ) : google.kind === "not-connected" ? (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">Connect your Google account once. DocFinish only gets access to files it creates.</p>
              <Button variant="accent" asChild>
                <a href={api.google.connectUrl()}>Connect Google</a>
              </Button>
            </div>
          ) : google.kind === "exporting" ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Creating your Google Doc…
            </p>
          ) : google.kind === "success" ? (
            <div className="flex items-start gap-3 rounded-lg border border-[#cfe7d9] bg-[#f1f9f4] p-3 text-sm">
              <CheckCircle2 className="mt-0.5 size-5 text-success" />
              <div>
                <p className="font-medium">Your Google Doc is ready.</p>
                <a href={google.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-cobalt underline">
                  Open in Google Docs <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          ) : google.kind === "error" ? (
            <div className="flex items-start gap-3 rounded-lg border border-[#f1c8c2] bg-[#fdf0ee] p-3 text-sm">
              <AlertCircle className="mt-0.5 size-5 text-destructive" />
              <div>
                <p className="font-medium">Export failed</p>
                <p className="text-muted-foreground">{google.message}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Connected as <span className="font-medium text-ink">{session.me?.google.email ?? "your Google account"}</span>.
            </p>
          )}
          <DialogFooter>
            {googleConfigured && (google.kind === "idle" || google.kind === "error") && (
              <Button variant="accent" onClick={() => void runGoogleExport()}>
                {google.kind === "error" ? "Try again" : "Export to Google Docs"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
