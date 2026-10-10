"use client";

import { useState } from "react";
import { getContactEmail, EMAIL_DISPLAY_OBFUSCATED } from "@/lib/links";
import styles from "./CopyEmailButton.module.css";

interface CopyEmailButtonProps {
  className?: string;
}

export default function CopyEmailButton({ className }: CopyEmailButtonProps) {
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

  return (
    <button
      type="button"
      className={`${styles.btn} ${className ?? ""} ${copied ? styles.copied : ""}`}
      onClick={handleCopy}
      title={`Copiar ${EMAIL_DISPLAY_OBFUSCATED} al portapapeles`}
      aria-label="Copiar correo de contacto al portapapeles"
    >
      {copied ? "✓ Correo copiado" : "Hablemos por correo"}
    </button>
  );
}
