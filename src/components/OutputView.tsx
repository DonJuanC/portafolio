import { projects } from "@/content/projects";
import { statusLabel } from "@/lib/labels";
import type { Output } from "@/lib/types";
import FlowView from "./FlowView";
import styles from "./Terminal.module.css";
import Link from "next/link";
import AsciiFace from "./AsciiFace";
import ContactOutput from "./ContactOutput";
import ProjectPreview from "./ProjectPreview";

const findProject = (slug: string) => projects.find((p) => p.slug === slug);

export default function OutputView({ output }: { output: Output }) {
  switch (output.kind) {
    case "text":
      return <pre className={styles.text}>{output.lines.join("\n")}</pre>;

    case "error":
      return <p className={styles.error}>{output.message}</p>;

    case "projects":
      return (
        <ul className={styles.list}>
          {projects.map((p) => (
            <li key={p.slug}>
              <Link href={`/proyectos/${p.slug}`}>{p.slug}/</Link>
              <span className={styles.dim}>
                {" "}
                {statusLabel[p.status]} · {p.tagline}
              </span>
            </li>
          ))}
        </ul>
      );

    case "project": {
      const p = findProject(output.slug);
      if (!p) return null;
      return (
        <div className={styles.card}>
          <p>
            <span className={styles.cardName}>{p.name}</span>
            {p.tag && <span className={styles.dim}> [{p.tag}]</span>}
          </p>
          <p>{p.tagline}</p>
          <p className={styles.dim}>{p.summary}</p>
          <p className={styles.dim}>stack: {p.stack.join(" · ")}</p>
          <p className={styles.links}>
            {p.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label} ↗
              </a>
            ))}
            <Link href={`/proyectos/${p.slug}`}>ficha completa →</Link>
          </p>
        </div>
      );
    }

    case "flow": {
      const p = findProject(output.slug);
      if (!p?.flow) return null;
      return <FlowView flow={p.flow} />;
    }

    case "preview": {
      const p = findProject(output.slug);
      if (!p) return null;
      return <ProjectPreview project={p} />;
    }

    case "navigate":
      return <p className={styles.dim}>→ {output.message}</p>;

    case "open":
      return (
        <p className={styles.dim}>
          ↗ Abriendo {output.label}:{" "}
          <a href={output.url} target="_blank" rel="noopener noreferrer">
            {output.url}
          </a>
        </p>
      );

    case "contact":
      return <ContactOutput />;

    case "ascii":
      return <AsciiFace />;
  }
}
