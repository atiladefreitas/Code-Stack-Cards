# Stack Cards

Bite-sized flashcards for code internals — pinned to your home screen.

A minimal, mobile-first flashcard app that mixes **explanations**, **multiple choice**, **true/false**, **short answer**, and **code exercises** so you actually learn the material instead of just recognizing it.

Built to be installed as a PWA and tapped open in 2 seconds while you're waiting for coffee.

---

## Why

Most "learn X" sites are bloated. This is the opposite:

- One screen, one card at a time.
- Five question types, color-coded so you know what you're getting before you read it.
- Self-graded — you decide whether you got it. No streaks, no XP, no nags.
- Works offline once cached, persists progress in `localStorage`, looks native on a phone.

---

## Features

- **Five card types**, each with its own UI affordances
  - `explanation` — read-only context
  - `multiple_choice` — tap-to-select, auto-graded with "why" explanation
  - `true_false` — two big tap targets, instant feedback
  - `short_answer` — write your own, then reveal + self-grade
  - `exercise` — prompt + optional code block / scenarios + reveal solution
- **Color-coded type badges** so you can triage at a glance
- **Correct / wrong tinting** — the whole card surface goes green or red after you grade
- **Swipe navigation** (left = next, right = back) plus on-screen buttons
- **Shuffle** the deck or **reset** progress from the header
- **Progress bar** + tally of `seen / correct / wrong`
- **Completion screen** with a final score
- **Persistence** in `localStorage` — close the tab, come back tomorrow, same place
- **Light / dark mode** (system-aware, press `d` on desktop to toggle)
- **PWA-ready** — installs to the home screen, runs standalone, respects safe-area insets

---

## Quick start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. That's the whole onboarding.

To install on your phone: open the deployed URL → browser menu → **Add to Home Screen**. With the manifest in place it launches standalone, full-bleed, no browser chrome.

### Scripts

```bash
pnpm dev        # next dev (turbopack)
pnpm build      # production build
pnpm start      # serve the production build
pnpm lint       # eslint
pnpm typecheck  # tsc --noEmit
pnpm format     # prettier
```

---

## Writing your own deck

All content lives in [`questions/questions.json`](questions/questions.json). The shape is:

```jsonc
{
  "deck": "React Internals — Flashcards",
  "topics": ["Reconciliation & Diffing", "useMemo, useCallback, React.memo"],
  "cards": [
    /* … */
  ],
}
```

### Card schemas

Every card needs `id`, `type`, and `topic`. The remaining fields depend on `type`:

```jsonc
// explanation — no interaction, just read it.
{
  "id": 1,
  "type": "explanation",
  "topic": "Reconciliation & Diffing",
  "title": "What is the virtual DOM?",
  "content": "React keeps an in-memory snapshot of the UI…"
}

// multiple_choice — answer must match one of the options exactly.
{
  "id": 2,
  "type": "multiple_choice",
  "topic": "Reconciliation & Diffing",
  "question": "What is the time complexity of React's diffing algorithm?",
  "options": ["O(n³)", "O(n²)", "O(n)", "O(log n)"],
  "answer": "O(n)",
  "explanation": "Optional — shown after the user submits."
}

// true_false
{
  "id": 4,
  "type": "true_false",
  "topic": "Reconciliation & Diffing",
  "question": "React reuses the existing DOM node when the element type changes.",
  "answer": false,
  "explanation": "Optional."
}

// short_answer — user types, then reveals and self-grades.
{
  "id": 8,
  "type": "short_answer",
  "topic": "Reconciliation & Diffing",
  "question": "Why does wrapping a component in a different type on every render hurt performance?",
  "answer": "React sees a new element type each render, triggering a full subtree unmount…"
}

// exercise — prompt + optional `code` block + optional `scenarios` list.
{
  "id": 5,
  "type": "exercise",
  "topic": "Reconciliation & Diffing",
  "title": "Spot the bug",
  "prompt": "This list renders incorrectly after reordering. Why?",
  "code": "items.map((item, index) => (\n  <ListItem key={index} data={item} />\n))",
  "answer": "Using array index as key ties identity to position…"
}
```

The TypeScript types live in [`lib/types.ts`](lib/types.ts) if you want autocomplete.

---

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS 4** + `tw-animate-css` for transitions
- **shadcn/ui** primitives (`Button`, `Card`, `Badge`, `Progress`, `Textarea`) on top of `@base-ui/react`
- **lucide-react** icons
- **next-themes** for light/dark
- **TypeScript** strict mode, ESLint, Prettier

No client-side data layer, no state machine library, no animation lib — just `useState` + Tailwind animation utilities. The whole deck UI is one client component (`components/flashcard/deck.tsx`) backed by a switch over card type (`components/flashcard/card-body.tsx`).

---

## Project layout

```
app/
  layout.tsx          # metadata, fonts, PWA manifest hookup
  page.tsx            # imports questions.json, hands deck to <DeckView />
  globals.css         # Tailwind + shadcn tokens (light + dark)

components/
  flashcard/
    deck.tsx          # main deck UI: progress, nav, persistence, completion
    card-body.tsx     # per-type card rendering
    reveal-button.tsx
  ui/                 # shadcn primitives
  theme-provider.tsx  # next-themes + `d` hotkey

lib/
  types.ts            # Card / Deck types
  utils.ts            # cn()

questions/
  questions.json      # your deck

public/
  manifest.webmanifest
  icon.svg
```

---

## Persistence model

State is stored under `stack-cards:state:v1`:

```ts
{
  index: number          // current card position in the order
  order: number[]        // shuffled card-id sequence
  seen: number[]         // every card you've revealed / navigated past
  correct: number[]      // self-graded "got it right"
  wrong: number[]        // self-graded "got it wrong"
}
```

Hit **reset** in the header to clear it. Hit **shuffle** to randomize `order` and jump to card 1.

---

## Roadmap ideas

- Spaced-repetition ordering (SM-2 lite) using the wrong/correct sets
- Multiple decks + a deck picker
- Tag-based filtering ("only show me reconciliation cards")
- Export progress as JSON
- Keyboard shortcuts on desktop (`→` next, `←` back, `space` reveal)

PRs welcome. Stay small.

---

## License

MIT.
