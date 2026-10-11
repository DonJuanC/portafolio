"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./not-found.module.css";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <main className={styles.screen}>
      <div className={styles.box}>
        <p className={styles.line}>
          <span className={styles.prompt}>jcamilo@dev:~/cali$</span>cd /404
        </p>
        <p className={styles.error}>{t.notFound.routeNotFound}</p>
        <p className={styles.dim}>{t.notFound.error404}</p>
      </div>

      <Link href="/" className={styles.back}>
        <span aria-hidden="true">←</span> {t.notFound.backHome}
        <span className={styles.cmd} aria-hidden="true">
          cd ~
        </span>
      </Link>
    </main>
  );
}
