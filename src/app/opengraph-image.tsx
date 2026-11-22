import { ImageResponse } from "next/og";

export const alt = "DocFinish — From AI Markdown to a client-ready document";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F7F4EE", padding: 80, position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 10, background: "#2448E0" }} />
        <div style={{ display: "flex", flexDirection: "column", width: 700 }}>
          <div style={{ fontSize: 34, color: "#0F1B2D", fontWeight: 600 }}>DocFinish</div>
          <div style={{ fontSize: 66, color: "#14161A", marginTop: 70, lineHeight: 1.1, fontFamily: "serif" }}>
            From AI Markdown to a client-ready document.
          </div>
          <div style={{ fontSize: 26, color: "#5D6270", marginTop: 30 }}>Branded PDFs and Google Docs with headers, footers, and page numbers.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", position: "absolute", right: 90, top: 120, width: 250, height: 350, background: "#fff", border: "1px solid #E3DDD2", borderRadius: 6, padding: 24, transform: "rotate(4deg)" }}>
          <div style={{ width: 150, height: 16, background: "#0F1B2D", borderRadius: 3 }} />
          <div style={{ width: 60, height: 5, background: "#2448E0", marginTop: 12 }} />
          {[200, 186, 196, 170].map((w, i) => (
            <div key={i} style={{ width: w, height: 6, background: "#E3DDD2", borderRadius: 3, marginTop: 12 }} />
          ))}
          <div style={{ width: 200, height: 16, background: "#0F1B2D", marginTop: 20 }} />
          <div style={{ width: 200, height: 56, background: "#F5F3EE" }} />
        </div>
      </div>
    ),
    size,
  );
}
