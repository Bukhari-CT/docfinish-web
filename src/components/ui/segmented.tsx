"use client";
import { cn } from "@/lib/utils";

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  disabled,
  "aria-label": ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: React.ReactNode }>;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cn("inline-flex w-full rounded-md border border-input bg-muted/60 p-0.5", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          disabled={disabled}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 rounded-[5px] px-2 py-1 text-[12.5px] font-medium text-muted-foreground transition-colors disabled:opacity-50",
            value === o.value && "bg-white text-ink shadow-sm",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
