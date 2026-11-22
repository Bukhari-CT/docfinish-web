import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={cn("size-7", className)}>
      <rect width="64" height="64" rx="14" fill="#0F1B2D" />
      <path d="M20 14h17l9 9v27H20z" fill="#FBF9F5" />
      <path d="M37 14v9h9" fill="#C9D4FB" />
      <rect x="25" y="30" width="16" height="2.6" rx="1.3" fill="#2448E0" />
      <rect x="25" y="36" width="13" height="2.6" rx="1.3" fill="#9AA3B5" />
      <rect x="25" y="42" width="15" height="2.6" rx="1.3" fill="#9AA3B5" />
    </svg>
  );
}

export function Logo({ className, href = "/", inverse }: { className?: string; href?: string; inverse?: boolean }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)} aria-label="DocFinish home">
      <LogoMark />
      <span className={cn("font-display text-[19px] font-medium tracking-tight", inverse ? "text-white" : "text-navy")}>DocFinish</span>
    </Link>
  );
}
