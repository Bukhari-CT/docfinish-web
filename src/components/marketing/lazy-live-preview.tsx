"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LiveTemplatePreview } from "@/components/document/live-template-preview";

/** Shows the hand-made SVG thumbnail until the card scrolls into view, then the live render. */
export function LazyLivePreview({ templateId, previewImage, alt }: { templateId: string; previewImage: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative aspect-[300/424] w-full overflow-hidden">
      {visible ? (
        <LiveTemplatePreview templateId={templateId} />
      ) : (
        <Image src={previewImage} alt={alt} fill sizes="320px" className="object-cover" unoptimized />
      )}
    </div>
  );
}
