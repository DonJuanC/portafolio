"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import { dictionaries, type Dictionary, type Locale } from "@/content/i18n";
import { getProjects } from "@/content/projects";
import type { Project } from "@/lib/types";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  projects: Project[];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("portfolio-lang-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("portfolio-lang-change", callback);
  };
}

function getSnapshot(): Locale {
  try {
    const stored = localStorage.getItem("portfolio_lang");
    if (stored === "en" || stored === "es") return stored;
  } catch {
    // LocalStorage no disponible
  }
  return "es";
}

function getServerSnapshot(): Locale {
  return "es";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(next: Locale) {
    try {
      localStorage.setItem("portfolio_lang", next);
      window.dispatchEvent(new Event("portfolio-lang-change"));
      document.documentElement.lang = next;
    } catch {
      // Sin almacenamiento
    }
  }

  const value = useMemo<LanguageContextValue>(() => {
    return {
      locale,
      setLocale,
      t: dictionaries[locale],
      projects: getProjects(locale),
    };
  }, [locale]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      locale: "es",
      setLocale: () => {},
      t: dictionaries.es,
      projects: getProjects("es"),
    };
  }
  return ctx;
}
