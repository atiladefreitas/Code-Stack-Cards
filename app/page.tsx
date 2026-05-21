import questions from "@/questions/questions.json"

import type { Deck } from "@/lib/types"
import { DeckView } from "@/components/flashcard/deck"

export default function Page() {
  const deck = questions as Deck
  return <DeckView deck={deck} />
}
