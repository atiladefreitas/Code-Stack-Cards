"use client"

import { Eye } from "lucide-react"

import { Button } from "@/components/ui/button"

interface RevealButtonProps {
  onReveal: () => void
  label?: string
}

export function RevealButton({
  onReveal,
  label = "Reveal answer",
}: RevealButtonProps) {
  return (
    <Button
      variant="outline"
      size="lg"
      onClick={onReveal}
      className="h-11 w-full rounded-xl text-sm"
    >
      <Eye className="size-4" />
      {label}
    </Button>
  )
}
