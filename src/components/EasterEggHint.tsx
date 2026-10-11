"use client";

import { useState } from "react";
import styles from "./EasterEggHint.module.css";

export default function EasterEggHint() {
  const [showTooltip, setShowTooltip] = useState(false);

  function handleClick() {
    const details = document.getElementById("terminal") as HTMLDetailsElement | null;
    if (details) {
      details.open = true;
      details.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.dispatchEvent(new CustomEvent("focus-terminal"));
  }

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
        title="Abrir terminal (prueba 'face' o 'sudo')"
      >
        (y algunos easter eggs)
      </button>

      {showTooltip && (
        <span className={styles.tooltip} role="tooltip">
          terminal: prueba <code>face</code> o <code>sudo</code>
        </span>
      )}
    </span>
  );
}
