/** Feature-gate matrix, mirrored from the "Plan limits summary" in docs/API.md. */
export const PLAN_MATRIX: Array<{ feature: string; free: string | boolean; pro: string | boolean }> = [
  { feature: "Preview without login", free: true, pro: true },
  { feature: "PDF exports", free: "3 / month (login required)", pro: "Unlimited" },
  { feature: "Projects", free: "1", pro: "Unlimited + version history" },
  { feature: "Templates", free: "Basic", pro: "Basic + premium" },
  { feature: "Header & footer text", free: true, pro: "✓ + reusable presets" },
  { feature: "Logo, colors & fonts saved", free: "Preview only", pro: true },
  { feature: "Brand kit", free: false, pro: true },
  { feature: "Google Docs export", free: false, pro: true },
  { feature: "PDF → Markdown", free: false, pro: true },
  { feature: "Watermark", free: "Never", pro: "Never" },
];
