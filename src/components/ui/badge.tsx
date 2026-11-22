import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        accent: "border-transparent bg-cobalt-soft text-accent-foreground",
        outline: "text-foreground",
        pro: "border-[#d9c48f] bg-[#fbf3dc] text-[#7a5a12]",
        success: "border-transparent bg-[#e5f4ec] text-success",
        warning: "border-transparent bg-[#fdf0e1] text-warning",
        destructive: "border-transparent bg-[#fbe8e6] text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}
