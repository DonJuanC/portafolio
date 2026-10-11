"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { statusLabels } from "@/lib/labels";
import FlowView from "@/components/FlowView";
import ProjectPreview from "@/components/ProjectPreview";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Project } from "@/lib/types";
import styles from "@/app/proyectos/[slug]/page.module.css";

interface ProjectDetailProps {
  initialProject: Project;
  slug: string;
}

export default function ProjectDetail({
  initialProject,
  slug,
}: ProjectDetailProps) {
  const { locale, projects, t } = useLanguage();
  const project = projects.find((p) => p.slug === slug) ?? initialProject;
  const statusMap = statusLabels[locale];

  return (
    <main className={styles.screen}>
      <div className={styles.topBar}>
        <Link className={styles.back} href="/#proyectos">
          <span aria-hidden="true">←</span> {t.detail.back}
          <span className={styles.cmd} aria-hidden="true">
            {t.detail.cmdBack}
          </span>
        </Link>
        <LanguageSwitcher />
      </div>

      <p className={styles.line}>
        <span className={styles.prompt}>jcamilo@dev:~/cali$</span>cat{" "}
        {project.slug}
      </p>

      <div className={styles.head}>
        <h1 className={styles.name}>{project.name}</h1>
        {project.tag && <span className={styles.tag}>[{project.tag}]</span>}
      </div>

      <p className={styles.tagline}>{project.tagline}</p>
      <p className={styles.summary}>{project.summary}</p>

      <div className={styles.grid}>
        <span className={styles.key}>{t.detail.status}</span>
        <span className={project.status === "deployed" ? styles.statusOn : ""}>
          {statusMap[project.status]}
        </span>

        <span className={styles.key}>{t.detail.role}</span>
        <span>{project.role}</span>

        {project.team && (
          <>
            <span className={styles.key}>{t.detail.team}</span>
            <span>{project.team}</span>
          </>
        )}

        <span className={styles.key}>{t.detail.stack}</span>
        <ul className={styles.chips}>
          {project.stack.map((s) => (
            <li key={s} className={styles.chip}>
              {s}
            </li>
          ))}
        </ul>

        <span className={styles.key}>{t.detail.links}</span>
        <ul className={styles.links}>
          {project.links.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noopener noreferrer">
                {l.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className={styles.line}>
        <span className={styles.prompt}>jcamilo@dev:~/cali$</span>preview{" "}
        {project.slug}
      </p>
      <ProjectPreview project={project} />

      {project.flow && (
        <>
          <p className={styles.line}>
            <span className={styles.prompt}>jcamilo@dev:~/cali$</span>flow{" "}
            {project.slug}
          </p>
          <FlowView flow={project.flow} />
        </>
      )}

      <Link className={styles.back} href="/#proyectos">
        <span aria-hidden="true">←</span> {t.detail.back}
        <span className={styles.cmd} aria-hidden="true">
          {t.detail.cmdBack}
        </span>
      </Link>
    </main>
  );
}
