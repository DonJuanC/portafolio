import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { projects } from "@/content/projects";
import { statusLabel } from "@/lib/labels";
import FlowView from "@/components/FlowView";
import type { Metadata } from "next";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/proyectos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.tagline,
    alternates: { canonical: `/proyectos/${project.slug}` },
    openGraph: { title: project.name, description: project.tagline },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/proyectos/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <main className={styles.screen}>
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
        <span className={styles.key}>estado</span>
        <span className={project.status === "deployed" ? styles.statusOn : ""}>
          {statusLabel[project.status]}
        </span>

        <span className={styles.key}>mi rol</span>
        <span>{project.role}</span>

        {project.team && (
          <>
            <span className={styles.key}>equipo</span>
            <span>{project.team}</span>
          </>
        )}

        <span className={styles.key}>stack</span>
        <ul className={styles.chips}>
          {project.stack.map((s) => (
            <li key={s} className={styles.chip}>
              {s}
            </li>
          ))}
        </ul>

        <span className={styles.key}>enlaces</span>
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

      <Link className={styles.back} href="/">
        {project.flow && (
          <>
            <p className={styles.line}>
              <span className={styles.prompt}>jcamilo@dev:~/cali$</span>flow{" "}
              {project.slug}
            </p>
            <FlowView flow={project.flow} />
          </>
        )}
        ← cd ..
      </Link>
    </main>
  );
}
