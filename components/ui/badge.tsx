import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wider whitespace-nowrap uppercase transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        muted: "border-transparent bg-muted text-muted-foreground",
        success:
          "border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        destructive: "border-transparent bg-destructive/10 text-destructive",
        // Card-type accents — tinted backgrounds with a subtle ring.
        explanation:
          "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
        multipleChoice:
          "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
        trueFalse:
          "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        shortAnswer:
          "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
        exercise:
          "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
