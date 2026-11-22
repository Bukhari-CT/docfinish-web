"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeader, ErrorState } from "@/components/app/page-header";
import { UpgradeBanner } from "@/components/app/upgrade-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { api, errorMessage, isApiError } from "@/lib/api/client";
import type { BrandKitInput } from "@/lib/api/types";
import { useSession } from "@/lib/auth/session";
import { DOC_FONTS, fontStack } from "@/lib/fonts";

const LOGO_MAX_BYTES = 360 * 1024; // base64 inflates ~4/3; API caps the data URL at 500 KB.
const EMPTY: BrandKitInput = {
  name: "My brand",
  companyName: "",
  logoDataUrl: null,
  primaryColor: "#0f1b2d",
  accentColor: "#2448e0",
  textColor: "#14161a",
  headingFont: "source-serif",
  bodyFont: "inter",
  headerPresets: [],
  defaultPageSize: "A4",
  defaultMargins: { top: 22, right: 20, bottom: 22, left: 20 },
};

function ColorField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <input id={id} type="color" value={value} onChange={(e) => onChange(e.target.value)} className="size-9 cursor-pointer rounded-md border bg-white p-0.5" />
        <Input
          aria-label={`${label} hex`}
          value={value}
          onChange={(e) => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && onChange(e.target.value)}
          className="h-9 font-mono text-sm uppercase"
          maxLength={7}
        />
      </div>
    </div>
  );
}

export function BrandKitContainer() {
  const { isPro, status } = useSession();
  const q = useQuery({ queryKey: ["brand-kit"], queryFn: () => api.brandKit.get(), enabled: status === "authenticated" && isPro });

  if (!isPro) {
    return (
      <>
        <PageHeader title="Brand kit" description="Save your logo, colors, fonts, and header/footer presets once. Apply them to any document." />
        <UpgradeBanner title="Brand kits are part of DocFinish Pro" description="You can still preview any logo and colors in the editor on the free plan. Pro saves them and applies them everywhere." />
      </>
    );
  }
  if (q.isPending) return <Skeleton className="h-96" role="status" aria-label="Loading brand kit" />;
  if (q.isError) return <ErrorState message={errorMessage(q.error)} onRetry={() => void q.refetch()} />;

  const existing = q.data.brandKit;
  const initial: BrandKitInput = existing ? (({ updatedAt, ...rest }) => (void updatedAt, rest))(existing) : EMPTY;
  return <BrandKitForm initial={initial} />;
}

function BrandKitForm({ initial }: { initial: BrandKitInput }) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [kit, setKit] = useState<BrandKitInput>(initial);

  const save = useMutation({
    mutationFn: () => api.brandKit.put({ ...kit, name: kit.name.trim() || "My brand" }),
    onSuccess: (res) => {
      qc.setQueryData(["brand-kit"], res);
      toast.success("Brand kit saved", { description: "Apply it from any document's settings panel." });
    },
    onError: (e) => toast.error(isApiError(e) && e.isPlanRequired ? "Brand kits are part of DocFinish Pro" : "Couldn't save brand kit", { description: errorMessage(e) }),
  });

  const set = <K extends keyof BrandKitInput>(k: K, v: BrandKitInput[K]) => setKit((s) => ({ ...s, [k]: v }));

  function onLogo(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp|svg\+xml)$/.test(file.type)) return void toast.error("Use a PNG, JPEG, WebP, or SVG logo.");
    if (file.size > LOGO_MAX_BYTES) return void toast.error("Logo is too large", { description: "Keep it under about 350 KB." });
    const reader = new FileReader();
    reader.onload = () => set("logoDataUrl", String(reader.result));
    reader.onerror = () => toast.error("Couldn't read that image.");
    reader.readAsDataURL(file);
  }

  return (
    <>
      <PageHeader
        title="Brand kit"
        description="Applied to new documents and available from every document's settings panel."
        actions={
          <Button variant="accent" onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="animate-spin" />} Save brand kit
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Identity</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="kit-name">Kit name</Label>
                  <Input id="kit-name" value={kit.name} maxLength={100} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kit-company">Company name</Label>
                  <Input id="kit-company" value={kit.companyName} maxLength={200} placeholder="Northwind Studio" onChange={(e) => set("companyName", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-32 items-center justify-center overflow-hidden rounded-md border bg-white">
                    {kit.logoDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- user-supplied data URL
                      <img src={kit.logoDataUrl} alt="Logo preview" className="max-h-12 max-w-[7rem] object-contain" />
                    ) : (
                      <span className="text-xs text-muted-foreground">No logo</span>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={(e) => { onLogo(e.target.files?.[0]); e.target.value = ""; }} />
                  <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}><ImagePlus /> {kit.logoDataUrl ? "Replace" : "Upload logo"}</Button>
                  {kit.logoDataUrl && <Button variant="ghost" size="sm" onClick={() => set("logoDataUrl", null)}>Remove</Button>}
                </div>
                <p className="text-xs text-muted-foreground">PNG, JPEG, WebP, or SVG up to ~350 KB.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Colors &amp; type</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <ColorField id="c-primary" label="Primary" value={kit.primaryColor} onChange={(v) => set("primaryColor", v)} />
                <ColorField id="c-accent" label="Accent" value={kit.accentColor} onChange={(v) => set("accentColor", v)} />
                <ColorField id="c-text" label="Text" value={kit.textColor} onChange={(v) => set("textColor", v)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="f-head">Heading font</Label>
                  <NativeSelect id="f-head" value={kit.headingFont} onChange={(e) => set("headingFont", e.target.value)}>{Object.entries(DOC_FONTS).map(([k, f]) => <option key={k} value={k}>{f.label}</option>)}</NativeSelect>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="f-body">Body font</Label>
                  <NativeSelect id="f-body" value={kit.bodyFont} onChange={(e) => set("bodyFont", e.target.value)}>{Object.entries(DOC_FONTS).map(([k, f]) => <option key={k} value={k}>{f.label}</option>)}</NativeSelect>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Page defaults</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2 sm:max-w-[200px]">
                <Label htmlFor="page-size">Page size</Label>
                <NativeSelect id="page-size" value={kit.defaultPageSize} onChange={(e) => set("defaultPageSize", e.target.value as "A4" | "Letter")}><option value="A4">A4</option><option value="Letter">US Letter</option></NativeSelect>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {(["top", "right", "bottom", "left"] as const).map((side) => (
                  <div key={side} className="space-y-2">
                    <Label htmlFor={`m-${side}`} className="capitalize">{side} margin (mm)</Label>
                    <Input id={`m-${side}`} type="number" min={5} max={60} value={kit.defaultMargins[side]} onChange={(e) => set("defaultMargins", { ...kit.defaultMargins, [side]: Math.min(60, Math.max(5, Number(e.target.value) || 0)) })} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Header &amp; footer presets</CardTitle>
              <CardDescription>Create presets from a document&apos;s settings panel (“Save preset”). Manage them here.</CardDescription>
            </CardHeader>
            <CardContent>
              {kit.headerPresets.length === 0 ? (
                <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No presets yet.</p>
              ) : (
                <ul className="divide-y rounded-lg border">
                  {kit.headerPresets.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{[p.header.left, p.header.center, p.header.right].filter(Boolean).join(" · ") || "No header text"}</p>
                      </div>
                      <Button variant="ghost" size="icon-sm" aria-label={`Delete preset ${p.name}`} onClick={() => set("headerPresets", kit.headerPresets.filter((x) => x.id !== p.id))}>
                        <Trash2 />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">Preview</p>
          <div className="aspect-[3/4] rounded-md border bg-white p-6 shadow-sm" style={{ color: kit.textColor, fontFamily: fontStack(kit.bodyFont) }}>
            <div className="flex items-center justify-between border-b pb-2 text-[9px] text-muted-foreground">
              {kit.logoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- user-supplied data URL
                <img src={kit.logoDataUrl} alt="" className="h-5 object-contain" />
              ) : (
                <span>{kit.companyName || "Your company"}</span>
              )}
              <span>Proposal</span>
            </div>
            <h3 className="mt-5 text-xl leading-tight" style={{ fontFamily: fontStack(kit.headingFont), color: kit.primaryColor }}>Project proposal</h3>
            <div className="mt-2 h-0.5 w-10" style={{ background: kit.accentColor }} />
            <div className="mt-4 space-y-1.5">
              {[100, 94, 98, 62].map((w, i) => <div key={i} className="h-1.5 rounded bg-black/10" style={{ width: `${w}%` }} />)}
            </div>
            <p className="mt-5 text-[11px] font-semibold" style={{ color: kit.accentColor, fontFamily: fontStack(kit.headingFont) }}>Scope of work</p>
          </div>
        </aside>
      </div>
    </>
  );
}
