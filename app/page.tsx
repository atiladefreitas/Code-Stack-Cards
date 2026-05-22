"use client"

import questionsEn from "@/questions/questions.json"
import questionsPt from "@/questions/questions.pt.json"

import type { Deck } from "@/lib/types"
import { DeckView } from "@/components/flashcard/deck"
import { useLanguage } from "@/components/language-provider"

export default function Page() {
  const { lang } = useLanguage()
  const deck = (lang === "pt" ? questionsPt : questionsEn) as Deck
  // Keying on lang forces DeckView to remount when switching languages so
  // per-card local state (selected option, textarea, etc.) is reset cleanly.
  return <DeckView key={lang} deck={deck} />
}
