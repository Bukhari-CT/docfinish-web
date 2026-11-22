"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CloudOff,
  FileUp,
  Loader2,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Sparkles,
  Check,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { PagesView } from "@/components/document/pages-view";
import { usePaginatedDocument } from "@/components/document/use-paginated-document";
import { useGate } from "@/components/providers/gate-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { api, errorMessage, isApiError } from "@/lib/api/client";
import type { BrandKitInput, DocumentSettings, HeaderPreset, Project } from "@/lib/api/types";
import { useSession } from "@/lib/auth/session";
import { extractTitle } from "@/lib/markdown/pipeline";
import { cloneSettings, getTemplate, getTemplateOrDefault, type TemplateId } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { useAutosave, type SaveStatus } from "@/lib/workspace/autosave";
import { checkMarkdownFile, readFileAsText } from "@/lib/workspace/files";
import { clearGuestDraft, loadGuestDraft, saveGuestDraft } from "@/lib/workspace/guest-draft";
import { ExportMenu } from "./export-menu";
import { SettingsPanel } from "./settings-panel";

const MarkdownEditor = dynamic(() => import("./markdown-editor"), {
  ssr: false,
  loading: () => (
    <div className="space-y-2 p-4">
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} className="h-3 animate-shimmer rounded bg-[#efebe3]" style={{ width: `${40 + ((i * 29) % 55)}%` }} />
      ))}
    </div>
  ),
});

type GuestProps = {
  mode: "guest";
  defaultTemplateId?: TemplateId;
  sampleMarkdown?: string;
  className?: string;
};
type ProjectProps = {
  mode: "project";
  project: Project;
  className?: string;
};
export type DocumentWorkspaceProps = GuestProps | ProjectProps;

const ZOOMS = [0.5, 0.67, 0.75, 0.9, 1, 1.25, 1.5];

function SaveIndicator({ status, onRetry }: { status: SaveStatus; onRetry: () => void }) {
  const map: Record<SaveStatus, { label: string; icon: React.ReactNode; cls: string }> = {
    saved: { label: "Saved", icon: <Check className="size-3.5" />, cls: "text-muted-foreground" },
    dirty: { label: "Unsaved changes", icon: <span className="size-1.5 rounded-full bg-warning" />, cls: "text-muted-foreground" },
    saving: { label: "Saving…", icon: <Loader2 className="size-3.5 animate-spin" />, cls: "text-muted-foreground" },
    offline: { label: "Offline – retrying", icon: <CloudOff className="size-3.5" />, cls: "text-warning" },
    conflict: { label: "Conflict", icon: <AlertTriangle className="size-3.5" />, cls: "text-destructive" },
    error: { label: "Save failed", icon: <AlertTriangle className="size-3.5" />, cls: "text-destructive" },
  };
  const m = map[status];
  return (
    <button
      type="button"
      onClick={status === "error" || status === "offline" ? onRetry : undefined}
      className={cn("inline-flex items-center gap-1.5 text-[12px] whitespace-nowrap", m.cls)}
      aria-live="polite"
    >
      {m.icon}
      {m.label}
    </button>
  );
}

export function DocumentWorkspace(props: DocumentWorkspaceProps) {
  const isGuest = props.mode === "guest";
  const router = useRouter();
  const gate = useGate();
  const session = useSession();
  const qc = useQueryClient();

  const initialTemplate = getTemplateOrDefault(isGuest ? props.defaultTemplateId : props.project.templateId);
  const [templateId, setTemplateId] = useState<string>(initialTemplate.id);
  const [markdown, setMarkdown] = useState<string>(isGuest ? (props.sampleMarkdown ?? initialTemplate.starterMarkdown) : props.project.markdown);
  const [settings, setSettings] = useState<DocumentSettings>(() =>
    cloneSettings(isGuest ? initialTemplate.settings : props.project.settings),
  );
  const [name, setName] = useState<string>(isGuest ? "" : props.project.name);
  const [hydrated, setHydrated] = useState(!isGuest);
  const [showEditor, setShowEditor] = useState(true);
  const [zoom, setZoom] = useState<"fit" | number>("fit");
  const [fitZoom, setFitZoom] = useState(0.8);
  const [dragging, setDragging] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<string | null>(null);
  const [replaceContent, setReplaceContent] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const storageWarned = useRef(false);

  const title = isGuest ? extractTitle(markdown) : name || extractTitle(markdown);
  const update = useCallback((fn: (s: DocumentSettings) => DocumentSettings) => setSettings((s) => fn(s)), []);

  const doc = usePaginatedDocument({ markdown, settings, templateId, title });

  /* ---------- Guest draft: load once, then persist (debounced) ---------- */
  useEffect(() => {
    if (!isGuest) return;
    const d = loadGuestDraft();
    if (d && d.markdown.trim()) {
      setMarkdown(d.markdown);
      setSettings(d.settings);
      setTemplateId(getTemplate(d.templateId)?.id ?? initialTemplate.id);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  const persistGuest = useCallback(() => {
    if (!isGuest || !hydrated) return;
    const ok = saveGuestDraft({ markdown, settings, templateId });
    if (!ok && !storageWarned.current) {
      storageWarned.current = true;
      toast.warning("Couldn't save the draft in this browser", { description: "Storage is full or disabled (large logos use a lot of space)." });
    }
  }, [isGuest, hydrated, markdown, settings, templateId]);

  useEffect(() => {
    if (!isGuest || !hydrated) return;
    const t = setTimeout(persistGuest, 600);
    return () => clearTimeout(t);
  }, [isGuest, hydrated, persistGuest]);

  /* ---------- Project autosave ---------- */
  const autosaveDoc = useMemo(
    () => (isGuest ? null : { name: name.trim() || "Untitled document", templateId, markdown, settings }),
    [isGuest, name, templateId, markdown, settings],
  );
  const autosave = useAutosave({
    projectId: isGuest ? "" : props.project.id,
    doc: autosaveDoc,
    initialVersion: isGuest ? null : props.project.version,
    enabled: !isGuest,
    onError: (e) => {
      if (isApiError(e) && e.isPlanRequired) gate.requireUpgrade({ reason: "Premium templates are part of DocFinish Pro. Switch to a basic template to keep saving." });
      else if (isApiError(e) && e.isUnauthenticated) gate.requireAuth({ title: "Your session expired", reason: "Log in again to keep saving." });
      else toast.error("Couldn't save", { description: errorMessage(e) });
    },
  });
  const { markBaseline } = autosave;
  useEffect(() => {
    if (isGuest) return;
    const p = props.project;
    markBaseline({ name: p.name, templateId: p.templateId, markdown: p.markdown, settings: p.settings }, p.version);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- baseline once per loaded project
  }, [isGuest ? null : props.project.id]);

  /* ---------- Fit-to-width zoom ---------- */
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const calc = () => {
      const w = el.clientWidth - 64;
      setFitZoom(Math.max(0.3, Math.min(1.25, w / doc.geometry.widthPx)));
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [doc.geometry.widthPx]);
  const effectiveZoom = zoom === "fit" ? fitZoom : zoom;
  const stepZoom = (dir: 1 | -1) => {
    const cur = effectiveZoom;
    const next = dir > 0 ? ZOOMS.find((z) => z > cur + 0.01) : [...ZOOMS].reverse().find((z) => z < cur - 0.01);
    if (next) setZoom(next);
  };

  /* ---------- Content actions ---------- */
  const replaceMarkdown = useCallback(
    (next: string, label: string) => {
      const prev = markdown;
      setMarkdown(next);
      toast.success(label, { action: { label: "Undo", onClick: () => setMarkdown(prev) } });
    },
    [markdown],
  );

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const check = checkMarkdownFile(file);
    if (!check.ok) {
      toast.error("Can't open that file", { description: check.error });
      return;
    }
    try {
      const text = await readFileAsText(file);
      if (text.includes("\u0000")) {
        toast.error("That doesn't look like a text file.");
        return;
      }
      replaceMarkdown(text, `Loaded ${file.name}`);
    } catch {
      toast.error("Couldn't read that file.");
    }
  }

  function requestTemplate(id: string) {
    if (id === templateId) return;
    const t = getTemplate(id);
    if (!t) return;
    if (!isGuest && t.tier === "premium" && !session.isPro) {
      gate.requireUpgrade({ reason: `${t.name} is a premium template. Upgrade to use it in saved projects.` });
      return;
    }
    const current = getTemplate(templateId);
    const untouched = !markdown.trim() || markdown === current?.starterMarkdown;
    setReplaceContent(untouched);
    setPendingTemplate(id);
  }

  function applyTemplate() {
    const t = getTemplate(pendingTemplate);
    if (!t) return;
    const prevTemplate = getTemplate(templateId);
    setSettings((prev) => {
      const next = cloneSettings(t.settings);
      next.logo = { ...next.logo, dataUrl: prev.logo.dataUrl, placement: prev.logo.dataUrl ? prev.logo.placement : next.logo.placement };
      if (prev.companyName && prev.companyName !== prevTemplate?.settings.companyName) next.companyName = prev.companyName;
      return next;
    });
    setTemplateId(t.id);
    if (replaceContent) replaceMarkdown(t.starterMarkdown, `Loaded ${t.name} starter content`);
    else toast.success(`Applied ${t.name}`);
    if (t.tier === "premium" && !session.isPro) {
      toast.message("Premium template preview", { description: "Preview is free. Exporting with this template needs Pro." });
    }
    setPendingTemplate(null);
  }

  /* ---------- Brand kit & presets (Pro) ---------- */
  const brandKitQuery = useQuery({
    queryKey: ["brand-kit"],
    queryFn: () => api.brandKit.get(),
    enabled: session.status === "authenticated" && session.isPro,
  });
  const presets: HeaderPreset[] = brandKitQuery.data?.brandKit?.headerPresets ?? [];

  const brandKitMutation = useMutation({
    mutationFn: (body: BrandKitInput) => api.brandKit.put(body),
    onSuccess: (res) => {
      qc.setQueryData(["brand-kit"], res);
    },
  });

  function kitFromSettings(extraPresets?: HeaderPreset[]): BrandKitInput {
    const existing = brandKitQuery.data?.brandKit;
    return {
      name: existing?.name ?? (settings.companyName || "My brand"),
      companyName: settings.companyName,
      logoDataUrl: settings.logo.dataUrl,
      primaryColor: existing?.primaryColor ?? "#0f1b2d",
      accentColor: settings.accentColor,
      textColor: settings.textColor,
      headingFont: settings.headingFontFamily,
      bodyFont: settings.fontFamily,
      headerPresets: extraPresets ?? existing?.headerPresets ?? [],
      defaultPageSize: settings.pageSize,
      defaultMargins: settings.margins,
    };
  }

  const proOnly = (feature: string) => {
    if (session.status !== "authenticated") {
      gate.requireAuth({ title: "Create an account", reason: `${feature} is available on DocFinish Pro. Start with a free account.` });
      return;
    }
    gate.requireUpgrade({ reason: `${feature} is part of DocFinish Pro.` });
  };

  async function saveBrandKit() {
    try {
      await brandKitMutation.mutateAsync(kitFromSettings());
      toast.success("Brand kit saved");
    } catch (e) {
      if (isApiError(e) && e.isPlanRequired) proOnly("Saving brand kits");
      else toast.error("Couldn't save brand kit", { description: errorMessage(e) });
    }
  }

  async function applyBrandKit() {
    try {
      const { brandKit } = brandKitQuery.data ?? (await api.brandKit.get());
      if (!brandKit) {
        toast.message("No brand kit yet", { description: "Use “Save as brand kit” to create one." });
        return;
      }
      setSettings((s) => ({
        ...s,
        companyName: brandKit.companyName,
        accentColor: brandKit.accentColor,
        textColor: brandKit.textColor,
        fontFamily: brandKit.bodyFont,
        headingFontFamily: brandKit.headingFont,
        pageSize: brandKit.defaultPageSize,
        margins: brandKit.defaultMargins,
        logo: { ...s.logo, dataUrl: brandKit.logoDataUrl },
      }));
      toast.success(`Applied ${brandKit.name}`);
    } catch (e) {
      toast.error("Couldn't load brand kit", { description: errorMessage(e) });
    }
  }

  async function savePreset() {
    const presetName = window.prompt("Name this header & footer preset", `${title} preset`);
    if (!presetName) return;
    const preset: HeaderPreset = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
      name: presetName.slice(0, 80),
      header: settings.header,
      footer: settings.footer,
    };
    try {
      await brandKitMutation.mutateAsync(kitFromSettings([...presets, preset]));
      toast.success("Preset saved");
    } catch (e) {
      toast.error("Couldn't save preset", { description: errorMessage(e) });
    }
  }

  /* ---------- Guest → project import ---------- */
  const importMutation = useMutation({
    mutationFn: () =>
      api.projects.create({
        name: title,
        templateId: getTemplate(templateId)?.tier === "premium" && !session.isPro ? "client-proposal" : templateId,
        markdown,
        settings,
      }),
    onSuccess: ({ project }) => {
      clearGuestDraft();
      toast.success("Draft saved as a project");
      router.push(`/editor/${project.id}`);
    },
    onError: (e) => {
      if (isApiError(e) && e.isQuotaExceeded) {
        gate.requireUpgrade({ title: "Free includes one project", reason: "Upgrade to Pro for unlimited projects with version history.", quota: e.quota });
      } else toast.error("Couldn't create project", { description: errorMessage(e) });
    },
  });

  /* ---------- Conflict resolution ---------- */
  function takeTheirs() {
    const c = autosave.takeTheirs();
    if (!c) return;
    setName(c.name);
    setMarkdown(c.markdown);
    setSettings(c.settings);
    setTemplateId(c.templateId);
  }

  const pageCount = doc.pages?.length ?? 0;
  const template = getTemplateOrDefault(templateId);

  return (
    <div
      className={cn("relative flex h-full min-h-0 flex-col bg-canvas", props.className)}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes("Files")) {
          e.preventDefault();
          setDragging(true);
        }
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void handleFile(e.dataTransfer.files?.[0]);
      }}
    >
      {doc.measurer}

      {/* ---------- Toolbar ---------- */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b bg-white/90 px-3 backdrop-blur">
        <Tooltip content={showEditor ? "Hide Markdown" : "Show Markdown"}>
          <Button variant="ghost" size="icon-sm" className="hidden lg:inline-flex" onClick={() => setShowEditor((v) => !v)} aria-label="Toggle editor">
            {showEditor ? <PanelLeftClose /> : <PanelLeftOpen />}
          </Button>
        </Tooltip>
        {isGuest ? (
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-medium">{title}</span>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Draft · saved in this browser
            </Badge>
          </div>
        ) : (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 200))}
            className="h-8 max-w-[280px] border-transparent bg-transparent px-2 font-medium shadow-none hover:border-input focus-visible:bg-white"
            aria-label="Document name"
          />
        )}

        <div className="ml-2 hidden items-center gap-1 lg:flex">
          <input
            ref={fileInput}
            type="file"
            accept=".md,.markdown,.txt,text/markdown,text/plain"
            className="hidden"
            onChange={(e) => {
              void handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <Button variant="ghost" size="sm" onClick={() => fileInput.current?.click()}>
            <FileUp /> Upload .md
          </Button>
          <Button variant="ghost" size="sm" onClick={() => replaceMarkdown(template.starterMarkdown, `Loaded ${template.name} sample`)}>
            <Sparkles /> Load sample
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {!isGuest && <SaveIndicator status={autosave.status} onRetry={() => void autosave.save()} />}
          {isGuest && session.status === "authenticated" && (
            <Button size="sm" variant="outline" onClick={() => importMutation.mutate()} disabled={importMutation.isPending} className="hidden md:inline-flex">
              {importMutation.isPending && <Loader2 className="animate-spin" />}
              Save as project
            </Button>
          )}
          <div className="hidden items-center rounded-md border bg-white md:flex">
            <Button variant="ghost" size="icon-sm" onClick={() => stepZoom(-1)} aria-label="Zoom out">
              <ZoomOut />
            </Button>
            <button
              type="button"
              className="w-14 text-center text-[12px] tabular-nums text-muted-foreground hover:text-ink"
              onClick={() => setZoom(zoom === "fit" ? 1 : "fit")}
              title="Toggle fit to width / 100%"
            >
              {zoom === "fit" ? "Fit" : `${Math.round(effectiveZoom * 100)}%`}
            </button>
            <Button variant="ghost" size="icon-sm" onClick={() => stepZoom(1)} aria-label="Zoom in">
              <ZoomIn />
            </Button>
          </div>
          <ExportMenu
            doc={doc}
            settings={settings}
            templateId={templateId}
            title={title}
            markdown={markdown}
            projectId={isGuest ? undefined : props.project.id}
            beforeAuthPrompt={persistGuest}
          />
        </div>
      </div>

      {/* Small-screen notice */}
      <div className="flex items-start gap-2 border-b bg-[#fdf8ea] px-4 py-2.5 text-[13px] text-[#6b4f12] lg:hidden">
        <Monitor className="mt-0.5 size-4 shrink-0" />
        <p>
          The editor is best on desktop. You&apos;re viewing a preview-only mode — open DocFinish on a larger screen to edit Markdown and settings.
        </p>
      </div>

      {/* Conflict banner */}
      {autosave.status === "conflict" && (
        <div className="flex flex-wrap items-center gap-3 border-b border-[#f1c8c2] bg-[#fdf0ee] px-4 py-2 text-[13px]">
          <AlertTriangle className="size-4 text-destructive" />
          <span>This document was changed somewhere else. Which version do you want to keep?</span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" onClick={takeTheirs}>
              <RotateCcw /> Load the other version
            </Button>
            <Button size="sm" variant="default" onClick={autosave.keepMine}>
              Keep mine
            </Button>
          </div>
        </div>
      )}

      {/* ---------- Panes ---------- */}
      <div className="flex min-h-0 flex-1">
        {showEditor && (
          <div className="hidden w-[clamp(300px,28vw,440px)] shrink-0 flex-col border-r bg-white lg:flex">
            <div className="flex h-9 items-center justify-between border-b px-4 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              Markdown
              <span className="font-normal tracking-normal normal-case">Paste, type, or drop a .md file</span>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <MarkdownEditor value={markdown} onChange={setMarkdown} />
            </div>
          </div>
        )}

        <div ref={previewRef} className="relative min-w-0 flex-1 overflow-auto" aria-label="Document preview">
          <div className="sticky top-0 z-10 flex justify-center pt-3">
            <span className="rounded-full border bg-white/90 px-3 py-1 text-[11px] text-muted-foreground shadow-sm backdrop-blur">
              {doc.status === "paginating" && pageCount === 0 ? (
                "Preparing pages…"
              ) : (
                <>
                  {pageCount} {pageCount === 1 ? "page" : "pages"} · {settings.pageSize} {settings.orientation}
                  {doc.status === "paginating" && <Loader2 className="ml-1.5 inline size-3 animate-spin" />}
                  {doc.status === "error" && <span className="ml-1.5 text-destructive">· layout error</span>}
                </>
              )}
            </span>
          </div>
          <div className="px-8 pt-4 pb-24">
            <PagesView
              doc={doc}
              settings={settings}
              templateId={templateId}
              zoom={effectiveZoom}
              pageClassName="shadow-[0_1px_2px_rgba(20,22,26,0.06),0_18px_40px_-18px_rgba(20,22,26,0.28)]"
            />
          </div>
        </div>

        <aside className="hidden w-[300px] shrink-0 border-l bg-paper lg:block">
          <SettingsPanel
            settings={settings}
            update={update}
            templateId={templateId}
            onSelectTemplate={requestTemplate}
            isPro={session.isPro}
            onProFeature={proOnly}
            onSaveBrandKit={session.isPro ? () => void saveBrandKit() : undefined}
            onApplyBrandKit={session.isPro ? () => void applyBrandKit() : undefined}
            presets={presets}
            onSavePreset={session.isPro ? () => void savePreset() : undefined}
            onApplyPreset={(p) => {
              update((s) => ({ ...s, header: p.header, footer: p.footer }));
              toast.success(`Applied ${p.name}`);
            }}
          />
        </aside>
      </div>

      {dragging && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-cobalt/10 backdrop-blur-[1px]">
          <div className="rounded-xl border-2 border-dashed border-cobalt bg-white px-8 py-6 text-center shadow-xl">
            <FileUp className="mx-auto mb-2 size-6 text-cobalt" />
            <p className="font-medium">Drop your Markdown file</p>
            <p className="text-sm text-muted-foreground">.md, .markdown, or .txt · up to 2 MB · read locally</p>
          </div>
        </div>
      )}

      <Dialog open={!!pendingTemplate} onOpenChange={(o) => !o && setPendingTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch to {getTemplate(pendingTemplate)?.name}?</DialogTitle>
            <DialogDescription>
              The template&apos;s typography, layout, header, footer, and page numbers will be applied. Your logo is kept.
            </DialogDescription>
          </DialogHeader>
          <label className="flex items-start gap-2.5 rounded-lg border bg-paper p-3 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 size-4 accent-cobalt"
              checked={replaceContent}
              onChange={(e) => setReplaceContent(e.target.checked)}
            />
            <span>
              Also replace my content with the template&apos;s starter content
              {replaceContent && markdown.trim() && (
                <span className="mt-1 block text-[12px] text-destructive">Your current Markdown will be replaced (you can undo).</span>
              )}
            </span>
          </label>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPendingTemplate(null)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={applyTemplate}>
              Apply template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
