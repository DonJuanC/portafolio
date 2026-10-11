"use client";

import { useLanguage } from "@/context/LanguageContext";
import styles from "./LanguageSwitcher.module.css";

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className={`${styles.switcher} ${className ?? ""}`}
      role="group"
      aria-label="Selección de idioma / Language selection"
    >
      <button
        type="button"
        className={`${styles.btn} ${locale === "es" ? styles.active : ""}`}
        onClick={() => setLocale("es")}
        aria-pressed={locale === "es"}
        title="Cambiar a español"
      >
        ES
      </button>
      <span className={styles.divider} aria-hidden="true">
        /
      </span>
      <button
        type="button"
        className={`${styles.btn} ${locale === "en" ? styles.active : ""}`}
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        title="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
