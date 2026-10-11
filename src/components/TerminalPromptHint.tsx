"use client";

import { useLanguage } from "@/context/LanguageContext";
import styles from "./TerminalPromptHint.module.css";

export default function TerminalPromptHint() {
  const { t } = useLanguage();
  const hint = t.hero.terminalPromptHint;

  function openTerminal() {
    const details = document.getElementById("terminal") as HTMLDetailsElement | null;
    if (details) {
      details.open = true;
      details.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.dispatchEvent(new CustomEvent("focus-terminal"));
  }

  return (
    <p className={styles.hint}>
      {hint.question}{" "}
      <button
        type="button"
        onClick={openTerminal}
        className={styles.linkBtn}
      >
        {hint.terminalWord}
      </button>{" "}
      {hint.typeWord} <code className={styles.code}>{hint.command}</code>.
    </p>
  );
}
