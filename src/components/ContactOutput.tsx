"use client";

import { useState } from "react";
import {
  GITHUB,
  LINKEDIN,
  getContactEmail,
  getMailtoUrl,
  EMAIL_DISPLAY_OBFUSCATED,
} from "@/lib/links";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Terminal.module.css";

export default function ContactOutput() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(getContactEmail());
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = getMailtoUrl();
    }
  }

  return (
    <div className={styles.card}>
      <p>
        <span className={styles.dim}>github   </span>
        <a href={GITHUB} target="_blank" rel="noopener noreferrer">
          {GITHUB} ↗
        </a>
      </p>
      <p>
        <span className={styles.dim}>linkedin </span>
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
          {LINKEDIN} ↗
        </a>
      </p>
      <p className={styles.contactEmailRow}>
        <span className={styles.dim}>email    </span>
        <span>{EMAIL_DISPLAY_OBFUSCATED}</span>
        <button
          type="button"
          onClick={handleCopy}
          className={styles.miniBtn}
          title={t.contact.copyTitle}
        >
          {copied ? t.contact.copiedBtn : t.contact.copyBtn}
        </button>
        <a
          href={getMailtoUrl()}
          className={styles.miniLink}
          title={t.contact.mailtoTitle}
        >
          {t.contact.mailtoBtn}
        </a>
      </p>
    </div>
  );
}
