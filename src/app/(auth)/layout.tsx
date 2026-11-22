import { Check } from "lucide-react";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">{children}</main>
        <p className="text-xs text-muted-foreground">© 2026 DocFinish · No watermarks, ever.</p>
      </div>
      <aside className="relative hidden overflow-hidden bg-navy p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:40px_40px]"
        />
        <div className="relative">
          <p className="font-display text-4xl leading-tight font-medium">From AI Markdown to a client-ready document.</p>
          <ul className="mt-8 space-y-3 text-white/75">
            {["Branded templates with real page breaks", "Headers, footers, and page numbers", "Exports that match the preview exactly"].map((x) => (
              <li key={x} className="flex items-center gap-2.5">
                <Check className="size-4 text-[#9fb2ff]" /> {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto w-full max-w-sm rotate-[-2deg] rounded-md bg-white p-8 text-ink shadow-2xl">
          <div className="h-3 w-1/2 rounded bg-navy" />
          <div className="mt-3 h-1.5 w-12 rounded bg-cobalt" />
          <div className="mt-6 space-y-2">
            {[100, 92, 96, 70].map((w, i) => (
              <div key={i} className="h-2 rounded bg-[#e6e2da]" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded border bg-[#e6e2da]">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={i < 3 ? "h-4 bg-navy" : "h-4 bg-white"} />
            ))}
          </div>
          <div className="mt-8 flex justify-between border-t pt-2 text-[9px] text-muted-foreground">
            <span>Northwind Studio · Proposal</span>
            <span>2 / 6</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
