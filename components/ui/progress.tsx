"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentProps<"div"> {
  value?: number
}

function Progress({ value = 0, className, ...props }: ProgressProps) {
  const safe = Math.max(0, Math.min(100, value))
  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safe}
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
        style={{ width: `${safe}%` }}
      />
    </div>
  )
}

export { Progress }
