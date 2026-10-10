"use client";

import styles from "./TerminalPromptHint.module.css";

export default function TerminalPromptHint() {
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
      ¿Prefieres tema claro o explorar? Abre la{" "}
      <button
        type="button"
        onClick={openTerminal}
        className={styles.linkBtn}
      >
        terminal
      </button>{" "}
      y escribe <code className={styles.code}>theme</code>.
    </p>
  );
}
