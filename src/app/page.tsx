"use client";

import Link from "next/link";
import Terminal from "@/components/Terminal";
import CopyEmailButton from "@/components/CopyEmailButton";
import TerminalPromptHint from "@/components/TerminalPromptHint";
import EasterEggHint from "@/components/EasterEggHint";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { statusLabels } from "@/lib/labels";
import { GITHUB, LINKEDIN } from "@/lib/links";
import styles from "./page.module.css";

export default function Home() {
  const { locale, projects, t } = useLanguage();
  const statusMap = statusLabels[locale];

  return (
    <main className={styles.screen}>
      <header className={styles.hero}>
        <div className={styles.heroTop}>
          <p className={styles.signature}>{t.hero.signature}</p>
          <LanguageSwitcher />
        </div>
        <h1 className={styles.title}>{t.hero.title}</h1>
        <p className={styles.role}>{t.hero.role}</p>
        <p className={styles.lead}>
          {t.hero.leadStart} <EasterEggHint />.
        </p>
        <div className={styles.actions}>
          <a className={`${styles.btn} ${styles.btnPrimary}`} href="#proyectos">
            {t.hero.actions.viewProjects}
          </a>
          <a
            className={styles.btn}
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.hero.actions.github}
          </a>
          <a
            className={styles.btn}
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.hero.actions.linkedin}
          </a>
          <CopyEmailButton />
        </div>
        <TerminalPromptHint />
      </header>

      <section id="proyectos" aria-labelledby="proyectos-titulo">
        <h2 id="proyectos-titulo" className={styles.sectionTitle}>
          {t.projects.title}
        </h2>
        <ul className={styles.grid}>
          {projects.map((p) => (
            <li key={p.slug} className={p.featured ? styles.wide : undefined}>
              <Link href={`/proyectos/${p.slug}`} className={styles.card}>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.badges}>
                  {p.featured && (
                    <span className={styles.badge}>{t.projects.featured}</span>
                  )}
                  <span
                    className={`${styles.badge} ${
                      p.status === "deployed" ? styles.badgeOn : ""
                    }`}
                  >
                    {statusMap[p.status]}
                  </span>
                  {p.tag && <span className={styles.badge}>{p.tag}</span>}
                  {p.team && (
                    <span className={styles.badge}>
                      {t.projects.team} {p.team}
                    </span>
                  )}
                </span>
                <span className={styles.tagline}>{p.tagline}</span>
                <span className={styles.cta}>
                  {t.projects.viewProject} <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <details className={styles.extra} id="terminal">
        <summary>
          <span>{t.terminal.summaryTitle}</span>
          <span className={styles.summaryThemeTip}>
            {locale === "en" ? (
              <>
                (type <code>theme</code> to toggle light/dark mode)
              </>
            ) : (
              <>
                (escribe <code>theme</code> para alternar modo claro/oscuro)
              </>
            )}
          </span>
        </summary>
        <Terminal />
      </details>
    </main>
  );
}
