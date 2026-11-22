export const MAX_MARKDOWN_BYTES = 2 * 1024 * 1024;
export const MAX_LOGO_BYTES = 500 * 1024;
export const MAX_PDF_BYTES = 20 * 1024 * 1024;

const MD_EXT = /\.(md|markdown|txt)$/i;
const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

export type FileCheck = { ok: true } | { ok: false; error: string };

export function checkMarkdownFile(file: { name: string; size: number }): FileCheck {
  if (!MD_EXT.test(file.name)) return { ok: false, error: "Only .md, .markdown, or .txt files are supported." };
  if (file.size > MAX_MARKDOWN_BYTES) return { ok: false, error: "That file is larger than 2 MB." };
  return { ok: true };
}

export function checkLogoFile(file: { type: string; size: number }): FileCheck {
  if (!LOGO_TYPES.includes(file.type)) return { ok: false, error: "Logo must be a PNG, JPEG, WebP, or SVG image." };
  if (file.size > MAX_LOGO_BYTES) return { ok: false, error: "Logo must be 500 KB or smaller." };
  return { ok: true };
}

export function checkPdfFile(file: { name: string; size: number; type: string }): FileCheck {
  if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") return { ok: false, error: "Please choose a PDF file." };
  if (file.size > MAX_PDF_BYTES) return { ok: false, error: "PDFs must be 20 MB or smaller." };
  return { ok: true };
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ""));
    r.onerror = () => reject(r.error ?? new Error("Could not read file"));
    r.readAsText(file);
  });
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ""));
    r.onerror = () => reject(r.error ?? new Error("Could not read file"));
    r.readAsDataURL(file);
  });
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
