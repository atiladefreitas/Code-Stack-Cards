"use client"

import * as React from "react"

import {
  LANG_STORAGE_KEY,
  type Lang,
  type Strings,
  i18nStrings,
} from "@/lib/i18n"

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  t: Strings
  hydrated: boolean
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("en")
  const [hydrated, setHydrated] = React.useState(false)

  // Hydrate from localStorage on first client render
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY)
      if (stored === "en" || stored === "pt") {
        setLangState(stored)
      }
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  // Reflect lang on <html lang="...">
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang
    }
  }, [lang])

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }, [])

  const toggleLang = React.useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === "en" ? "pt" : "en"
      try {
        localStorage.setItem(LANG_STORAGE_KEY, next)
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const value = React.useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggleLang,
      t: i18nStrings[lang],
      hydrated,
    }),
    [lang, setLang, toggleLang, hydrated]
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext)
  if (!ctx) {
    throw new Error("useLanguage must be used inside a LanguageProvider")
  }
  return ctx
}
