"use client";
import { Separator as S } from "radix-ui";
import { cn } from "@/lib/utils";

export function Separator({ className, orientation = "horizontal", decorative = true, ...props }: React.ComponentProps<typeof S.Root>) {
  return (
    <S.Root
      decorative={decorative}
      orientation={orientation}
      className={cn("shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px", className)}
      {...props}
    />
  );
}
