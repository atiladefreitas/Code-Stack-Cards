"use client"

import { Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

interface RevealButtonProps {
  onReveal: () => void
  label?: string
}

export function RevealButton({ onReveal, label }: RevealButtonProps) {
  const { t } = useLanguage()
  const resolvedLabel = label ?? t.revealAnswer
  return (
    <Button
      variant="outline"
      size="lg"
      onClick={onReveal}
      className="h-11 w-full rounded-xl text-sm"
    >
      <Eye className="size-4" />
      {resolvedLabel}
    </Button>
  )
}
