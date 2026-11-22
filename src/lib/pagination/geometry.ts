import type { DocumentSettings, PageSize } from "@/lib/api/types";

/** CSS pixels per millimetre (96 dpi). */
export const PX_PER_MM = 96 / 25.4;

export const PAGE_SIZES_MM: Record<PageSize, { width: number; height: number }> = {
  A4: { width: 210, height: 297 },
  Letter: { width: 215.9, height: 279.4 },
};

/** Height reserved for a header or footer band (text row) and the gap to the body. */
export const BAND_TEXT_MM = 6;
export const BAND_GAP_MM = 5;

export interface PageGeometry {
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  margins: DocumentSettings["margins"];
  headerBandMm: number;
  footerBandMm: number;
  contentWidthPx: number;
  contentHeightPx: number;
}

export const mmToPx = (mm: number) => mm * PX_PER_MM;

export function clampMargin(v: number): number {
  if (!Number.isFinite(v)) return 20;
  return Math.min(50, Math.max(5, v));
}

type GeometryInput = Pick<
  DocumentSettings,
  "pageSize" | "orientation" | "margins" | "header" | "footer" | "pageNumbers" | "logo"
>;

/** Whether a header band is reserved (any page may show header text, page number or logo). */
export function hasHeaderBand(s: GeometryInput): boolean {
  const logoInHeader = !!s.logo.dataUrl && s.logo.placement !== "title";
  return s.header.enabled || (s.pageNumbers.enabled && s.pageNumbers.placement === "header") || logoInHeader;
}

export function hasFooterBand(s: GeometryInput): boolean {
  return s.footer.enabled || (s.pageNumbers.enabled && s.pageNumbers.placement === "footer");
}

export function computeGeometry(s: GeometryInput): PageGeometry {
  const base = PAGE_SIZES_MM[s.pageSize] ?? PAGE_SIZES_MM.A4;
  const landscape = s.orientation === "landscape";
  const widthMm = landscape ? base.height : base.width;
  const heightMm = landscape ? base.width : base.height;
  const margins = {
    top: clampMargin(s.margins.top),
    right: clampMargin(s.margins.right),
    bottom: clampMargin(s.margins.bottom),
    left: clampMargin(s.margins.left),
  };
  const logoInHeader = !!s.logo.dataUrl && s.logo.placement !== "title";
  const headerTextMm = logoInHeader ? Math.max(BAND_TEXT_MM, s.logo.heightMm) : BAND_TEXT_MM;
  const headerBandMm = hasHeaderBand(s) ? headerTextMm + BAND_GAP_MM : 0;
  const footerBandMm = hasFooterBand(s) ? BAND_TEXT_MM + BAND_GAP_MM : 0;
  const contentWidthMm = widthMm - margins.left - margins.right;
  const contentHeightMm = heightMm - margins.top - margins.bottom - headerBandMm - footerBandMm;
  return {
    widthMm,
    heightMm,
    widthPx: mmToPx(widthMm),
    heightPx: mmToPx(heightMm),
    margins,
    headerBandMm,
    footerBandMm,
    contentWidthPx: Math.floor(mmToPx(Math.max(40, contentWidthMm))),
    contentHeightPx: Math.floor(mmToPx(Math.max(40, contentHeightMm))),
  };
}
