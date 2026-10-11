"use client";

import { useLanguage } from "@/context/LanguageContext";
import styles from "./SpotifyTriggerButton.module.css";

interface SpotifyTriggerButtonProps {
  className?: string;
}

export default function SpotifyTriggerButton({ className }: SpotifyTriggerButtonProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  function handleClick() {
    const details = document.getElementById("terminal") as HTMLDetailsElement | null;
    if (details) {
      details.open = true;
      details.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.dispatchEvent(
      new CustomEvent("run-terminal-command", { detail: "spotify" })
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${styles.btn} ${className ?? ""}`}
      title={
        isEn
          ? "Open DonJuanCelektor's curated music player in terminal"
          : "Abrir la curaduría musical de DonJuanCelektor en la terminal"
      }
      aria-label={
        isEn
          ? "Open DonJuanCelektor Spotify curation"
          : "Abrir curaduría musical de DonJuanCelektor"
      }
    >
      <span className={styles.icon} aria-hidden="true">
        🎧
      </span>
      <span>{isEn ? "Curated Music" : "Curaduría Sonora"}</span>
    </button>
  );
}
