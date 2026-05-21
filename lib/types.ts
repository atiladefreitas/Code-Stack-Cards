export type CardType =
  | "explanation"
  | "multiple_choice"
  | "true_false"
  | "short_answer"
  | "exercise"

export interface BaseCard {
  id: number
  topic: string
  type: CardType
}

export interface ExplanationCard extends BaseCard {
  type: "explanation"
  title: string
  content: string
}

export interface MultipleChoiceCard extends BaseCard {
  type: "multiple_choice"
  question: string
  options: string[]
  answer: string
  explanation?: string
}

export interface TrueFalseCard extends BaseCard {
  type: "true_false"
  question: string
  answer: boolean
  explanation?: string
}

export interface ShortAnswerCard extends BaseCard {
  type: "short_answer"
  question: string
  answer: string
}

export interface ExerciseCard extends BaseCard {
  type: "exercise"
  title: string
  prompt: string
  code?: string
  scenarios?: string[]
  answer: string
}

export type Card =
  | ExplanationCard
  | MultipleChoiceCard
  | TrueFalseCard
  | ShortAnswerCard
  | ExerciseCard

export interface Deck {
  deck: string
  topics: string[]
  cards: Card[]
}
