"use client";

import { ImagePlus, Lock, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Segmented } from "@/components/ui/segmented";
import { NativeSelect } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DocumentSettings, HeaderFooterSettings, HeaderPreset } from "@/lib/api/types";
import { DOC_FONT_KEYS, DOC_FONTS } from "@/lib/fonts";
import { TOKEN_HELP } from "@/lib/pagination/tokens";
import { TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { checkLogoFile, readFileAsDataUrl } from "@/lib/workspace/files";

export type SettingsUpdater = (fn: (s: DocumentSettings) => DocumentSettings) => void;

export interface SettingsPanelProps {
  settings: DocumentSettings;
  update: SettingsUpdater;
  templateId: string;
  onSelectTemplate: (id: string) => void;
  isPro: boolean;
  onProFeature: (feature: string) => void;
  /** Present when the user may save a brand kit / presets (authenticated). */
  onSaveBrandKit?: () => void;
  onApplyBrandKit?: () => void;
  presets?: HeaderPreset[];
  onSavePreset?: () => void;
  onApplyPreset?: (p: HeaderPreset) => void;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[12px] text-muted-foreground">{label}</Label>
      {children}
      {hint && <p className="text-[11px] leading-snug text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-[13px]">{label}</span>
      {children}
    </div>
  );
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="space-y-3 border-b border-border/70 px-4 py-4 last:border-0">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function ProLock({ isPro, onClick, label = "Pro" }: { isPro: boolean; onClick: () => void; label?: string }) {
  if (isPro) return null;
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center">
      <Badge variant="pro">
        <Lock /> {label}
      </Badge>
    </button>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  "aria-label": ariaLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  "aria-label"?: string;
}) {
  return (
    <div className="relative">
      <Input
        type="number"
        inputMode="decimal"
        aria-label={ariaLabel}
        value={Number.isFinite(value) ? value : ""}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (Number.isFinite(v)) onChange(v);
        }}
        onBlur={(e) => {
          const v = Number(e.target.value);
          onChange(Math.min(max, Math.max(min, Number.isFinite(v) ? v : min)));
        }}
        className="h-8 pr-8 tabular-nums"
      />
      {suffix && <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[11px] text-muted-foreground">{suffix}</span>}
    </div>
  );
}

function ColorInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        aria-label={label}
        value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="size-8 cursor-pointer rounded-md border border-input bg-white p-0.5"
      />
      <Input
        value={value}
        onChange={(e) => {
          const v = e.target.value.trim();
          if (/^#[0-9a-f]{0,6}$/i.test(v)) onChange(v);
        }}
        className="h-8 font-mono text-[12px] uppercase"
        aria-label={`${label} hex`}
      />
    </div>
  );
}

function BandEditor({
  band,
  onChange,
  name,
}: {
  band: HeaderFooterSettings;
  onChange: (b: HeaderFooterSettings) => void;
  name: string;
}) {
  return (
    <div className="space-y-3">
      <Row label={`Show ${name}`}>
        <Switch checked={band.enabled} onCheckedChange={(v) => onChange({ ...band, enabled: v })} aria-label={`Show ${name}`} />
      </Row>
      <div className={cn("space-y-2.5", !band.enabled && "pointer-events-none opacity-50")}>
        {(["left", "center", "right"] as const).map((slot) => (
          <Field key={slot} label={slot[0].toUpperCase() + slot.slice(1)}>
            <Input
              value={band[slot]}
              placeholder={slot === "left" ? "{title}" : slot === "right" ? "{company}" : ""}
              onChange={(e) => onChange({ ...band, [slot]: e.target.value.slice(0, 200) })}
              className="h-8 text-[13px]"
            />
          </Field>
        ))}
        <Row label="Show on first page">
          <Switch checked={band.showOnFirstPage} onCheckedChange={(v) => onChange({ ...band, showOnFirstPage: v })} aria-label={`Show ${name} on first page`} />
        </Row>
      </div>
    </div>
  );
}

export function SettingsPanel(p: SettingsPanelProps) {
  const { settings: s, update, isPro } = p;
  const logoInput = useRef<HTMLInputElement>(null);
  const set = <K extends keyof DocumentSettings>(key: K, value: DocumentSettings[K]) => update((prev) => ({ ...prev, [key]: value }));

  async function onLogo(file: File | undefined) {
    if (!file) return;
    const check = checkLogoFile(file);
    if (!check.ok) {
      toast.error(check.error);
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      update((prev) => ({ ...prev, logo: { ...prev.logo, dataUrl } }));
      if (!isPro) toast.message("Logo added to this preview", { description: "Saving logos and brand kits is part of Pro." });
    } catch {
      toast.error("Couldn't read that image.");
    }
  }

  return (
    <Tabs defaultValue="template" className="flex h-full min-h-0 flex-col">
      <div className="border-b px-3 pt-3 pb-2.5">
        <TabsList className="grid w-full grid-cols-5 bg-muted/80">
          <TabsTrigger value="template" className="px-1 text-[12px]">Template</TabsTrigger>
          <TabsTrigger value="layout" className="px-1 text-[12px]">Layout</TabsTrigger>
          <TabsTrigger value="hf" className="px-1 text-[12px]" title="Header & Footer">H&amp;F</TabsTrigger>
          <TabsTrigger value="numbers" className="px-1 text-[12px]" title="Page numbers">Pages</TabsTrigger>
          <TabsTrigger value="brand" className="px-1 text-[12px]">Brand</TabsTrigger>
        </TabsList>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* ---------------- Template ---------------- */}
        <TabsContent value="template">
          <Section title="Templates">
            <div className="grid grid-cols-2 gap-2.5">
              {TEMPLATES.map((t) => {
                const active = t.id === p.templateId;
                const locked = t.tier === "premium" && !isPro;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => p.onSelectTemplate(t.id)}
                    className={cn(
                      "group overflow-hidden rounded-lg border bg-white text-left transition-all hover:border-ink/30",
                      active && "border-cobalt ring-2 ring-cobalt/20",
                    )}
                    aria-pressed={active}
                  >
                    <div className="relative aspect-[300/424] bg-[#f3efe8]">
                      <Image src={t.previewImage} alt="" fill sizes="140px" className="object-cover object-top" unoptimized />
                      {locked && (
                        <span className="absolute top-1.5 right-1.5">
                          <Badge variant="pro">
                            <Lock /> Pro
                          </Badge>
                        </span>
                      )}
                    </div>
                    <div className="px-2 py-1.5 text-[12px] leading-tight font-medium">{t.name}</div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Switching applies the template&apos;s typography and layout. You&apos;ll be asked before any content is replaced.
            </p>
          </Section>
          <Section title="Typography">
            <Field label="Body font">
              <NativeSelect value={s.fontFamily} onChange={(e) => set("fontFamily", e.target.value)}>
                {DOC_FONT_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {DOC_FONTS[k].label}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Heading font">
              <NativeSelect value={s.headingFontFamily} onChange={(e) => set("headingFontFamily", e.target.value)}>
                {DOC_FONT_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {DOC_FONTS[k].label}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="Base size">
                <NumberInput value={s.baseFontSize} onChange={(v) => set("baseFontSize", v)} min={9} max={14} step={0.5} suffix="pt" aria-label="Base font size" />
              </Field>
              <Field label="Line height">
                <NumberInput value={s.lineHeight} onChange={(v) => set("lineHeight", v)} min={1.2} max={2} step={0.05} aria-label="Line height" />
              </Field>
            </div>
          </Section>
        </TabsContent>

        {/* ---------------- Layout ---------------- */}
        <TabsContent value="layout">
          <Section title="Page">
            <Field label="Page size">
              <Segmented
                aria-label="Page size"
                value={s.pageSize}
                onChange={(v) => set("pageSize", v)}
                options={[
                  { value: "A4", label: "A4" },
                  { value: "Letter", label: "Letter" },
                ]}
              />
            </Field>
            <Field label="Orientation">
              <Segmented
                aria-label="Orientation"
                value={s.orientation}
                onChange={(v) => set("orientation", v)}
                options={[
                  { value: "portrait", label: "Portrait" },
                  { value: "landscape", label: "Landscape" },
                ]}
              />
            </Field>
          </Section>
          <Section title="Margins (mm)">
            <div className="grid grid-cols-2 gap-2.5">
              {(["top", "bottom", "left", "right"] as const).map((k) => (
                <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
                  <NumberInput
                    value={s.margins[k]}
                    onChange={(v) => update((prev) => ({ ...prev, margins: { ...prev.margins, [k]: v } }))}
                    min={5}
                    max={50}
                    suffix="mm"
                    aria-label={`${k} margin`}
                  />
                </Field>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { l: "Narrow", v: 12 },
                { l: "Normal", v: 20 },
                { l: "Wide", v: 30 },
              ].map((preset) => (
                <Button
                  key={preset.l}
                  size="sm"
                  variant="outline"
                  className="h-7 text-[12px]"
                  onClick={() => update((prev) => ({ ...prev, margins: { top: preset.v, right: preset.v, bottom: preset.v, left: preset.v } }))}
                >
                  {preset.l}
                </Button>
              ))}
            </div>
          </Section>
          <Section title="Cover">
            <Row label="First page as title page">
              <Switch checked={s.titlePage} onCheckedChange={(v) => set("titlePage", v)} aria-label="Title page" />
            </Row>
            <p className="text-[11px] text-muted-foreground">Everything before the first <code>##</code> heading becomes the cover.</p>
          </Section>
        </TabsContent>

        {/* ---------------- Header & footer ---------------- */}
        <TabsContent value="hf">
          <Section title="Header">
            <BandEditor name="header" band={s.header} onChange={(b) => set("header", b)} />
          </Section>
          <Section title="Footer">
            <BandEditor name="footer" band={s.footer} onChange={(b) => set("footer", b)} />
          </Section>
          <Section title="Tokens">
            <div className="flex flex-wrap gap-1.5">
              {TOKEN_HELP.map((t) => (
                <button
                  key={t.token}
                  type="button"
                  title={t.label}
                  onClick={() => {
                    void navigator.clipboard?.writeText(t.token).then(() => toast.success(`Copied ${t.token}`));
                  }}
                  className="rounded border bg-paper px-1.5 py-0.5 font-mono text-[11px] hover:border-cobalt"
                >
                  {t.token}
                </button>
              ))}
            </div>
            <Field label="Company name" hint="Fills the {company} token.">
              <Input value={s.companyName} onChange={(e) => set("companyName", e.target.value.slice(0, 120))} className="h-8" />
            </Field>
          </Section>
          <Section title="Presets" action={<ProLock isPro={isPro} onClick={() => p.onProFeature("Header and footer presets")} />}>
            {isPro ? (
              <div className="space-y-2">
                {(p.presets ?? []).length === 0 && <p className="text-[12px] text-muted-foreground">No presets yet.</p>}
                {(p.presets ?? []).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => p.onApplyPreset?.(preset)}
                    className="flex w-full items-center justify-between rounded-md border bg-white px-2.5 py-1.5 text-left text-[13px] hover:border-cobalt"
                  >
                    {preset.name}
                    <span className="text-[11px] text-muted-foreground">Apply</span>
                  </button>
                ))}
                <Button size="sm" variant="outline" className="w-full" onClick={p.onSavePreset} disabled={!p.onSavePreset}>
                  <Save /> Save current as preset
                </Button>
              </div>
            ) : (
              <p className="text-[12px] text-muted-foreground">Save header and footer combinations and reuse them across documents.</p>
            )}
          </Section>
        </TabsContent>

        {/* ---------------- Page numbers ---------------- */}
        <TabsContent value="numbers">
          <Section title="Page numbers">
            <Row label="Show page numbers">
              <Switch
                checked={s.pageNumbers.enabled}
                onCheckedChange={(v) => update((prev) => ({ ...prev, pageNumbers: { ...prev.pageNumbers, enabled: v } }))}
                aria-label="Show page numbers"
              />
            </Row>
            <div className={cn("space-y-3", !s.pageNumbers.enabled && "pointer-events-none opacity-50")}>
              <Field label="Placement">
                <Segmented
                  aria-label="Placement"
                  value={s.pageNumbers.placement}
                  onChange={(v) => update((prev) => ({ ...prev, pageNumbers: { ...prev.pageNumbers, placement: v } }))}
                  options={[
                    { value: "header", label: "Header" },
                    { value: "footer", label: "Footer" },
                  ]}
                />
              </Field>
              <Field label="Alignment">
                <Segmented
                  aria-label="Alignment"
                  value={s.pageNumbers.align}
                  onChange={(v) => update((prev) => ({ ...prev, pageNumbers: { ...prev.pageNumbers, align: v } }))}
                  options={[
                    { value: "left", label: "Left" },
                    { value: "center", label: "Center" },
                    { value: "right", label: "Right" },
                  ]}
                />
              </Field>
              <Field label="Format">
                <NativeSelect
                  value={s.pageNumbers.format}
                  onChange={(e) =>
                    update((prev) => ({ ...prev, pageNumbers: { ...prev.pageNumbers, format: e.target.value as DocumentSettings["pageNumbers"]["format"] } }))
                  }
                >
                  <option value="n">3</option>
                  <option value="page-n">Page 3</option>
                  <option value="n-of-total">3 / 12</option>
                </NativeSelect>
              </Field>
              <div className="grid grid-cols-2 gap-2.5">
                <Field label="Start at">
                  <NumberInput
                    value={s.pageNumbers.startAt}
                    onChange={(v) => update((prev) => ({ ...prev, pageNumbers: { ...prev.pageNumbers, startAt: Math.round(v) } }))}
                    min={0}
                    max={999}
                    aria-label="Start page number at"
                  />
                </Field>
              </div>
              <Row label="Show on first page">
                <Switch
                  checked={s.pageNumbers.showOnFirstPage}
                  onCheckedChange={(v) => update((prev) => ({ ...prev, pageNumbers: { ...prev.pageNumbers, showOnFirstPage: v } }))}
                  aria-label="Show page number on first page"
                />
              </Row>
            </div>
          </Section>
        </TabsContent>

        {/* ---------------- Brand ---------------- */}
        <TabsContent value="brand">
          {!isPro && (
            <div className="mx-4 mt-4 rounded-lg border border-[#e8d9ad] bg-[#fdf8ea] px-3 py-2.5 text-[12px] leading-snug text-[#6b4f12]">
              Preview your branding for free. <button className="font-semibold underline" onClick={() => p.onProFeature("Saving brand kits")}>Pro</button> saves logos, colors, and fonts as a reusable brand kit.
            </div>
          )}
          <Section title="Logo">
            <input
              ref={logoInput}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={(e) => {
                void onLogo(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            {s.logo.dataUrl ? (
              <div className="flex items-center gap-3 rounded-lg border bg-white p-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element -- user-provided data URL */}
                <img src={s.logo.dataUrl} alt="Logo preview" className="h-10 max-w-[120px] object-contain" />
                <div className="ml-auto flex gap-1">
                  <Button size="icon-sm" variant="ghost" onClick={() => logoInput.current?.click()} aria-label="Replace logo">
                    <ImagePlus />
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => update((prev) => ({ ...prev, logo: { ...prev.logo, dataUrl: null } }))} aria-label="Remove logo">
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => logoInput.current?.click()}
                className="flex w-full flex-col items-center gap-1 rounded-lg border border-dashed bg-white px-3 py-5 text-center text-[12px] text-muted-foreground hover:border-cobalt hover:text-ink"
              >
                <ImagePlus className="size-5" />
                Upload logo
                <span className="text-[11px]">PNG, JPEG, WebP, or SVG · max 500 KB</span>
              </button>
            )}
            <Field label="Placement">
              <NativeSelect
                value={s.logo.placement}
                onChange={(e) => update((prev) => ({ ...prev, logo: { ...prev.logo, placement: e.target.value as DocumentSettings["logo"]["placement"] } }))}
              >
                <option value="header-left">Header, left</option>
                <option value="header-right">Header, right</option>
                <option value="title">Top of first page</option>
              </NativeSelect>
            </Field>
            <Field label="Logo height">
              <NumberInput
                value={s.logo.heightMm}
                onChange={(v) => update((prev) => ({ ...prev, logo: { ...prev.logo, heightMm: v } }))}
                min={6}
                max={30}
                suffix="mm"
                aria-label="Logo height"
              />
            </Field>
          </Section>
          <Section title="Colors">
            <Field label="Accent">
              <ColorInput label="Accent color" value={s.accentColor} onChange={(v) => set("accentColor", v)} />
            </Field>
            <Field label="Text">
              <ColorInput label="Text color" value={s.textColor} onChange={(v) => set("textColor", v)} />
            </Field>
          </Section>
          <Section title="Identity">
            <Field label="Company name">
              <Input value={s.companyName} onChange={(e) => set("companyName", e.target.value.slice(0, 120))} className="h-8" />
            </Field>
            <Row label="Title page">
              <Switch checked={s.titlePage} onCheckedChange={(v) => set("titlePage", v)} aria-label="Title page" />
            </Row>
          </Section>
          <Section title="Brand kit" action={<ProLock isPro={isPro} onClick={() => p.onProFeature("Brand kits")} />}>
            <div className="grid gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => (isPro && p.onSaveBrandKit ? p.onSaveBrandKit() : p.onProFeature("Saving brand kits"))}
              >
                <Save /> Save as brand kit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => (isPro && p.onApplyBrandKit ? p.onApplyBrandKit() : p.onProFeature("Brand kits"))}
              >
                Apply saved brand kit
              </Button>
            </div>
          </Section>
        </TabsContent>
      </div>
    </Tabs>
  );
}
