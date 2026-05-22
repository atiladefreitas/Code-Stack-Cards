export type Lang = "en" | "pt"

export const LANG_STORAGE_KEY = "stack-cards:lang:v1"

export interface Strings {
  headerCounter: (
    i: number,
    total: number,
    correct: number,
    wrong: number
  ) => string
  shuffle: string
  restart: string
  back: string
  next: string
  answerFirst: string
  answerFirstTooltip: string
  deckComplete: string
  deckCompleteSubtitle: (total: number) => string
  statCorrect: string
  statWrong: string
  statScore: string
  shuffleAndStudy: string
  resetProgress: string
  typeMultipleChoice: string
  typeTrueFalse: string
  typeShortAnswer: string
  typeExercise: string
  typeExplanation: string
  gotIt: string
  missed: string
  answerLabel: string
  whyLabel: string
  submit: string
  typeYourAnswer: string
  gotItWrong: string
  gotItRight: string
  revealAnswer: string
  revealSolution: string
  true: string
  false: string
  switchToPortuguese: string
  switchToEnglish: string
  languageLabel: string
}

export const i18nStrings: Record<Lang, Strings> = {
  en: {
    headerCounter: (i: number, total: number, correct: number, wrong: number) =>
      `${i} of ${total} · ${correct} correct · ${wrong} wrong`,
    shuffle: "Shuffle",
    restart: "Restart",
    back: "Back",
    next: "Next",
    answerFirst: "Answer first",
    answerFirstTooltip: "Answer the question first",
    deckComplete: "Deck complete",
    deckCompleteSubtitle: (total: number) =>
      `You went through all ${total} cards.`,
    statCorrect: "Correct",
    statWrong: "Wrong",
    statScore: "Score",
    shuffleAndStudy: "Shuffle & study again",
    resetProgress: "Reset progress",
    typeMultipleChoice: "Multiple choice",
    typeTrueFalse: "True / False",
    typeShortAnswer: "Short answer",
    typeExercise: "Exercise",
    typeExplanation: "Explanation",
    gotIt: "Got it",
    missed: "Missed",
    answerLabel: "Answer",
    whyLabel: "Why",
    submit: "Submit",
    typeYourAnswer: "Type your answer…",
    gotItWrong: "Got it wrong",
    gotItRight: "Got it right",
    revealAnswer: "Reveal answer",
    revealSolution: "Reveal solution",
    true: "True",
    false: "False",
    switchToPortuguese: "Mudar para Português",
    switchToEnglish: "Switch to English",
    languageLabel: "Language",
  },
  pt: {
    headerCounter: (i: number, total: number, correct: number, wrong: number) =>
      `${i} de ${total} · ${correct} corretas · ${wrong} erradas`,
    shuffle: "Embaralhar",
    restart: "Reiniciar",
    back: "Voltar",
    next: "Próximo",
    answerFirst: "Responda primeiro",
    answerFirstTooltip: "Responda a pergunta primeiro",
    deckComplete: "Deck concluído",
    deckCompleteSubtitle: (total: number) =>
      `Você passou por todos os ${total} cards.`,
    statCorrect: "Corretas",
    statWrong: "Erradas",
    statScore: "Pontuação",
    shuffleAndStudy: "Embaralhar & estudar de novo",
    resetProgress: "Resetar progresso",
    typeMultipleChoice: "Múltipla escolha",
    typeTrueFalse: "Verdadeiro / Falso",
    typeShortAnswer: "Resposta curta",
    typeExercise: "Exercício",
    typeExplanation: "Explicação",
    gotIt: "Acertei",
    missed: "Errei",
    answerLabel: "Resposta",
    whyLabel: "Por quê",
    submit: "Enviar",
    typeYourAnswer: "Digite sua resposta…",
    gotItWrong: "Errei",
    gotItRight: "Acertei",
    revealAnswer: "Revelar resposta",
    revealSolution: "Revelar solução",
    true: "Verdadeiro",
    false: "Falso",
    switchToPortuguese: "Mudar para Português",
    switchToEnglish: "Switch to English",
    languageLabel: "Idioma",
  },
}
