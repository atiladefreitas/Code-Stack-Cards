"use client"

import * as React from "react"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Shuffle,
  Sparkles,
  X,
} from "lucide-react"

import type { Deck } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CardBody } from "@/components/flashcard/card-body"

interface DeckViewProps {
  deck: Deck
}

const STORAGE_KEY = "stack-cards:state:v1"

type Direction = 1 | -1

interface PersistedState {
  index: number
  order: number[]
  seen: number[]
  correct: number[]
  wrong: number[]
}

function subscribeNoop() {
  return () => {}
}
function getHydratedSnapshot() {
  return true
}
function getServerHydratedSnapshot() {
  return false
}

function readPersisted(deck: Deck): {
  order: number[]
  index: number
  seen: number[]
  correct: number[]
  wrong: number[]
} {
  const fallback = {
    order: deck.cards.map((c) => c.id),
    index: 0,
    seen: [] as number[],
    correct: [] as number[],
    wrong: [] as number[],
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    const total = deck.cards.length
    const validOrder = Array.isArray(parsed.order)
      ? parsed.order.filter((id) => deck.cards.some((c) => c.id === id))
      : []
    const order = validOrder.length === total ? validOrder : fallback.order
    const index =
      typeof parsed.index === "number" &&
      parsed.index >= 0 &&
      parsed.index < total
        ? parsed.index
        : 0
    return {
      order,
      index,
      seen: Array.isArray(parsed.seen) ? parsed.seen : [],
      correct: Array.isArray(parsed.correct) ? parsed.correct : [],
      wrong: Array.isArray(parsed.wrong) ? parsed.wrong : [],
    }
  } catch {
    return fallback
  }
}

function typeLabel(t: string) {
  switch (t) {
    case "multiple_choice":
      return "Multiple choice"
    case "true_false":
      return "True / False"
    case "short_answer":
      return "Short answer"
    case "exercise":
      return "Exercise"
    case "explanation":
      return "Explanation"
    default:
      return t
  }
}

type TypeBadgeVariant =
  | "explanation"
  | "multipleChoice"
  | "trueFalse"
  | "shortAnswer"
  | "exercise"
  | "outline"

function typeBadgeVariant(t: string): TypeBadgeVariant {
  switch (t) {
    case "explanation":
      return "explanation"
    case "multiple_choice":
      return "multipleChoice"
    case "true_false":
      return "trueFalse"
    case "short_answer":
      return "shortAnswer"
    case "exercise":
      return "exercise"
    default:
      return "outline"
  }
}

export function DeckView({ deck }: DeckViewProps) {
  const total = deck.cards.length

  // Lazy initializers read localStorage on first client render only.
  // The page is rendered inside a "use client" component, but its parent is a
  // Server Component — so the initial server HTML uses the defaults. We avoid
  // a hydration mismatch by gating render on `hydrated` (set to true in a
  // one-shot effect).
  const [order, setOrder] = React.useState<number[]>(() => {
    if (typeof window === "undefined") return deck.cards.map((c) => c.id)
    return readPersisted(deck).order
  })
  const [index, setIndex] = React.useState(() => {
    if (typeof window === "undefined") return 0
    return readPersisted(deck).index
  })
  const [revealed, setRevealed] = React.useState(false)
  const [direction, setDirection] = React.useState<Direction>(1)
  const [seen, setSeen] = React.useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set<number>()
    return new Set(readPersisted(deck).seen)
  })
  const [correct, setCorrect] = React.useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set<number>()
    return new Set(readPersisted(deck).correct)
  })
  const [wrong, setWrong] = React.useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set<number>()
    return new Set(readPersisted(deck).wrong)
  })
  // True only after client mount. Drives whether persistence writes are safe
  // and avoids hydration mismatches when reading from localStorage.
  const hydrated = React.useSyncExternalStore(
    subscribeNoop,
    getHydratedSnapshot,
    getServerHydratedSnapshot
  )

  // Persist
  React.useEffect(() => {
    if (!hydrated) return
    const data: PersistedState = {
      index,
      order,
      seen: [...seen],
      correct: [...correct],
      wrong: [...wrong],
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // ignore quota errors
    }
  }, [hydrated, index, order, seen, correct, wrong])

  const currentId = order[index]
  const card = React.useMemo(
    () => deck.cards.find((c) => c.id === currentId) ?? deck.cards[0],
    [deck.cards, currentId]
  )

  // Explanation cards count as "seen" the moment the deck displays them;
  // derive that into a memoized superset rather than mutating state in an effect.
  const effectiveSeen = React.useMemo(() => {
    if (card.type !== "explanation") return seen
    if (seen.has(card.id)) return seen
    const next = new Set(seen)
    next.add(card.id)
    return next
  }, [card, seen])

  const progress = ((index + (revealed ? 1 : 0)) / total) * 100
  const completed = effectiveSeen.size >= total

  function markCurrentSeenIfNeeded() {
    if (card.type !== "explanation") return
    if (seen.has(card.id)) return
    setSeen((prev) => {
      if (prev.has(card.id)) return prev
      const next = new Set(prev)
      next.add(card.id)
      return next
    })
  }

  function goNext() {
    if (index >= total - 1) return
    markCurrentSeenIfNeeded()
    setDirection(1)
    setIndex((i) => i + 1)
    setRevealed(false)
  }

  function goPrev() {
    if (index <= 0) return
    markCurrentSeenIfNeeded()
    setDirection(-1)
    setIndex((i) => i - 1)
    setRevealed(false)
  }

  function handleReveal() {
    setRevealed(true)
    setSeen((prev) => {
      const next = new Set(prev)
      next.add(card.id)
      return next
    })
  }

  function handleGrade(isCorrect: boolean) {
    setSeen((prev) => {
      const next = new Set(prev)
      next.add(card.id)
      return next
    })
    if (isCorrect) {
      setCorrect((prev) => {
        const next = new Set(prev)
        next.add(card.id)
        return next
      })
      setWrong((prev) => {
        if (!prev.has(card.id)) return prev
        const next = new Set(prev)
        next.delete(card.id)
        return next
      })
    } else {
      setWrong((prev) => {
        const next = new Set(prev)
        next.add(card.id)
        return next
      })
      setCorrect((prev) => {
        if (!prev.has(card.id)) return prev
        const next = new Set(prev)
        next.delete(card.id)
        return next
      })
    }
  }

  function shuffle() {
    const ids = deck.cards.map((c) => c.id)
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[ids[i], ids[j]] = [ids[j], ids[i]]
    }
    setOrder(ids)
    setIndex(0)
    setRevealed(false)
    setDirection(1)
  }

  function resetAll() {
    setOrder(deck.cards.map((c) => c.id))
    setIndex(0)
    setRevealed(false)
    setSeen(new Set())
    setCorrect(new Set())
    setWrong(new Set())
    setDirection(1)
  }

  // Swipe gestures
  const touchRef = React.useRef<{ x: number; y: number } | null>(null)
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0]
    touchRef.current = { x: t.clientX, y: t.clientY }
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!touchRef.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchRef.current.x
    const dy = t.clientY - touchRef.current.y
    touchRef.current = null
    if (Math.abs(dx) < 60 || Math.abs(dy) > 80) return
    if (dx < 0) goNext()
    else goPrev()
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-md"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
            <Sparkles className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm leading-tight font-semibold">
              {deck.deck}
            </div>
            <div className="text-[11px] leading-tight text-muted-foreground">
              {index + 1} of {total} · {correct.size} correct · {wrong.size}{" "}
              wrong
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Shuffle"
            onClick={shuffle}
          >
            <Shuffle className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Restart"
            onClick={resetAll}
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>
        <div className="mx-auto w-full max-w-2xl px-4 pb-3">
          <Progress value={progress} />
        </div>
      </header>

      {/* Card */}
      <main
        className="flex flex-1 items-start justify-center px-4 py-5"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="w-full max-w-2xl">
          {completed ? (
            <CompletedView
              total={total}
              correct={correct.size}
              wrong={wrong.size}
              onRestart={resetAll}
              onShuffle={shuffle}
            />
          ) : (
            <div
              key={card.id}
              className={cn(
                "animate-in duration-300 fade-in",
                direction === 1
                  ? "slide-in-from-right-4"
                  : "slide-in-from-left-4"
              )}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant={typeBadgeVariant(card.type)}>
                  {typeLabel(card.type)}
                </Badge>
                <Badge variant="muted">{card.topic}</Badge>
                {correct.has(card.id) ? (
                  <Badge variant="success">
                    <CheckCircle2 className="size-3" />
                    Got it
                  </Badge>
                ) : null}
                {wrong.has(card.id) ? (
                  <Badge variant="destructive">
                    <X className="size-3" />
                    Missed
                  </Badge>
                ) : null}
              </div>

              <div
                className={cn(
                  "rounded-2xl border p-5 shadow-sm transition-colors duration-300",
                  correct.has(card.id)
                    ? "border-emerald-500/40 bg-emerald-500/[0.06] dark:bg-emerald-500/[0.08]"
                    : wrong.has(card.id)
                      ? "border-destructive/40 bg-destructive/[0.06] dark:bg-destructive/[0.10]"
                      : "border-border bg-card"
                )}
              >
                <CardBody
                  key={card.id}
                  card={card}
                  revealed={revealed}
                  onReveal={handleReveal}
                  onSelfGrade={
                    card.type === "explanation" ? undefined : handleGrade
                  }
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer nav */}
      {!completed ? (
        <footer
          className="sticky bottom-0 z-10 border-t border-border/50 bg-background/80 backdrop-blur-md"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3">
            <Button
              variant="outline"
              size="lg"
              onClick={goPrev}
              disabled={index === 0}
              className="h-11 flex-1 rounded-xl"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <Button
              size="lg"
              onClick={goNext}
              disabled={index >= total - 1}
              className="h-11 flex-1 rounded-xl"
            >
              Next
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </footer>
      ) : null}
    </div>
  )
}

function CompletedView({
  total,
  correct,
  wrong,
  onRestart,
  onShuffle,
}: {
  total: number
  correct: number
  wrong: number
  onRestart: () => void
  onShuffle: () => void
}) {
  const pct =
    total === 0 ? 0 : Math.round((correct / Math.max(1, correct + wrong)) * 100)
  return (
    <div className="flex animate-in flex-col items-center text-center duration-500 fade-in slide-in-from-bottom-2">
      <div className="mt-8 flex size-16 items-center justify-center rounded-2xl bg-foreground text-background">
        <CheckCircle2 className="size-8" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight">
        Deck complete
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        You went through all {total} cards.
      </p>

      <div className="mt-6 grid w-full grid-cols-3 gap-3">
        <Stat label="Correct" value={correct} accent="emerald" />
        <Stat label="Wrong" value={wrong} accent="red" />
        <Stat label="Score" value={`${pct}%`} accent="muted" />
      </div>

      <div className="mt-6 flex w-full flex-col gap-2">
        <Button
          size="lg"
          onClick={onShuffle}
          className="h-11 w-full rounded-xl"
        >
          <Shuffle className="size-4" />
          Shuffle & study again
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onRestart}
          className="h-11 w-full rounded-xl"
        >
          <RotateCcw className="size-4" />
          Reset progress
        </Button>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: number | string
  accent: "emerald" | "red" | "muted"
}) {
  const accentClass =
    accent === "emerald"
      ? "text-emerald-600 dark:text-emerald-400"
      : accent === "red"
        ? "text-destructive"
        : "text-foreground"
  return (
    <div className="flex flex-col items-center rounded-xl border border-border bg-card p-3">
      <span className={cn("text-2xl font-semibold tabular-nums", accentClass)}>
        {value}
      </span>
      <span className="mt-0.5 text-[11px] tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  )
}
