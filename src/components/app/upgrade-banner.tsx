import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UpgradeBanner({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[#d9c48f] bg-[#fdf9ee] p-5">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fbf3dc] text-[#7a5a12]">
        <Sparkles className="size-5" />
      </div>
      <div className="min-w-[200px] flex-1">
        <p className="font-medium text-ink">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button asChild variant="accent">
        <Link href="/billing">See Pro</Link>
      </Button>
    </div>
  );
}
