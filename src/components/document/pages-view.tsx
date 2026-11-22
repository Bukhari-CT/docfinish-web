"use client";

import type { DocumentSettings } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { DocumentPage } from "./document-page";
import type { PaginatedDocument } from "./use-paginated-document";

/** Stack of page boxes. `zoom` scales layout (pages keep exact physical size internally). */
export function PagesView({
  doc,
  settings,
  templateId,
  zoom = 1,
  maxPages,
  className,
  pageClassName,
}: {
  doc: PaginatedDocument;
  settings: DocumentSettings;
  templateId: string;
  zoom?: number;
  maxPages?: number;
  className?: string;
  pageClassName?: string;
}) {
  const { pages, chromes, geometry, styleVars } = doc;
  const list = pages ? (maxPages ? pages.slice(0, maxPages) : pages) : null;

  return (
    <div className={cn("flex flex-col items-center gap-6", className)} style={{ zoom }}>
      {list === null ? (
        <div
          className={cn("df-page relative overflow-hidden bg-white", pageClassName)}
          style={{ width: `${geometry.widthMm}mm`, height: `${geometry.heightMm}mm` }}
          aria-busy="true"
          aria-label="Preparing preview"
        >
          <div className="absolute inset-[20mm] space-y-4">
            <div className="h-9 w-2/3 animate-shimmer rounded bg-[#efebe3]" />
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-3 animate-shimmer rounded bg-[#f3efe8]" style={{ width: `${70 + ((i * 37) % 30)}%` }} />
            ))}
          </div>
        </div>
      ) : (
        list.map((p, i) => (
          <DocumentPage
            key={i}
            html={p.html}
            isCover={p.isCover}
            chrome={chromes[i]}
            geometry={geometry}
            settings={settings}
            templateId={templateId}
            styleVars={styleVars}
            pageIndex={i}
            className={pageClassName}
          />
        ))
      )}
    </div>
  );
}
