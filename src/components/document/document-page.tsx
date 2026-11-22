import type { CSSProperties } from "react";
import type { DocumentSettings } from "@/lib/api/types";
import { BAND_GAP_MM, BAND_TEXT_MM, type PageGeometry } from "@/lib/pagination/geometry";
import type { BandSlots, PageChrome } from "@/lib/pagination/tokens";
import { cn } from "@/lib/utils";

export interface DocumentPageProps {
  html: string;
  isCover: boolean;
  chrome: PageChrome;
  geometry: PageGeometry;
  settings: DocumentSettings;
  templateId: string;
  styleVars: CSSProperties;
  pageIndex: number;
  className?: string;
}

function Band({
  kind,
  slots,
  logo,
  style,
}: {
  kind: "header" | "footer";
  slots: BandSlots;
  logo?: { src: string; heightMm: number; side: "left" | "right" } | null;
  style: CSSProperties;
}) {
  const img = logo ? <img src={logo.src} alt="" style={{ height: `${logo.heightMm}mm` }} /> : null;
  return (
    <div className={cn("df-page-band", `df-page-band--${kind}`)} style={style}>
      <div className="df-band-slot">
        {logo?.side === "left" && img}
        {slots.left && <span>{slots.left}</span>}
      </div>
      <div className="df-band-slot">{slots.center && <span>{slots.center}</span>}</div>
      <div className="df-band-slot">
        {slots.right && <span>{slots.right}</span>}
        {logo?.side === "right" && img}
      </div>
    </div>
  );
}

/** One physical page box. Pure/presentational: used for preview, print, and template previews. */
export function DocumentPage({ html, isCover, chrome, geometry: g, settings, templateId, styleVars, pageIndex, className }: DocumentPageProps) {
  const m = g.margins;
  const logoInHeader = !!settings.logo.dataUrl && settings.logo.placement !== "title" && !isCover;
  const headerSlots = chrome.header ?? (logoInHeader ? { left: "", center: "", right: "" } : null);
  const headerHeightMm = Math.max(0, g.headerBandMm - BAND_GAP_MM);

  return (
    <div
      className={cn("df-page", isCover && "df-page--cover", className)}
      data-df-template={templateId}
      data-page={pageIndex + 1}
      style={{ ...styleVars, width: `${g.widthMm}mm`, height: `${g.heightMm}mm` }}
    >
      {g.headerBandMm > 0 && headerSlots && (
        <Band
          kind="header"
          slots={headerSlots}
          logo={
            logoInHeader
              ? {
                  src: settings.logo.dataUrl as string,
                  heightMm: Math.min(settings.logo.heightMm, headerHeightMm),
                  side: settings.logo.placement === "header-right" ? "right" : "left",
                }
              : null
          }
          style={{ top: `${m.top}mm`, left: `${m.left}mm`, right: `${m.right}mm`, height: `${headerHeightMm}mm` }}
        />
      )}
      <div
        className="df-page-body df-doc"
        style={{
          top: `${m.top + g.headerBandMm}mm`,
          left: `${m.left}mm`,
          width: `${g.contentWidthPx}px`,
          height: `${g.contentHeightPx}px`,
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {g.footerBandMm > 0 && chrome.footer && (
        <Band
          kind="footer"
          slots={chrome.footer}
          style={{ bottom: `${m.bottom}mm`, left: `${m.left}mm`, right: `${m.right}mm`, height: `${BAND_TEXT_MM}mm` }}
        />
      )}
    </div>
  );
}
