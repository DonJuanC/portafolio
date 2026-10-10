import Image from "next/image";
import type { Project } from "@/lib/types";
import styles from "./ProjectPreview.module.css";

interface ProjectPreviewProps {
  project: Project;
}

export default function ProjectPreview({ project }: ProjectPreviewProps) {
  const demoLink =
    project.links.find((l) => l.label.toLowerCase() === "demo") ??
    project.links[0];

  const rawDomain = demoLink
    ? demoLink.url.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : `${project.slug}.local`;

  return (
    <section
      className={styles.container}
      aria-label={`Vista previa de ${project.name}`}
    >
      <div className={styles.window}>
        <div className={styles.titlebar}>
          <div className={styles.controls} aria-hidden="true">
            <span className={`${styles.dot} ${styles.dotClose}`} />
            <span className={`${styles.dot} ${styles.dotMin}`} />
            <span className={`${styles.dot} ${styles.dotMax}`} />
          </div>

          <div className={styles.urlPill}>
            {demoLink ? (
              <a
                href={demoLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.urlLink}
                title={`Visitar ${demoLink.url}`}
              >
                <span className={styles.protocol}>https://</span>
                <span className={styles.domain}>{rawDomain}</span>
                <span className={styles.arrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            ) : (
              <span className={styles.urlLink}>
                <span className={styles.domain}>{rawDomain}</span>
              </span>
            )}
          </div>

          <div className={styles.actions}>
            {demoLink && (
              <a
                href={demoLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionBtn}
              >
                abrir demo ↗
              </a>
            )}
          </div>
        </div>

        <div className={styles.body}>
          {project.image ? (
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width={1200}
              height={680}
              className={styles.image}
            />
          ) : (
            <div className={styles.blueprint}>
              <div className={styles.blueprintInner}>
                <p className={styles.blueprintLead}>{project.tagline}</p>
                <div className={styles.blueprintMeta}>
                  Stack: {project.stack.slice(0, 5).join(" · ")}
                </div>
                {demoLink && (
                  <a
                    href={demoLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.blueprintCta}
                  >
                    Ver aplicación en vivo ↗
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className={styles.caption}>
        # interfaz de usuario ·{" "}
        {project.image?.caption ??
          (demoLink ? `desplegado en ${rawDomain}` : project.name)}
      </p>
    </section>
  );
}
