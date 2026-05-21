"use client"

import * as React from "react"
import { Check, X, Lightbulb } from "lucide-react"

import type {
  Card as CardType,
  ExerciseCard,
  ExplanationCard,
  MultipleChoiceCard,
  ShortAnswerCard,
  TrueFalseCard,
} from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RevealButton } from "@/components/flashcard/reveal-button"

export interface CardBodyProps {
  card: CardType
  revealed: boolean
  onReveal: () => void
  /** Mark answer correctness so the deck can score self-assessed cards */
  onSelfGrade?: (correct: boolean) => void
}

export function CardBody({
  card,
  revealed,
  onReveal,
  onSelfGrade,
}: CardBodyProps) {
  switch (card.type) {
    case "explanation":
      return <ExplanationBody card={card} />
    case "multiple_choice":
      return (
        <MultipleChoiceBody
          card={card}
          revealed={revealed}
          onReveal={onReveal}
          onGrade={onSelfGrade}
        />
      )
    case "true_false":
      return (
        <TrueFalseBody
          card={card}
          revealed={revealed}
          onReveal={onReveal}
          onGrade={onSelfGrade}
        />
      )
    case "short_answer":
      return (
        <ShortAnswerBody
          card={card}
          revealed={revealed}
          onReveal={onReveal}
          onGrade={onSelfGrade}
        />
      )
    case "exercise":
      return (
        <ExerciseBody
          card={card}
          revealed={revealed}
          onReveal={onReveal}
          onGrade={onSelfGrade}
        />
      )
  }
}

/* ---------------- shared bits ---------------- */

function AnswerReveal({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 animate-in rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 duration-300 fade-in slide-in-from-bottom-1">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
        <Lightbulb className="size-3" />
        Answer
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

function SelfGradeFooter({
  onGrade,
}: {
  onGrade?: (correct: boolean) => void
}) {
  if (!onGrade) return null
  return (
    <div className="mt-4 flex animate-in gap-2 duration-500 fade-in">
      <Button
        variant="outline"
        size="lg"
        onClick={() => onGrade(false)}
        className="h-11 flex-1 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10"
      >
        <X className="size-4" />
        Got it wrong
      </Button>
      <Button
        size="lg"
        onClick={() => onGrade(true)}
        className="h-11 flex-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-600/90"
      >
        <Check className="size-4" />
        Got it right
      </Button>
    </div>
  )
}

/* ---------------- explanation ---------------- */

function ExplanationBody({ card }: { card: ExplanationCard }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        {card.title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        {card.content}
      </p>
    </div>
  )
}

/* ---------------- multiple choice ---------------- */

function MultipleChoiceBody({
  card,
  revealed,
  onReveal,
  onGrade,
}: {
  card: MultipleChoiceCard
  revealed: boolean
  onReveal: () => void
  onGrade?: (correct: boolean) => void
}) {
  const [selected, setSelected] = React.useState<string | null>(null)

  function handlePick(option: string) {
    if (revealed) return
    setSelected(option)
  }

  function handleSubmit() {
    if (selected == null) return
    onReveal()
    onGrade?.(selected === card.answer)
  }

  return (
    <div>
      <h2 className="text-xl leading-snug font-semibold tracking-tight text-foreground">
        {card.question}
      </h2>
      <ul className="mt-5 flex flex-col gap-2">
        {card.options.map((option) => {
          const isSelected = selected === option
          const isCorrect = option === card.answer
          const showCorrect = revealed && isCorrect
          const showWrong = revealed && isSelected && !isCorrect
          return (
            <li key={option}>
              <button
                type="button"
                onClick={() => handlePick(option)}
                disabled={revealed}
                className={cn(
                  "group/option flex w-full items-start gap-3 rounded-xl border p-3.5 text-left text-sm transition-all",
                  "border-border bg-background active:scale-[0.99]",
                  !revealed && "hover:border-foreground/30 hover:bg-muted/40",
                  isSelected && !revealed && "border-foreground bg-muted",
                  showCorrect &&
                    "border-emerald-500/40 bg-emerald-500/10 text-foreground",
                  showWrong && "border-destructive/40 bg-destructive/10"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium",
                    "border-border bg-background text-muted-foreground",
                    isSelected &&
                      !revealed &&
                      "border-foreground bg-foreground text-background",
                    showCorrect &&
                      "border-emerald-500 bg-emerald-500 text-white",
                    showWrong &&
                      "text-destructive-foreground border-destructive bg-destructive"
                  )}
                >
                  {showCorrect ? (
                    <Check className="size-3" />
                  ) : showWrong ? (
                    <X className="size-3" />
                  ) : (
                    <span className="leading-none">
                      {String.fromCharCode(65 + card.options.indexOf(option))}
                    </span>
                  )}
                </span>
                <span className="leading-relaxed">{option}</span>
              </button>
            </li>
          )
        })}
      </ul>

      {!revealed ? (
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={selected == null}
          className="mt-5 h-11 w-full rounded-xl"
        >
          Submit
        </Button>
      ) : card.explanation ? (
        <div className="mt-4 animate-in rounded-xl border border-border/60 bg-muted/40 p-4 duration-300 fade-in slide-in-from-bottom-1">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            <Lightbulb className="size-3" />
            Why
          </div>
          <p className="text-sm leading-relaxed">{card.explanation}</p>
        </div>
      ) : null}
      {/* MC self-grades automatically — no manual buttons */}
      {revealed && !onGrade ? null : null}
    </div>
  )
}

/* ---------------- true / false ---------------- */

function TrueFalseBody({
  card,
  revealed,
  onReveal,
  onGrade,
}: {
  card: TrueFalseCard
  revealed: boolean
  onReveal: () => void
  onGrade?: (correct: boolean) => void
}) {
  const [picked, setPicked] = React.useState<boolean | null>(null)

  function pick(value: boolean) {
    if (revealed) return
    setPicked(value)
    onReveal()
    onGrade?.(value === card.answer)
  }

  return (
    <div>
      <h2 className="text-xl leading-snug font-semibold tracking-tight text-foreground">
        {card.question}
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {[true, false].map((value) => {
          const label = value ? "True" : "False"
          const isPicked = picked === value
          const isCorrect = value === card.answer
          const showCorrect = revealed && isCorrect
          const showWrong = revealed && isPicked && !isCorrect
          return (
            <button
              key={label}
              type="button"
              onClick={() => pick(value)}
              disabled={revealed}
              className={cn(
                "flex h-20 items-center justify-center rounded-xl border text-base font-medium transition-all active:scale-[0.98]",
                "border-border bg-background",
                !revealed && "hover:border-foreground/30 hover:bg-muted/40",
                showCorrect &&
                  "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                showWrong &&
                  "border-destructive/50 bg-destructive/10 text-destructive"
              )}
            >
              {label}
            </button>
          )
        })}
      </div>
      {revealed && card.explanation ? (
        <div className="mt-4 animate-in rounded-xl border border-border/60 bg-muted/40 p-4 duration-300 fade-in slide-in-from-bottom-1">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            <Lightbulb className="size-3" />
            Why
          </div>
          <p className="text-sm leading-relaxed">{card.explanation}</p>
        </div>
      ) : null}
    </div>
  )
}

/* ---------------- short answer ---------------- */

function ShortAnswerBody({
  card,
  revealed,
  onReveal,
  onGrade,
}: {
  card: ShortAnswerCard
  revealed: boolean
  onReveal: () => void
  onGrade?: (correct: boolean) => void
}) {
  const [value, setValue] = React.useState("")

  return (
    <div>
      <h2 className="text-xl leading-snug font-semibold tracking-tight text-foreground">
        {card.question}
      </h2>

      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your answer…"
        disabled={revealed}
        className="mt-4"
      />

      {!revealed ? (
        <RevealButton onReveal={onReveal} />
      ) : (
        <>
          <AnswerReveal>{card.answer}</AnswerReveal>
          <SelfGradeFooter onGrade={onGrade} />
        </>
      )}
    </div>
  )
}

/* ---------------- exercise ---------------- */

function ExerciseBody({
  card,
  revealed,
  onReveal,
  onGrade,
}: {
  card: ExerciseCard
  revealed: boolean
  onReveal: () => void
  onGrade?: (correct: boolean) => void
}) {
  return (
    <div>
      <h2 className="text-xl leading-snug font-semibold tracking-tight text-foreground">
        {card.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {card.prompt}
      </p>

      {card.code ? (
        <pre className="mt-4 overflow-x-auto rounded-xl border border-border/60 bg-muted/40 p-4 font-mono text-[12px] leading-relaxed">
          <code>{card.code}</code>
        </pre>
      ) : null}

      {card.scenarios && card.scenarios.length > 0 ? (
        <ol className="mt-4 flex flex-col gap-2">
          {card.scenarios.map((s, i) => (
            <li
              key={s}
              className="flex gap-3 rounded-xl border border-border/60 bg-muted/30 p-3 text-sm"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {`${i + 1}.`}
              </span>
              <span className="leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      ) : null}

      <div className="mt-5">
        {!revealed ? (
          <RevealButton onReveal={onReveal} label="Reveal solution" />
        ) : (
          <>
            <AnswerReveal>{card.answer}</AnswerReveal>
            <SelfGradeFooter onGrade={onGrade} />
          </>
        )}
      </div>
    </div>
  )
}
