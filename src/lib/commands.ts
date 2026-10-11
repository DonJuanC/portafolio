import { getProjects } from "@/content/projects";
import { findPlaylist, PLAYLISTS } from "@/content/music";
import type { Locale } from "@/content/i18n";
import type { Command, Output } from "./types";
import { GITHUB, LINKEDIN, SPOTIFY_PROFILE, getMailtoUrl } from "./links";

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

function stackUsage(locale: Locale = "es"): [string, number][] {
  const currentProjects = getProjects(locale);
  const counts = new Map<string, number>();
  for (const p of currentProjects) {
    // Set: un proyecto cuenta una sola vez por tecnología normalizada
    for (const tech of new Set(p.stack.map(canon))) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export function getCommands(locale: Locale = "es"): Command[] {
  const isEn = locale === "en";
  const projectList = getProjects(locale);

  return [
    {
      name: "help",
      summary: isEn
        ? "list available commands"
        : "lista los comandos disponibles",
      run: () => ({
        kind: "text",
        lines: isEn
          ? [
              ...getCommands(locale)
                .filter((c) => !c.hidden)
                .map((c) => `${c.name.padEnd(8)} ${c.summary}`),
              "",
              "# looking for more? There are system secrets.",
              "# hint: got root permissions? or fancy a coffee?",
            ]
          : [
              ...getCommands(locale)
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
      summary: isEn ? "who am i" : "quién soy",
      run: () => ({
        kind: "text",
        lines: isEn
          ? [
              "JCamilo Castellanos",
              "Full Stack Developer · Industrial Engineer · Cali, Colombia (it's Cali, not California — zero VC drama)",
            ]
          : [
              "JCamilo Castellanos",
              "Full Stack Developer · Ingeniero industrial · Cali, Colombia (it's Cali, not California)",
            ],
      }),
    },
    {
      name: "ls",
      summary: isEn ? "list projects" : "lista los proyectos",
      run: () => ({ kind: "projects" }),
    },
    {
      name: "cd",
      summary: isEn
        ? "navigate to a project or back: cd <project> | cd .."
        : "navega a un proyecto o vuelve: cd <proyecto> | cd ..",
      run: ([arg]) => {
        const target = (arg ?? "").trim().toLowerCase();
        if (!target || target === "~" || target === "/") {
          return {
            kind: "navigate",
            path: "/",
            message: isEn
              ? "switching to home directory (~)"
              : "cambiando al directorio raíz (~)",
          };
        }
        if (target === ".." || target === "../") {
          return {
            kind: "navigate",
            path: "/#proyectos",
            message: isEn
              ? "moving up to projects (..)"
              : "subiendo a proyectos (..)",
          };
        }
        const slug = slugFrom(target.replace(/^(\.\/|proyectos\/)/, ""));
        const project = projectList.find((p) => p.slug === slug);
        if (!project) {
          return {
            kind: "error",
            message: isEn
              ? `cd: ${target}: No such file or directory. Try ls.`
              : `cd: ${target}: No existe el archivo o directorio. Prueba con ls.`,
          };
        }
        return {
          kind: "navigate",
          path: `/proyectos/${project.slug}`,
          message: isEn
            ? `entering ${project.name} (/proyectos/${project.slug})...`
            : `entrando a ${project.name} (/proyectos/${project.slug})...`,
        };
      },
    },
    {
      name: "open",
      summary: isEn
        ? "open external links or demos: open [github|linkedin|<project>]"
        : "abre enlaces externos o demos: open [github|linkedin|<proyecto>]",
      run: ([target, sub]) => {
        const raw = (target ?? "").trim().toLowerCase();
        if (!raw) {
          return {
            kind: "error",
            message: isEn
              ? "usage: open [github|linkedin|spotify|email|<project>]"
              : "uso: open [github|linkedin|spotify|email|<proyecto>]",
          };
        }
        if (["github", "gh"].includes(raw)) {
          return { kind: "open", url: GITHUB, label: "GitHub (@DonJuanC)" };
        }
        if (["linkedin", "in"].includes(raw)) {
          return { kind: "open", url: LINKEDIN, label: "LinkedIn" };
        }
        if (["spotify", "sp"].includes(raw)) {
          return {
            kind: "open",
            url: SPOTIFY_PROFILE,
            label: "Spotify (@DonJuanCelektor)",
          };
        }
        if (["email", "mail", "correo"].includes(raw)) {
          return {
            kind: "open",
            url: getMailtoUrl(),
            label: isEn ? "email client" : "cliente de correo",
          };
        }

        const slug = slugFrom(raw);
        const project = projectList.find((p) => p.slug === slug);
        if (!project) {
          return {
            kind: "error",
            message: isEn
              ? `open: '${raw}' not found. Try: open github, open linkedin or open <project>`
              : `open: '${raw}' no encontrado. Prueba con: open github, open linkedin o open <proyecto>`,
          };
        }

        if (project.links.length === 0) {
          return {
            kind: "error",
            message: isEn
              ? `open: ${project.name} has no external links registered.`
              : `open: ${project.name} no tiene enlaces externos registrados.`,
          };
        }

        if (sub) {
          const subClean = sub.toLowerCase();
          const matched = project.links.find(
            (l) =>
              l.label.toLowerCase().includes(subClean) ||
              (subClean === "repo" &&
                (l.label.toLowerCase().includes("repositorio") ||
                  l.label.toLowerCase().includes("repository"))),
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
      summary: isEn
        ? "view project specs: cat <project>"
        : "abre la ficha de un proyecto: cat <proyecto>",
      run: ([arg]) => {
        const slug = slugFrom(arg);
        if (!slug) {
          return {
            kind: "error",
            message: isEn ? "usage: cat <project>" : "uso: cat <proyecto>",
          };
        }
        if (!projectList.some((p) => p.slug === slug)) {
          return {
            kind: "error",
            message: isEn
              ? `cat: ${slug}: not found. Try ls.`
              : `cat: ${slug}: no existe. Prueba con ls.`,
          };
        }
        return { kind: "project", slug };
      },
    },
    {
      name: "flow",
      summary: isEn
        ? "show project process flow: flow <project>"
        : "muestra el flujo de un proyecto: flow <proyecto>",
      run: ([arg]) => {
        const slug = slugFrom(arg);
        if (!slug) {
          return {
            kind: "error",
            message: isEn ? "usage: flow <project>" : "uso: flow <proyecto>",
          };
        }
        const project = projectList.find((p) => p.slug === slug);
        if (!project) {
          return {
            kind: "error",
            message: isEn
              ? `flow: ${slug}: not found. Try ls.`
              : `flow: ${slug}: no existe. Prueba con ls.`,
          };
        }
        if (!project.flow) {
          return {
            kind: "error",
            message: isEn
              ? `flow: ${slug} does not have a diagram yet.`
              : `flow: ${slug} todavía no tiene diagrama.`,
          };
        }
        return { kind: "flow", slug };
      },
    },
    {
      name: "preview",
      aliases: ["ui", "vista"],
      summary: isEn
        ? "show project interface preview: preview <project>"
        : "muestra la vista previa de interfaz: preview <proyecto>",
      run: ([arg]) => {
        const slug = slugFrom(arg);
        if (!slug) {
          return {
            kind: "error",
            message: isEn
              ? "usage: preview <project>"
              : "uso: preview <proyecto>",
          };
        }
        const project = projectList.find((p) => p.slug === slug);
        if (!project) {
          return {
            kind: "error",
            message: isEn
              ? `preview: ${slug}: not found. Try ls.`
              : `preview: ${slug}: no existe. Prueba con ls.`,
          };
        }
        return { kind: "preview", slug };
      },
    },
    {
      name: "contact",
      aliases: ["contacto", "email", "mail"],
      summary: isEn ? "how to reach me" : "cómo encontrarme y escribirme",
      run: () => ({ kind: "contact" }),
    },
    {
      name: "spotify",
      aliases: ["music", "musica", "curaduria", "playlist", "playlists"],
      summary: isEn
        ? "DonJuanCelektor curated music player: spotify [playlist]"
        : "curaduría y reproductor de DonJuanCelektor: spotify [playlist]",
      run: ([arg]) => {
        if (!arg || arg === "list" || arg === "all") {
          return { kind: "spotify" };
        }
        const matched = findPlaylist(arg);
        if (matched) {
          return { kind: "spotify", playlistId: matched.id };
        }
        return {
          kind: "error",
          message: isEn
            ? `spotify: '${arg}' not found. Type 'spotify' to browse all, or try: ${PLAYLISTS.map((p) => p.slug).join(", ")}`
            : `spotify: '${arg}' no encontrada. Escribe 'spotify' para ver todas, o prueba: ${PLAYLISTS.map((p) => p.slug).join(", ")}`,
        };
      },
    },
    {
      name: "skills",
      aliases: ["stack"],
      summary: isEn
        ? "tech stack by project count"
        : "tecnologías que uso, según mis proyectos",
      run: () => ({
        kind: "text",
        lines: [
          isEn
            ? "# technologies sorted by number of projects they appear in"
            : "# tecnologías por número de proyectos donde aparecen",
          ...stackUsage(locale).map(
            ([tech, n]) => `${String(n).padStart(2)}  ${tech}`,
          ),
        ],
      }),
    },
    {
      name: "theme",
      aliases: ["tema", "modo"],
      summary: isEn
        ? "toggle or set theme: theme [dark|light]"
        : "cambia el tema: theme [dark|light]",
      run: ([arg]) => {
        const mode = (arg ?? "").toLowerCase();
        if (!mode) return { kind: "theme", mode: "toggle" };
        if (mode === "dark" || mode === "oscuro")
          return { kind: "theme", mode: "dark" };
        if (mode === "light" || mode === "claro")
          return { kind: "theme", mode: "light" };
        return {
          kind: "error",
          message: isEn ? "usage: theme [dark|light]" : "uso: theme [dark|light]",
        };
      },
    },
    {
      name: "lang",
      aliases: ["language", "idioma"],
      summary: isEn
        ? "switch language: lang [en|es]"
        : "cambia el idioma: lang [es|en]",
      run: ([arg]) => {
        const target = (arg ?? "").trim().toLowerCase();
        if (!target) {
          // Toggle when no argument provided
          const nextLocale: Locale = locale === "es" ? "en" : "es";
          return {
            kind: "lang",
            locale: nextLocale,
            message:
              nextLocale === "en"
                ? "language switched to english (easter eggs and jokes localized)"
                : "idioma: español (easter eggs y bromas localizados)",
          };
        }
        if (target === "en" || target === "english") {
          return {
            kind: "lang",
            locale: "en",
            message: "language switched to english (easter eggs and jokes localized)",
          };
        }
        if (target === "es" || target === "spanish" || target === "español") {
          return {
            kind: "lang",
            locale: "es",
            message: "idioma: español (easter eggs y bromas localizados)",
          };
        }
        return {
          kind: "error",
          message: isEn ? "usage: lang [en|es]" : "uso: lang [es|en]",
        };
      },
    },
    {
      name: "clear",
      summary: isEn ? "clear terminal screen" : "limpia la pantalla",
      run: () => ({ kind: "text", lines: [] }),
    },

    // --- Easter Eggs ---
    {
      name: "sudo",
      summary: "",
      hidden: true,
      run: () => ({
        kind: "text",
        lines: isEn
          ? [
              "[sudo] password for jcamilo:",
              "jcamilo is not in the sudoers file. This incident will be reported to Santa Claus.",
            ]
          : [
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
        lines: isEn
          ? [
              "Permission denied: Hey, my projects live here!",
              "If you really want to break things in production, try 'sudo'.",
            ]
          : [
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
        lines: isEn
          ? [
              "fatal: You never git push to production on a Friday.",
              "Better try 'face' or grab some 'coffee'.",
            ]
          : [
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
        lines: isEn
          ? [
              "Relax, you're not trapped in Vim. Take a deep breath.",
              "To clear or exit, type 'clear' or close the terminal.",
            ]
          : [
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
        lines: isEn
          ? [
              "Installing 4,280 dependencies and 3 critical vulnerabilities...",
              "Just kidding. Type 'skills' to see the tech stack I actually use.",
            ]
          : [
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
        lines: isEn
          ? [
              "Leaving already? Close the tab whenever you want...",
              "Just don't go without typing 'face' first.",
            ]
          : [
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
        lines: isEn
          ? [
              "☕ [HTTP 418: I'm a teapot]",
              "Server running on 100% single-origin Colombian coffee (Cali, Colombia).",
              "Caffeine level: 98% · Ready to ship to production.",
            ]
          : [
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
        lines: isEn
          ? [
              "✨ [SMART HIRING DECISION DETECTED]",
              "Candidate: JCamilo Castellanos · Full Stack Developer with an engineering mindset.",
              "Stack: React, TypeScript, Node.js, PostgreSQL, Gemini, resilient architectures.",
              "Next step: type 'contact' or click 'Copy email' in the header.",
            ]
          : [
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
        lines: isEn
          ? [
              "🌴 jcamilo@dev:~/cali$ (it's Cali, not California)",
              "Cali, Colombia · The World Capital of Salsa.",
              "Temperature: ~28°C / 82°F · Salsa rhythms in the air · Clean code in the terminal.",
            ]
          : [
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
          isEn
            ? "(Red pill taken. Welcome to the backend)."
            : "(Píldora roja tomada. Bienvenido al backend).",
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
          isEn
            ? "No drag & drop here. Just a code editor, a terminal, and engineering judgment."
            : "Aquí no hay drag & drop. Hay un editor, una terminal y criterio.",
        ],
      }),
    },
    {
      name: "cocreemos",
      summary: "",
      hidden: true,
      run: () => ({
        kind: "text",
        lines: isEn
          ? [
              "Co|Creemos Colectivo",
              "Strategy, business processes, and brand identity for entrepreneurs & SMBs.",
            ]
          : [
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
        lines: isEn
          ? [
              "criterio (judgment): what decides what stays and what gets cut.",
              "Found in Música con Criterio, my music blog & podcast, and in Watchlist con Criterio, a film connection graph.",
            ]
          : [
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
        lines: isEn
          ? [
              "Auteur cinema, connected by director and semantic affinity.",
              "Try: cat watchlist-con-criterio",
            ]
          : [
              "Cine de autor, conectado por director y afinidad.",
              "Prueba: cat watchlist-con-criterio",
            ],
      }),
    },
    {
      name: "mcc",
      aliases: ["radio", "podcast"],
      summary: isEn
        ? "música con criterio: music podcast & blog"
        : "música con criterio: blog y podcast",
      run: (args) => {
        if (args && args[0] && ["play", "spotify", "music", "musica"].includes(args[0].toLowerCase())) {
          return { kind: "spotify" };
        }
        return {
          kind: "text",
          lines: isEn
            ? [
                "┌────────────────────────────────────────────────────────┐",
                "│  📻 MÚSICA CON CRITERIO · Podcast & Editorial Blog     │",
                "│  ► [■■■■■■■■■■■■■■■□□□□] 03:24 / 04:48                 │",
                "│  Track: Soulful Selection · Jazz / Funk / Hard Salsa   │",
                "│  Voice: DonJuanCelektor in «I Play, Therefore I Am»    │",
                "└────────────────────────────────────────────────────────┘",
                "\"Music with taste doesn't compete with streaming algorithms:",
                " it champions context, vinyl, and the human story behind sound.\"",
                "",
                "# Tip: type 'spotify' to load DonJuanCelektor's curated playlists.",
              ]
            : [
                "┌────────────────────────────────────────────────────────┐",
                "│  📻 MÚSICA CON CRITERIO · Podcast & Blog Editorial     │",
                "│  ► [■■■■■■■■■■■■■■■□□□□] 03:24 / 04:48                 │",
                "│  Track: Selección con alma · Jazz / Funk / Salsa Dura  │",
                "│  Voz: DonJuanCelektor en «Música, luego existo»        │",
                "└────────────────────────────────────────────────────────┘",
                "«La música con criterio no compite con algoritmos de streaming:",
                " rescata el contexto, el vinilo y la historia detrás del sonido.»",
                "",
                "# Tip: escribe 'spotify' para abrir el reproductor curado de DonJuanCelektor.",
              ],
        };
      },
    },
    {
      name: "djc",
      aliases: ["donjuancelektor", "selector"],
      summary: "",
      hidden: true,
      run: (args) => {
        if (args && args[0] && ["play", "spotify", "music", "musica"].includes(args[0].toLowerCase())) {
          return { kind: "spotify" };
        }
        return {
          kind: "text",
          lines: isEn
            ? [
                "🎧 DonJuanCelektor: the sonic alter ego behind Música con Criterio.",
                "Mission: Handcrafted audio curation, zero algorithmic shuffle.",
                "Status: In the booth (vinyl and live sessions only).",
                "",
                "# Tip: type 'spotify' to load my curated playlists with previews.",
              ]
            : [
                "🎧 DonJuanCelektor: el alter ego musical detrás de Música con Criterio.",
                "Misión: Curaduría sonora artesanal, cero shuffle automático.",
                "Estado: En cabina (solo eventos en vivo y tornamesas).",
                "",
                "# Tip: escribe 'spotify' para cargar mis playlists curadas con previews.",
              ],
        };
      },
    },
    {
      name: "face",
      aliases: ["foto"],
      summary: "",
      hidden: true,
      run: () => ({ kind: "ascii" }),
    },
  ];
}

export const commands: Command[] = getCommands("es");

export function execute(input: string, locale: Locale = "es"): Output {
  const [name, ...args] = input.trim().split(/\s+/);
  if (!name) return { kind: "text", lines: [] };

  const key = name.toLowerCase();
  const commandList = getCommands(locale);
  const command = commandList.find(
    (c) => c.name === key || c.aliases?.includes(key),
  );
  if (!command) {
    const isEn = locale === "en";
    return {
      kind: "error",
      message: isEn
        ? `${name}: command not found. Type 'help' (or poke around with 'face', 'sudo' and 'coffee').`
        : `${name}: comando no encontrado. Escribe 'help' (o curiosea con 'face', 'sudo' y 'cafe').`,
    };
  }
  return command.run(args, locale);
}

/** Devuelve la línea completada si hay una única coincidencia; si no, la misma entrada. */
export function complete(input: string, locale: Locale = "es"): string {
  const [first = "", second, ...rest] = input.trimStart().split(/\s+/);
  const hasSecond = second !== undefined;
  const commandList = getCommands(locale);
  const projectList = getProjects(locale);

  // Un solo token: completar nombre de comando (sin los ocultos)
  if (!hasSecond) {
    const matches = commandList
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
        ? ["..", "~", ...projectList.map((p) => p.slug)]
        : projectList.map((p) => p.slug);
    const matches = targets.filter((s) =>
      s.startsWith(second.toLowerCase()),
    );
    return matches.length === 1 ? `${first} ${matches[0]}` : input;
  }

  // lang: completar opciones de idioma
  if (
    ["lang", "language", "idioma"].includes(first.toLowerCase()) &&
    rest.length === 0
  ) {
    const targets = ["en", "es"];
    const matches = targets.filter((s) => s.startsWith(second.toLowerCase()));
    return matches.length === 1 ? `${first} ${matches[0]}` : input;
  }

  // spotify/music/curaduria: completar slug de playlist
  if (
    ["spotify", "music", "musica", "curaduria", "playlist", "playlists"].includes(
      first.toLowerCase(),
    ) &&
    rest.length === 0
  ) {
    const targets = PLAYLISTS.map((p) => p.slug);
    const matches = targets.filter((s) => s.startsWith(second.toLowerCase()));
    return matches.length === 1 ? `${first} ${matches[0]}` : input;
  }

  // open: completar targets
  if (first.toLowerCase() === "open" && rest.length === 0) {
    const targets = [
      "github",
      "linkedin",
      "spotify",
      "email",
      ...projectList.map((p) => p.slug),
    ];
    const matches = targets.filter((s) =>
      s.startsWith(second.toLowerCase()),
    );
    return matches.length === 1 ? `${first} ${matches[0]}` : input;
  }

  return input;
}
