import type { CSSProperties } from "react";
import type { DocumentSettings } from "@/lib/api/types";
import { fontStack } from "@/lib/fonts";

const HEX = /^#[0-9a-fA-F]{6}$/;
const safeColor = (c: string, fallback: string) => (HEX.test(c) ? c : fallback);
const clamp = (v: number, min: number, max: number, d: number) => (Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : d);

/** CSS custom properties for the document renderer (page bodies and measuring container). */
export function documentStyleVars(settings: DocumentSettings, templateStyles: Record<string, string> = {}): CSSProperties {
  const vars: Record<string, string> = {
    "--df-font-body": fontStack(settings.fontFamily),
    "--df-font-heading": fontStack(settings.headingFontFamily),
    "--df-base-size": `${clamp(settings.baseFontSize, 9, 14, 11)}pt`,
    "--df-line-height": String(clamp(settings.lineHeight, 1.2, 2, 1.55)),
    "--df-text": safeColor(settings.textColor, "#14161a"),
    "--df-accent": safeColor(settings.accentColor, "#2448e0"),
    "--df-mt": `${settings.margins.top}mm`,
    "--df-mr": `${settings.margins.right}mm`,
    "--df-mb": `${settings.margins.bottom}mm`,
    "--df-ml": `${settings.margins.left}mm`,
  };
  for (const [k, v] of Object.entries(templateStyles)) {
    if (k.startsWith("--df-") && typeof v === "string" && !/[;{}<>]/.test(v)) vars[k] = v;
  }
  return vars as CSSProperties;
}
