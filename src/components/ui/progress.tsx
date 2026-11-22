"use client";
import { Progress as P } from "radix-ui";
import { cn } from "@/lib/utils";

export function Progress({ className, value, indicatorClassName, ...props }: React.ComponentProps<typeof P.Root> & { indicatorClassName?: string }) {
  return (
    <P.Root data-slot="progress" className={cn("relative h-2 w-full overflow-hidden rounded-full bg-[#ebe6dc]", className)} value={value} {...props}>
      <P.Indicator
        className={cn("h-full w-full flex-1 bg-cobalt transition-transform duration-500", indicatorClassName)}
        style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value ?? 0))}%)` }}
      />
    </P.Root>
  );
}
