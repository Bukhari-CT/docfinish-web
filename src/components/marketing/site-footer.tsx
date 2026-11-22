import Link from "next/link";
import { Logo } from "@/components/logo";
import { TOOL_LINKS } from "@/lib/site";
import { TEMPLATES } from "@/lib/templates";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-navy text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo inverse />
          <p className="max-w-xs text-sm leading-relaxed text-white/60">
            Turn AI Markdown into client-ready PDFs and Google Docs. Rendering and preview happen in your browser.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold tracking-wider text-white/50 uppercase">Tools</h3>
          <ul className="space-y-2 text-sm">
            {TOOL_LINKS.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="hover:text-white">
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold tracking-wider text-white/50 uppercase">Templates</h3>
          <ul className="space-y-2 text-sm">
            {TEMPLATES.map((t) => (
              <li key={t.id}>
                <Link href={`/templates/${t.id}`} className="hover:text-white">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold tracking-wider text-white/50 uppercase">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link href="/resources" className="hover:text-white">Resources</Link></li>
            <li><Link href="/resources/claude-output-to-pdf" className="hover:text-white">Claude output to PDF</Link></li>
            <li><Link href="/resources/add-headers-and-footers" className="hover:text-white">Headers &amp; footers guide</Link></li>
            <li><Link href="/login" className="hover:text-white">Log in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© 2026 DocFinish. All rights reserved.</span>
          <span>No watermarks. Ever.</span>
        </div>
      </div>
    </footer>
  );
}
