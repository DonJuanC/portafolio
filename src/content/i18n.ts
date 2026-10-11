export type Locale = "es" | "en";

export interface Dictionary {
  hero: {
    signature: string;
    title: string;
    role: string;
    leadStart: string;
    easterEggTrigger: string;
    easterEggTooltip: string;
    actions: {
      viewProjects: string;
      github: string;
      linkedin: string;
      talkByEmail: string;
      copyEmail: string;
      copiedEmail: string;
    };
    terminalPromptHint: {
      question: string;
      terminalWord: string;
      typeWord: string;
      command: string;
    };
  };
  projects: {
    title: string;
    featured: string;
    deployed: string;
    inProgress: string;
    building: string;
    team: string;
    viewProject: string;
  };
  terminal: {
    summaryTitle: string;
    summaryThemeTip: string;
    hint: string;
    inputPlaceholder: string;
    srOnlyLabel: string;
    suggestedLabel: string;
    langSwitched: string;
  };
  contact: {
    copyTitle: string;
    copyBtn: string;
    copiedBtn: string;
    mailtoTitle: string;
    mailtoBtn: string;
  };
  detail: {
    back: string;
    cmdBack: string;
    status: string;
    role: string;
    team: string;
    stack: string;
    links: string;
    openDemo: string;
    uiCaption: string;
    flowLabel: string;
    kindLabels: {
      input: string;
      process: string;
      decision: string;
      output: string;
    };
  };
  notFound: {
    routeNotFound: string;
    error404: string;
    backHome: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  es: {
    hero: {
      signature: "jcamilo@dev:~/cali$",
      title: "JCamilo Castellanos",
      role: "Full Stack Developer · Ingeniero industrial · Cali, Colombia",
      leadStart:
        "Desarrollador Full Stack con mirada de ingeniero industrial. Aquí, un poco de mi mundo",
      easterEggTrigger: "(y algunos easter eggs)",
      easterEggTooltip: "terminal: prueba 'face' o 'sudo'",
      actions: {
        viewProjects: "Ver proyectos",
        github: "GitHub",
        linkedin: "LinkedIn",
        talkByEmail: "Hablemos por correo",
        copyEmail: "Copiar email",
        copiedEmail: "✓ Correo copiado",
      },
      terminalPromptHint: {
        question: "¿Prefieres tema claro o explorar? Abre la",
        terminalWord: "terminal",
        typeWord: "y escribe",
        command: "theme",
      },
    },
    projects: {
      title: "Proyectos",
      featured: "★ destacado",
      deployed: "desplegado",
      inProgress: "en desarrollo",
      building: "en construcción",
      team: "equipo:",
      viewProject: "Ver proyecto →",
    },
    terminal: {
      summaryTitle: "¿Curioso? Abre la terminal",
      summaryThemeTip: "(escribe theme para alternar modo claro/oscuro)",
      hint: "# escribe help para ver los comandos",
      inputPlaceholder: "escribe un comando (ej. 'help', 'theme', 'lang')... ",
      srOnlyLabel: "Línea de comandos de la terminal",
      suggestedLabel: "Comandos sugeridos",
      langSwitched: "idioma: español (easter eggs y bromas localizados)",
    },
    contact: {
      copyTitle: "Copiar correo real al portapapeles",
      copyBtn: "[copiar]",
      copiedBtn: "✓ copiado",
      mailtoTitle: "Abrir tu cliente de correo",
      mailtoBtn: "[abrir mailto ↗]",
    },
    detail: {
      back: "Volver a proyectos",
      cmdBack: "cd ..",
      status: "estado",
      role: "mi rol",
      team: "equipo",
      stack: "stack",
      links: "enlaces",
      openDemo: "abrir demo ↗",
      uiCaption: "interfaz de usuario",
      flowLabel: "Flujo del proceso",
      kindLabels: {
        input: "entrada",
        process: "proceso",
        decision: "decisión",
        output: "salida",
      },
    },
    notFound: {
      routeNotFound: "bash: cd: /404-ruta: No existe el archivo o directorio",
      error404:
        "# error 404: la página que buscas no se encuentra en el sistema",
      backHome: "Volver al inicio",
    },
  },
  en: {
    hero: {
      signature: "jcamilo@dev:~/cali$",
      title: "JCamilo Castellanos",
      role: "Full Stack Developer · Industrial Engineer · Cali, Colombia",
      leadStart:
        "Full Stack Developer with an industrial engineering mindset. Here is a bit of my world",
      easterEggTrigger: "(and a few easter eggs)",
      easterEggTooltip: "terminal: try 'face' or 'sudo'",
      actions: {
        viewProjects: "View projects",
        github: "GitHub",
        linkedin: "LinkedIn",
        talkByEmail: "Let's talk via email",
        copyEmail: "Copy email",
        copiedEmail: "✓ Email copied",
      },
      terminalPromptHint: {
        question: "Prefer light mode or want to explore? Open the",
        terminalWord: "terminal",
        typeWord: "and type",
        command: "theme",
      },
    },
    projects: {
      title: "Projects",
      featured: "★ featured",
      deployed: "deployed",
      inProgress: "in progress",
      building: "building",
      team: "team:",
      viewProject: "View project →",
    },
    terminal: {
      summaryTitle: "Curious? Open the terminal",
      summaryThemeTip: "(type theme to toggle light/dark mode)",
      hint: "# type help to view available commands",
      inputPlaceholder: "type a command (e.g. 'help', 'theme', 'lang')... ",
      srOnlyLabel: "Terminal command line",
      suggestedLabel: "Suggested commands",
      langSwitched: "language: english (easter eggs and jokes localized)",
    },
    contact: {
      copyTitle: "Copy real email to clipboard",
      copyBtn: "[copy]",
      copiedBtn: "✓ copied",
      mailtoTitle: "Open your email client",
      mailtoBtn: "[open mailto ↗]",
    },
    detail: {
      back: "Back to projects",
      cmdBack: "cd ..",
      status: "status",
      role: "my role",
      team: "team",
      stack: "stack",
      links: "links",
      openDemo: "open demo ↗",
      uiCaption: "user interface",
      flowLabel: "Architecture & Process Flow",
      kindLabels: {
        input: "input",
        process: "process",
        decision: "decision",
        output: "output",
      },
    },
    notFound: {
      routeNotFound: "bash: cd: /404-route: No such file or directory",
      error404:
        "# error 404: the page you are looking for does not exist on this system",
      backHome: "Back to home",
    },
  },
};
