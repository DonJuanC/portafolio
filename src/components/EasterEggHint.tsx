"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./EasterEggHint.module.css";

export default function EasterEggHint() {
  const { locale, t } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);

  function handleClick() {
    const details = document.getElementById("terminal") as HTMLDetailsElement | null;
    if (details) {
      details.open = true;
      details.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.dispatchEvent(new CustomEvent("focus-terminal"));
  }

  const isEn = locale === "en";

  return (
    <span
      className={styles.wrapper}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        type="button"
        onClick={handleClick}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={styles.trigger}
        title={
          isEn
            ? "Open terminal (try 'spotify', 'face' or 'sudo')"
            : "Abrir terminal (prueba 'spotify', 'face' o 'sudo')"
        }
      >
        {t.hero.easterEggTrigger}
      </button>

      {showTooltip && (
        <span className={styles.tooltip} role="tooltip">
          {isEn ? (
            <>
              terminal: try <code>spotify</code>, <code>face</code> or{" "}
              <code>sudo</code>
            </>
          ) : (
            <>
              terminal: prueba <code>spotify</code>, <code>face</code> o{" "}
              <code>sudo</code>
            </>
          )}
        </span>
      )}
    </span>
  );
}
