import { projects } from "@/content/projects";
import type { Command, Output } from "./types";

const GITHUB = "https://github.com/DonJuanC";
const LINKEDIN = "https://www.linkedin.com/in/juancamilo-castellanos-uribe";

function slugFrom(arg: string | undefined): string {
  return (arg ?? "").toLowerCase().replace(/\/$/, "");
}

export const commands: Command[] = [
  {
    name: "help",
    summary: "lista los comandos disponibles",
    run: () => ({
      kind: "text",
      lines: commands
        .filter((c) => !c.hidden)
        .map((c) => `${c.name.padEnd(8)} ${c.summary}`),
    }),
  },
  {
    name: "whoami",
    summary: "quién soy",
    run: () => ({
      kind: "text",
      lines: [
        "JCamilo Castellanos",
        "Full Stack Developer · Ingeniero industrial · Cali, Colombia (it's Cali, not California)",
      ],
    }),
  },
  {
    name: "ls",
    summary: "lista los proyectos",
    run: () => ({ kind: "projects" }),
  },
  {
    name: "cat",
    summary: "abre la ficha de un proyecto: cat <proyecto>",
    run: ([arg]) => {
      const slug = slugFrom(arg);
      if (!slug) return { kind: "error", message: "uso: cat <proyecto>" };
      if (!projects.some((p) => p.slug === slug)) {
        return {
          kind: "error",
          message: `cat: ${slug}: no existe. Prueba con ls.`,
        };
      }
      return { kind: "project", slug };
    },
  },
  {
    name: "flow",
    summary: "muestra el flujo de un proyecto: flow <proyecto>",
    run: ([arg]) => {
      const slug = slugFrom(arg);
      if (!slug) return { kind: "error", message: "uso: flow <proyecto>" };
      const project = projects.find((p) => p.slug === slug);
      if (!project) {
        return {
          kind: "error",
          message: `flow: ${slug}: no existe. Prueba con ls.`,
        };
      }
      if (!project.flow) {
        return {
          kind: "error",
          message: `flow: ${slug} todavía no tiene diagrama.`,
        };
      }
      return { kind: "flow", slug };
    },
  },
  {
    name: "contact",
    summary: "cómo encontrarme",
    run: () => ({
      kind: "text",
      lines: [`github    ${GITHUB}`, `linkedin  ${LINKEDIN}`],
    }),
  },
  {
    name: "sudo",
    summary: "",
    hidden: true,
    run: () => ({
      kind: "text",
      lines: [
        "[sudo] contraseña para jcamilo:",
        "jcamilo no está en el archivo sudoers. Este incidente será reportado.",
      ],
    }),
  },
  {
    name: "wix",
    aliases: ["wordpress", "squarespace"],
    summary: "",
    hidden: true,
    run: () => ({
      kind: "text",
      lines: [
        "Aquí no hay drag & drop. Hay un editor, una terminal y criterio.",
      ],
    }),
  },
  {
    name: "cocreemos",
    summary: "",
    hidden: true,
    run: () => ({
      kind: "text",
      lines: [
        "Co|Creemos Colectivo",
        "Estrategia, procesos e identidad de marca para emprendedores y pymes.",
      ],
    }),
  },
  {
    name: "criterio",
    summary: "",
    hidden: true,
    run: () => ({
      kind: "text",
      lines: [
        "criterio: lo que decide qué entra y qué se queda.",
        "Está en Música con Criterio, mi blog y podcast musical, y en Watchlist con Criterio, un grafo de conexiones entre películas.",
      ],
    }),
  },
  {
    name: "cinema",
    summary: "",
    hidden: true,
    run: () => ({
      kind: "text",
      lines: [
        "Cine de autor, conectado por director y afinidad.",
        "Prueba: cat watchlist-con-criterio",
      ],
    }),
  },
  {
    name: "clear",
    summary: "limpia la pantalla",
    run: () => ({ kind: "text", lines: [] }),
  },
  {
    name: "theme",
    aliases: ["tema"],
    summary: "cambia el tema: theme [dark|light]",
    run: ([arg]) => {
      const mode = (arg ?? "").toLowerCase();
      if (!mode) return { kind: "theme", mode: "toggle" };
      if (mode === "dark" || mode === "oscuro") return { kind: "theme", mode: "dark" };
      if (mode === "light" || mode === "claro") return { kind: "theme", mode: "light" };
      return { kind: "error", message: "uso: theme [dark|light]" };
    },
  },
];

export function execute(input: string): Output {
  const [name, ...args] = input.trim().split(/\s+/);
  if (!name) return { kind: "text", lines: [] };

  const key = name.toLowerCase();
  const command = commands.find(
    (c) => c.name === key || c.aliases?.includes(key),
  );
  if (!command) {
    return {
      kind: "error",
      message: `${name}: comando no encontrado. Escribe help.`,
    };
  }
  return command.run(args);
}
