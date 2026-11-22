"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/auth/session";
import { TOOL_LINKS } from "@/lib/site";

const NAV = [
  { href: "/templates", label: "Templates" },
  { href: "/resources", label: "Resources" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteHeader() {
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const authed = status === "authenticated";

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-ink/80 outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-ring/40">
              Tools <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 p-1.5">
              {TOOL_LINKS.map((t) => (
                <DropdownMenuItem key={t.href} asChild>
                  <Link href={t.href} className="flex flex-col items-start gap-0.5 py-2">
                    <span className="font-medium">{t.label}</span>
                    <span className="text-xs text-muted-foreground">{t.description}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild>
                <Link href="/tools" className="justify-center text-xs text-cobalt">
                  All tools →
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-md px-3 py-2 text-sm text-ink/80 hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          {authed ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/tools/markdown-to-pdf">Try it free</Link>
              </Button>
            </>
          )}
        </div>
        <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <div className="border-t bg-paper px-4 py-4 md:hidden">
          <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Tools</p>
          <div className="mb-4 grid gap-1">
            {TOOL_LINKS.map((t) => (
              <Link key={t.href} href={t.href} onClick={() => setOpen(false)} className="rounded-md px-2 py-2 text-sm hover:bg-muted">
                {t.label}
              </Link>
            ))}
          </div>
          <div className="grid gap-1 border-t pt-3">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-md px-2 py-2 text-sm hover:bg-muted">
                {n.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {authed ? (
              <Button asChild className="col-span-2">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
