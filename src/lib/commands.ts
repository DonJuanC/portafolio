import { projects } from "@/content/projects";
import type { Command, Output } from "./types";
import { GITHUB, LINKEDIN, getMailtoUrl } from "./links";

function slugFrom(arg: string | undefined): string {
  return (arg ?? "").toLowerCase().replace(/\/$/, "");
}

const CANON: [RegExp, string][] = [
  [/gemini/i, "Google Gemini"],
  [/^react( 19)?$/i, "React"],
  [/vitest/i, "Vitest"],
  [/postgres/i, "PostgreSQL (Neon)"],
  [/^vercel/i, "Vercel"],
  [/firebase/i, "Firebase"],
  [/tailwind/i, "Tailwind CSS"],
];

function canon(tech: string): string {
  return CANON.find(([re]) => re.test(tech))?.[1] ?? tech;
}

function stackUsage(): [string, number][] {
  const counts = new Map<string, number>();
  for (const p of projects) {
    // Set: un proyecto cuenta una sola vez por tecnología normalizada
    for (const tech of new Set(p.stack.map(canon))) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export const commands: Command[] = [
  {
    name: "help",
    summary: "lista los comandos disponibles",
    run: () => ({
      kind: "text",
      lines: [
        ...commands
          .filter((c) => !c.hidden)
          .map((c) => `${c.name.padEnd(8)} ${c.summary}`),
        "",
        "# ¿buscas más? Hay secretos en el sistema.",
        "# pista: ¿tienes permisos de root? ¿o prefieres un cafe?",
      ],
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
    name: "cd",
    summary: "navega a un proyecto o vuelve: cd <proyecto> | cd ..",
    run: ([arg]) => {
      const target = (arg ?? "").trim().toLowerCase();
      if (!target || target === "~" || target === "/") {
        return {
          kind: "navigate",
          path: "/",
          message: "cambiando al directorio raíz (~)",
        };
      }
      if (target === ".." || target === "../") {
        return {
          kind: "navigate",
          path: "/#proyectos",
          message: "subiendo a proyectos (..)",
        };
      }
      const slug = slugFrom(target.replace(/^(\.\/|proyectos\/)/, ""));
      const project = projects.find((p) => p.slug === slug);
      if (!project) {
        return {
          kind: "error",
          message: `cd: ${target}: No existe el archivo o directorio. Prueba con ls.`,
        };
      }
      return {
        kind: "navigate",
        path: `/proyectos/${project.slug}`,
        message: `entrando a ${project.name} (/proyectos/${project.slug})...`,
      };
    },
  },
  {
    name: "open",
    summary: "abre enlaces externos o demos: open [github|linkedin|<proyecto>]",
    run: ([target, sub]) => {
      const raw = (target ?? "").trim().toLowerCase();
      if (!raw) {
        return {
          kind: "error",
          message: "uso: open [github|linkedin|email|<proyecto>]",
        };
      }
      if (["github", "gh"].includes(raw)) {
        return { kind: "open", url: GITHUB, label: "GitHub (@DonJuanC)" };
      }
      if (["linkedin", "in"].includes(raw)) {
        return { kind: "open", url: LINKEDIN, label: "LinkedIn" };
      }
      if (["email", "mail", "correo"].includes(raw)) {
        return { kind: "open", url: getMailtoUrl(), label: "cliente de correo" };
      }

      const slug = slugFrom(raw);
      const project = projects.find((p) => p.slug === slug);
      if (!project) {
        return {
          kind: "error",
          message: `open: '${raw}' no encontrado. Prueba con: open github, open linkedin o open <proyecto>`,
        };
      }

      if (project.links.length === 0) {
        return {
          kind: "error",
          message: `open: ${project.name} no tiene enlaces externos registrados.`,
        };
      }

      if (sub) {
        const subClean = sub.toLowerCase();
        const matched = project.links.find(
          (l) =>
            l.label.toLowerCase().includes(subClean) ||
            (subClean === "repo" && l.label.toLowerCase().includes("repositorio")),
        );
        if (matched) {
          return {
            kind: "open",
            url: matched.url,
            label: `${project.name} (${matched.label})`,
          };
        }
      }

      const demoLink =
        project.links.find((l) => l.label.toLowerCase() === "demo") ??
        project.links[0];

      return {
        kind: "open",
        url: demoLink.url,
        label: `${project.name} (${demoLink.label})`,
      };
    },
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
    name: "preview",
    aliases: ["ui", "vista"],
    summary: "muestra la vista previa de interfaz: preview <proyecto>",
    run: ([arg]) => {
      const slug = slugFrom(arg);
      if (!slug) return { kind: "error", message: "uso: preview <proyecto>" };
      const project = projects.find((p) => p.slug === slug);
      if (!project) {
        return {
          kind: "error",
          message: `preview: ${slug}: no existe. Prueba con ls.`,
        };
      }
      return { kind: "preview", slug };
    },
  },
  {
    name: "contact",
    aliases: ["contacto", "email", "mail"],
    summary: "cómo encontrarme y escribirme",
    run: () => ({ kind: "contact" }),
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
    name: "rm",
    aliases: ["delete", "del", "remove"],
    summary: "",
    hidden: true,
    run: () => ({
      kind: "text",
      lines: [
        "Permiso denegado: ¡Ey, mis proyectos viven aquí!",
        "Si de verdad quieres romper cosas, intenta con 'sudo'.",
      ],
    }),
  },
  {
    name: "git",
    aliases: ["commit", "push"],
    summary: "",
    hidden: true,
    run: () => ({
      kind: "text",
      lines: [
        "fatal: No se hace git push a producción los viernes.",
        "Mejor prueba con 'face' o tómate un 'cafe'.",
      ],
    }),
  },
  {
    name: "vim",
    aliases: ["vi", ":q", ":wq", ":q!", "nano"],
    summary: "",
    hidden: true,
    run: () => ({
      kind: "text",
      lines: [
        "Tranquilo, no estás atrapado en Vim. Respira hondo.",
        "Para limpiar o salir escribe 'clear' o cierra la terminal.",
      ],
    }),
  },
  {
    name: "npm",
    aliases: ["pnpm", "yarn", "bun"],
    summary: "",
    hidden: true,
    run: () => ({
      kind: "text",
      lines: [
        "Instalando 4.280 dependencias y 3 vulnerabilidades críticas...",
        "Broma. Escribe 'skills' para ver las tecnologías que uso de verdad.",
      ],
    }),
  },
  {
    name: "exit",
    aliases: ["quit", "bye", "adios"],
    summary: "",
    hidden: true,
    run: () => ({
      kind: "text",
      lines: [
        "¿Ya te vas? Cierra la pestaña cuando quieras...",
        "Pero no te vayas sin escribir 'face' antes.",
      ],
    }),
  },
  {
    name: "cafe",
    aliases: ["coffee", "tinto"],
    summary: "",
    hidden: true,
    run: () => ({
      kind: "text",
      lines: [
        "☕ [HTTP 418: I'm a teapot]",
        "Servidor operando con café 100% colombiano de origen (Cali, Colombia).",
        "Nivel de cafeína: 98% · Listo para desplegar en producción.",
      ],
    }),
  },
  {
    name: "hire",
    aliases: ["contratar", "trabajo", "empleo", "chamba"],
    summary: "",
    hidden: true,
    run: () => ({
      kind: "text",
      lines: [
        "✨ [DECISIÓN INTELIGENTE DETECTADA]",
        "Candidato: JCamilo Castellanos · Full Stack Developer con mirada de procesos.",
        "Stack: React, TypeScript, Node.js, PostgreSQL, Gemini, arquitecturas resilientes.",
        "Siguiente paso: escribe 'contact' o haz clic en 'Copiar email' en la cabecera.",
      ],
    }),
  },
  {
    name: "cali",
    aliases: ["valle", "sucursal"],
    summary: "",
    hidden: true,
    run: () => ({
      kind: "text",
      lines: [
        "🌴 jcamilo@dev:~/cali$ (it's Cali, not California)",
        "Cali, Colombia · La Sucursal del Cielo.",
        "Temperatura: ~28°C · Salsa de golpe en el ambiente · Código limpio en la terminal.",
      ],
    }),
  },
  {
    name: "matrix",
    aliases: ["neo", "redpill"],
    summary: "",
    hidden: true,
    run: () => ({
      kind: "text",
      lines: [
        "Wake up, Neo...",
        "The Matrix has you.",
        "Follow the white rabbit.",
        "Knock, knock.",
        "",
        "(Píldora roja tomada. Bienvenido al backend).",
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
    name: "skills",
    aliases: ["stack"],
    summary: "tecnologías que uso, según mis proyectos",
    run: () => ({
      kind: "text",
      lines: [
        "# tecnologías por número de proyectos donde aparecen",
        ...stackUsage().map(([tech, n]) => `${String(n).padStart(2)}  ${tech}`),
      ],
    }),
  },
  {
    name: "mcc",
    aliases: ["musica"],
    summary: "música con criterio: blog y podcast",
    run: () => ({
      kind: "text",
      lines: [
        "Música con Criterio: blog editorial; y 'Música, luego existo', podcast musical.",
        "Selección con contexto y alma, no playlists al azar.",
      ],
    }),
  },
  {
    name: "djc",
    aliases: ["donjuancelektor"],
    summary: "",
    hidden: true,
    run: () => ({
      kind: "text",
      lines: [
        "DonJuanCelektor: el selector musical detrás de Música con Criterio.",
        "Solo aparece en eventos en vivo.",
      ],
    }),
  },
  {
    name: "face",
    aliases: ["foto"],
    summary: "",
    hidden: true,
    run: () => ({ kind: "ascii" }),
  },
  {
    name: "clear",
    summary: "limpia la pantalla",
    run: () => ({ kind: "text", lines: [] }),
  },
  {
    name: "theme",
    aliases: ["tema", "modo"],
    summary: "cambia el tema: theme [dark|light]",
    run: ([arg]) => {
      const mode = (arg ?? "").toLowerCase();
      if (!mode) return { kind: "theme", mode: "toggle" };
      if (mode === "dark" || mode === "oscuro")
        return { kind: "theme", mode: "dark" };
      if (mode === "light" || mode === "claro")
        return { kind: "theme", mode: "light" };
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
      message: `${name}: comando no encontrado. Escribe 'help' (o curiosea con 'face', 'sudo' y 'cafe').`,
    };
  }
  return command.run(args);
}
/** Devuelve la línea completada si hay una única coincidencia; si no, la misma entrada. */
export function complete(input: string): string {
  const [first = "", second, ...rest] = input.trimStart().split(/\s+/);
  const hasSecond = second !== undefined;

  // Un solo token: completar nombre de comando (sin los ocultos)
  if (!hasSecond) {
    const matches = commands
      .filter((c) => !c.hidden && c.name.startsWith(first.toLowerCase()))
      .map((c) => c.name);
    return matches.length === 1 ? matches[0] : input;
  }

  // cat/flow/cd/preview: completar slug de proyecto o rutas relativas
  if (
    ["cat", "flow", "cd", "preview"].includes(first.toLowerCase()) &&
    rest.length === 0
  ) {
    const targets =
      first.toLowerCase() === "cd"
        ? ["..", "~", ...projects.map((p) => p.slug)]
        : projects.map((p) => p.slug);
    const matches = targets.filter((s) =>
      s.startsWith(second.toLowerCase()),
    );
    return matches.length === 1 ? `${first} ${matches[0]}` : input;
  }

  // open: completar targets
  if (first.toLowerCase() === "open" && rest.length === 0) {
    const targets = [
      "github",
      "linkedin",
      "email",
      ...projects.map((p) => p.slug),
    ];
    const matches = targets.filter((s) =>
      s.startsWith(second.toLowerCase()),
    );
    return matches.length === 1 ? `${first} ${matches[0]}` : input;
  }

  return input;
}
