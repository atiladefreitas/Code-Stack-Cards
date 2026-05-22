"use client"

import { Languages } from "lucide-react"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"

/**
 * Floating language toggle in the bottom-right corner.
 *
 * Positioned above the sticky footer (~72px tall on this layout) so it never
 * occludes the Back/Next controls. Uses safe-area-inset-bottom to clear iOS
 * home indicators.
 */
export function LanguageToggle() {
  const { lang, toggleLang, t, hydrated } = useLanguage()

  // The next/current label flips so the button always advertises the
  // *destination* language, not the current one.
  const nextLabel = lang === "en" ? "PT" : "EN"
  const ariaLabel = lang === "en" ? t.switchToPortuguese : t.switchToEnglish

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={ariaLabel}
      title={ariaLabel}
      // Avoid rendering interactive content based on lang before hydration to
      // keep SSR markup deterministic. We still render the shell so layout
      // doesn't shift.
      suppressHydrationWarning
      className={cn(
        "fixed right-4 z-20 flex items-center gap-1.5 rounded-full",
        "border border-border bg-background/90 px-3 py-2 text-xs font-semibold",
        "shadow-lg shadow-black/5 backdrop-blur-md",
        "transition-all hover:bg-muted hover:shadow-black/10 active:scale-95",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      )}
      style={{
        // Clear the sticky footer (h-11 button + py-3 + safe-area).
        bottom: "calc(env(safe-area-inset-bottom) + 5rem)",
      }}
    >
      <Languages className="size-3.5" />
      <span className="tabular-nums">{hydrated ? nextLabel : "PT"}</span>
    </button>
  )
}
