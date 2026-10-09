import styles from "./page.module.css";
import { projects } from "@/content/projects";
import Link from "next/link";
import { statusLabel } from "@/lib/labels";
import Terminal from "@/components/Terminal";

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <main className={styles.screen}>
      <p className={styles.line}>
        <span className={styles.prompt}>jcamilo@dev:~/cali$</span>whoami
      </p>
      <h1 className={styles.title}>JCamilo Castellanos.</h1>
      <p className={styles.dim}>
        Full Stack Developer · Ingeniero Industrial · Cali, Colombia
      </p>

      <p className={styles.line}>
        <span className={styles.prompt}>jcamilo@dev:~/cali$</span>ls proyectos/
      </p>

      <ul className={styles.featured}>
        {featured.map((p) => (
          <li key={p.slug} className={styles.item}>
            <div className={styles.itemHead}>
              <span className={styles.star} aria-hidden="true">
                ★
              </span>
              <Link className={styles.name} href={`/proyectos/${p.slug}`}>
                {p.slug}/
              </Link>
              {p.tag && <span className={styles.tag}>[{p.tag}]</span>}
            </div>
            <p className={styles.tagline}>{p.tagline}</p>
            <p className={styles.meta}>
              <span className={p.status === "deployed" ? styles.statusOn : ""}>
                {statusLabel[p.status]}
              </span>
              {p.team && ` · equipo: ${p.team}`}
            </p>
          </li>
        ))}
      </ul>

      {rest.length > 0 && (
        <ul className={styles.compact}>
          {rest.map((p) => (
            <li key={p.slug} className={styles.row}>
              <span className={styles.rowName}>{p.slug}/</span>
              <span className={styles.rowTagline}>{p.tagline}</span>
              <span className={styles.rowStatus}>{statusLabel[p.status]}</span>
            </li>
          ))}
        </ul>
      )}
      <Terminal />
    </main>
  );
}
