import Link from "next/link";
import Terminal from "@/components/Terminal";
import CopyEmailButton from "@/components/CopyEmailButton";
import TerminalPromptHint from "@/components/TerminalPromptHint";
import EasterEggHint from "@/components/EasterEggHint";
import { projects } from "@/content/projects";
import { statusLabel } from "@/lib/labels";
import { GITHUB, LINKEDIN } from "@/lib/links";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.screen}>
      <header className={styles.hero}>
        <p className={styles.signature}>jcamilo@dev:~/cali$</p>
        <h1 className={styles.title}>JCamilo Castellanos</h1>
        <p className={styles.role}>
          Full Stack Developer · Ingeniero industrial · Cali, Colombia
        </p>
        <p className={styles.lead}>
          Desarrollador Full Stack con mirada de ingeniero industrial. Aquí, un
          poco de mi mundo <EasterEggHint />.
        </p>
        <div className={styles.actions}>
          <a className={`${styles.btn} ${styles.btnPrimary}`} href="#proyectos">
            Ver proyectos
          </a>
          <a
            className={styles.btn}
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            className={styles.btn}
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <CopyEmailButton />
        </div>
        <TerminalPromptHint />
      </header>

      <section id="proyectos" aria-labelledby="proyectos-titulo">
        <h2 id="proyectos-titulo" className={styles.sectionTitle}>
          Proyectos
        </h2>
        <ul className={styles.grid}>
          {projects.map((p) => (
            <li key={p.slug} className={p.featured ? styles.wide : undefined}>
              <Link href={`/proyectos/${p.slug}`} className={styles.card}>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.badges}>
                  {p.featured && <span className={styles.badge}>★ destacado</span>}
                  <span
                    className={`${styles.badge} ${
                      p.status === "deployed" ? styles.badgeOn : ""
                    }`}
                  >
                    {statusLabel[p.status]}
                  </span>
                  {p.tag && <span className={styles.badge}>{p.tag}</span>}
                  {p.team && (
                    <span className={styles.badge}>equipo: {p.team}</span>
                  )}
                </span>
                <span className={styles.tagline}>{p.tagline}</span>
                <span className={styles.cta}>
                  Ver proyecto <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <details className={styles.extra} id="terminal">
        <summary>
          <span>¿Curioso? Abre la terminal</span>
          <span className={styles.summaryThemeTip}>
            (escribe <code>theme</code> para alternar modo claro/oscuro)
          </span>
        </summary>
        <Terminal />
      </details>
    </main>
  );
}
