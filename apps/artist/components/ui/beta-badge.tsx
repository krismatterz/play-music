"use client";

import { cn } from "../../lib/utils";

interface BetaBadgeProps {
  className?: string;
}

export function BetaBadge({ className }: BetaBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        "bg-gradient-to-r from-amber-600 to-amber-400 text-white",
        "h-[20px] min-w-[38px] justify-center text-center",
        className,
      )}
    >
      Beta
    </span>
  );
}
