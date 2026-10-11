"use client";

import { useState } from "react";
import { getContactEmail, EMAIL_DISPLAY_OBFUSCATED } from "@/lib/links";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./CopyEmailButton.module.css";

interface CopyEmailButtonProps {
  className?: string;
}

export default function CopyEmailButton({ className }: CopyEmailButtonProps) {
  const { locale, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      const email = getContactEmail();
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Si el portapapeles no está disponible (ej. permisos), abre mailto
      window.location.href = `mailto:${getContactEmail()}`;
    }
  }

  const isEn = locale === "en";

  return (
    <button
      type="button"
      className={`${styles.btn} ${className ?? ""} ${copied ? styles.copied : ""}`}
      onClick={handleCopy}
      title={
        isEn
          ? `Copy ${EMAIL_DISPLAY_OBFUSCATED} to clipboard`
          : `Copiar ${EMAIL_DISPLAY_OBFUSCATED} al portapapeles`
      }
      aria-label={
        isEn
          ? "Copy contact email to clipboard"
          : "Copiar correo de contacto al portapapeles"
      }
    >
      {copied ? t.hero.actions.copiedEmail : t.hero.actions.talkByEmail}
    </button>
  );
}
