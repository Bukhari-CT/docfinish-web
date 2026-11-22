/**
 * Document font keys (used in DocumentSettings.fontFamily / headingFontFamily)
 * mapped to CSS font stacks. The CSS variables are defined by next/font in
 * src/app/fonts.ts and attached to <html>.
 */
export const DOC_FONTS = {
  "source-serif": { label: "Source Serif", stack: "var(--font-source-serif), Georgia, serif" },
  "ibm-plex-serif": { label: "IBM Plex Serif", stack: "var(--font-ibm-plex-serif), Georgia, serif" },
  lora: { label: "Lora", stack: "var(--font-lora), Georgia, serif" },
  inter: { label: "Inter", stack: "var(--font-inter), system-ui, sans-serif" },
  "ibm-plex-sans": { label: "IBM Plex Sans", stack: "var(--font-ibm-plex-sans), system-ui, sans-serif" },
  "jetbrains-mono": { label: "JetBrains Mono", stack: "var(--font-jetbrains-mono), ui-monospace, monospace" },
} as const;

export type DocFontKey = keyof typeof DOC_FONTS;

export const DOC_FONT_KEYS = Object.keys(DOC_FONTS) as DocFontKey[];

export function fontStack(key: string): string {
  return (DOC_FONTS as Record<string, { stack: string }>)[key]?.stack ?? DOC_FONTS.inter.stack;
}
