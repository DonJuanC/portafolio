import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "axora",
    name: "AXORA",
    featured: true,
    tag: "el más robusto",
    status: "deployed",
    tagline:
      "Billetera digital multi-moneda para viajeros y nómadas digitales, con asistente de IA.",
    summary:
      "Permite tener saldos en seis monedas (USD, EUR, ARS, COP, MXN y BRL), cargar fondos, transferir entre usuarios, cambiar de moneda con la cotización del momento y ver el historial de tasas. Un asistente con Gemini propone las operaciones y espera confirmación antes de ejecutarlas.",
    role: "Desarrollador full stack, con foco en backend, revisión de código y coordinación técnica.",
    team: "3 full stack",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Node.js",
      "Express",
      "PostgreSQL (Neon)",
      "JWT + bcrypt",
      "Swagger/OpenAPI",
      "Google Gemini",
      "AWS SES",
      "Vitest",
      "Vercel",
      "Render",
    ],
    links: [
      {
        label: "frontend",
        url: "https://github.com/axoratechgroup/axora-frontend",
      },
      {
        label: "backend",
        url: "https://github.com/axoratechgroup/axora-backend",
      },
      {
        label: "demo",
        url: "https://axora-frontend-five.vercel.app/",
      },
    ],

    image: {
      src: "/projects/axora.svg",
      alt: "Interfaz de la billetera digital multi-moneda AXORA con asistente de IA",
      caption: "Billetera multi-moneda con asistente conversacional sobre Gemini",
    },

    flow: {
      steps: [
        {
          id: "pedido",
          kind: "input",
          label: "La persona pide cambiar de moneda",
          detail: "Monto y par de monedas, con sesión autenticada (JWT)",
        },
        {
          id: "bloqueo",
          kind: "process",
          label: "Abre una transacción y bloquea los dos saldos",
          detail: "Bloqueo de filas ordenado para evitar condiciones de carrera",
        },
        {
          id: "saldo",
          kind: "decision",
          label: "¿Alcanza el saldo?",
          then: [
            { to: "cache", when: "sí" },
            { to: "rechazo", when: "no" },
          ],
        },
        {
          id: "cache",
          kind: "decision",
          label: "¿Hay una tasa vigente en caché?",
          detail: "Guardada en PostgreSQL, vigente por 60 minutos",
          then: [
            { to: "comision", when: "sí" },
            { to: "api", when: "no" },
          ],
        },
        {
          id: "api",
          kind: "decision",
          label: "¿Responde la API de cotizaciones?",
          detail: "Con tiempo máximo de espera de 5 segundos",
          then: [
            { to: "comision", when: "sí, y guarda la tasa" },
            { to: "respaldo", when: "no" },
          ],
        },
        {
          id: "respaldo",
          kind: "process",
          label: "Usa la última tasa conocida",
          detail: "Si tampoco existe, una tabla estática de contingencia",
        },
        {
          id: "comision",
          kind: "process",
          label: "Aplica la tasa y descuenta la comisión",
          detail: "0,3 % sobre el monto convertido",
        },
        {
          id: "registro",
          kind: "output",
          label: "Confirma el cambio y registra el movimiento",
          detail: "Saldos antes y después, tasa aplicada y comisión; el correo sale por una cola aparte",
        },
        {
          id: "rechazo",
          kind: "output",
          label: "Rechaza el cambio y deshace todo",
        },
      ],
      highlight: {
        stepId: "respaldo",
        note: "Si el proveedor de tasas se cae, el cambio no se detiene: hay tres niveles de respaldo antes de fallar.",
      },
    },
  },
  {
    slug: "reciclave",
    name: "Reciclá, ve",
    featured: true,
    tag: "el más reciente",
    status: "deployed",
    tagline:
      "IA + BD que indica cómo separar un residuo según las normas de Colombia.",
    summary:
      "Reciclá, ve te dice en qué caneca va lo que vas a botar, según el código de colores de Colombia. Lo que más me costó fue decidir cuándo no usar la IA: primero busca en una base de 50 residuos que clasifiqué a mano contra la norma, y solo le pregunta al modelo cuando esa base no alcanza. Los cortes de similitud los calibré con 19 consultas de prueba, y esas respuestas llevan un aviso de 'no verificado'.",
    role: "Proyecto individual",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "PostgreSQL + pgvector (Neon)",
      "Gemini API",
      "Zod",
      "Vercel",
    ],
    links: [
      {
        label: "demo",
        url: "https://reciclave.vercel.app",
      },
      {
        label: "repositorio",
        url: "https://github.com/DonJuanC/reciclave",
      },
    ],

    image: {
      src: "/projects/reciclave.svg",
      alt: "Interfaz de Reciclá, ve con clasificación normativa de residuos",
      caption: "Búsqueda semántica sobre base curada de residuos y código de colores",
    },

    flow: {
      steps: [
        {
          id: "entrada",
          kind: "input",
          label: "La persona escribe qué va a botar",
        },
        {
          id: "embedding",
          kind: "process",
          label: "El texto se convierte en un embedding",
          detail: "Con Gemini",
        },
        {
          id: "busqueda",
          kind: "process",
          label: "Búsqueda por similitud coseno en la base curada",
          detail: "pgvector sobre 50 residuos clasificados a mano contra la norma",
        },
        {
          id: "directa",
          kind: "decision",
          label: "¿Similitud de 0,77 o más y sin ambigüedad?",
          detail: "El segundo resultado está a 0,05 o más, o es de la misma caneca",
          then: [
            { to: "base", when: "sí" },
            { to: "dudosa", when: "no" },
          ],
        },
        {
          id: "dudosa",
          kind: "decision",
          label: "¿Similitud de 0,70 o más?",
          then: [
            { to: "candidatos", when: "sí" },
            { to: "norma", when: "no" },
          ],
        },
        {
          id: "base",
          kind: "output",
          label: "Responde desde la base curada",
          detail: "Con la fuente normativa",
        },
        {
          id: "candidatos",
          kind: "process",
          label: "Gemini decide con los candidatos de la base",
          detail: "Respuesta con esquema JSON fijo",
        },
        {
          id: "norma",
          kind: "process",
          label: "Gemini clasifica solo con las reglas de la norma",
          detail: "Respuesta con esquema JSON fijo",
        },
        {
          id: "aviso",
          kind: "output",
          label: "Responde con aviso «no verificado»",
        },
      ],
      highlight: {
        stepId: "directa",
        note: "La similitud sola no basta: un residuo ausente puede puntuar casi igual que un acierto débil. Lo que lo delata es la poca diferencia entre el primer y el segundo resultado.",
      },
    },
  },
  {
    slug: "lotr-chat",
    name: "El Chat de la Tierra Media",
    featured: true,
    tag: "por pasión",
    status: "deployed",
    tagline:
      "Chatea con siete personajes de la Tierra Media, cada uno con su propia personalidad.",
    summary:
      "SPA para conversar con Gandalf, Gollum, Aragorn, Bilbo, Legolas, Gimli y Saruman sobre Google Gemini. Cada personaje tiene su propio system prompt, su historia y sugerencias para arrancar la conversación. El enrutamiento es propio, con History API, las conversaciones se guardan en el navegador y la API key de Gemini nunca llega al frontend porque las llamadas pasan por una función serverless.",
    role: "Proyecto individual",
    stack: [
      "JavaScript (sin frameworks)",
      "CSS puro",
      "History API",
      "Google Gemini (@google/genai)",
      "Vercel Functions como proxy",
      "Vitest",
      "Vercel",
    ],
    links: [
      { label: "demo", url: "https://lotr-chat.vercel.app" },
      { label: "repositorio", url: "https://github.com/DonJuanC/lotr-chat" },
    ],

    image: {
      src: "/projects/lotr-chat.svg",
      alt: "Interfaz de El Chat de la Tierra Media con personajes y proxy Gemini",
      caption: "SPA con enrutamiento History API y proxy serverless para API key",
    },

    flow: {
      steps: [
        {
          id: "mensaje",
          kind: "input",
          label: "La persona le escribe a un personaje",
          detail: "Gandalf, Gollum, Aragorn, Bilbo, Legolas, Gimli o Saruman",
        },
        {
          id: "peticion",
          kind: "process",
          label: "El navegador envía la conversación a una función serverless",
          detail: "La API key de Gemini nunca sale del servidor",
        },
        {
          id: "valida",
          kind: "decision",
          label: "¿La solicitud es válida?",
          detail: "Método POST, personaje existente y mensaje presente",
          then: [
            { to: "gemini", when: "sí" },
            { to: "rechazo", when: "no" },
          ],
        },
        {
          id: "gemini",
          kind: "process",
          label: "Gemini responde en el papel del personaje",
          detail: "System prompt propio, historial de la conversación y máximo de 500 tokens",
        },
        {
          id: "respondio",
          kind: "decision",
          label: "¿Respondió Gemini?",
          then: [
            { to: "guardar", when: "sí" },
            { to: "fallo", when: "no" },
          ],
        },
        {
          id: "guardar",
          kind: "output",
          label: "Muestra la respuesta y guarda la conversación en el navegador",
          detail: "Una historia por personaje",
        },
        {
          id: "fallo",
          kind: "output",
          label: "Muestra el error con su código HTTP",
          detail: "Si es 429 (cuota agotada), con un mensaje claro",
        },
        {
          id: "rechazo",
          kind: "output",
          label: "Rechaza la solicitud con un 400",
        },
      ],
      highlight: {
        stepId: "peticion",
        note: "El navegador nunca habla directo con Gemini: la key vive solo en el servidor.",
      },
    },
  },
  {
    slug: "geekeame-store",
    name: "Geekeame",
    featured: true,
    tag: "modelo e-commerce",
    status: "deployed",
    tagline:
      "Tienda de merchandising geek con catálogo, carrito, checkout y panel de administración.",
    summary:
      "E-commerce full stack para una tienda de nicho: pines, stickers, pósters, llaveros y tazas. Tiene dos roles, cliente y administrador. El cliente busca, compra, deja reseñas y marca favoritos; el administrador gestiona productos, pedidos, usuarios y ve analítica de ventas. Las imágenes de producto se suben a S3 con URLs prefirmadas desde una función serverless.",
    role: "Proyecto individual",
    stack: [
      "React 19",
      "React Router 7",
      "TypeScript",
      "Vite",
      "Tailwind CSS 4",
      "Firebase (Auth + Firestore)",
      "AWS S3",
      "Vercel Functions",
      "Vitest + Testing Library",
      "Vercel",
    ],
    links: [
      { label: "demo", url: "https://geekeame-store.vercel.app" },
      {
        label: "repositorio",
        url: "https://github.com/DonJuanC/geekeame-store",
      },
    ],

    image: {
      src: "/projects/geekeame-store.svg",
      alt: "Interfaz de catálogo y checkout transaccional de Geekeame",
      caption: "Tienda e-commerce con transacción atómica en Firestore y subida a S3",
    },

    flow: {
      steps: [
        {
          id: "compra",
          kind: "input",
          label: "La persona confirma su compra",
          detail: "Con sesión iniciada y el carrito con productos",
        },
        {
          id: "transaccion",
          kind: "process",
          label: "Se abre una transacción en Firestore y se leen los productos",
          detail: "Con un límite de 20 segundos",
        },
        {
          id: "stock",
          kind: "decision",
          label: "¿Hay stock de todos los productos?",
          then: [
            { to: "descuento", when: "sí" },
            { to: "agotado", when: "no" },
          ],
        },
        {
          id: "descuento",
          kind: "process",
          label: "Se descuenta el stock de cada producto",
        },
        {
          id: "orden",
          kind: "output",
          label: "Se crea la orden en estado pendiente",
        },
        {
          id: "agotado",
          kind: "output",
          label: "Se cancela todo y se avisa qué producto ya no alcanza",
          detail: "Con las unidades disponibles",
        },
      ],
      highlight: {
        stepId: "stock",
        note: "Leer, validar y descontar ocurre en una sola transacción: dos compras a la vez no pueden vender la misma unidad.",
      },
    },
  },
  {
    slug: "watchlist-con-criterio",
    name: "Watchlist con Criterio",
    featured: false,
    status: "in-progress",
    tagline:
      "Grafo de conexiones entre películas: mismo director y afinidad semántica.",
    summary:
      "Explorador de cine que conecta películas por autoría y por afinidad de tema y tono, calculada con embeddings, en lugar de agruparlas por género. Se navega como un grafo y admite búsqueda en lenguaje natural.",
    role: "Proyecto individual",
    stack: [
      "React",
      "react-force-graph-2d",
      "Zustand",
      "Node.js",
      "Express",
      "PostgreSQL + pgvector (Neon)",
      "Gemini Embeddings",
      "TMDB API",
      "Vercel",
      "Render",
    ],
    links: [
      { label: "demo", url: "https://frontend-juan-selector.vercel.app" },
      {
        label: "repositorio",
        url: "https://github.com/DonJuanC/watchlist-con-criterio",
      },
    ],

    image: {
      src: "/projects/watchlist-con-criterio.svg",
      alt: "Grafo semántico de películas de Watchlist con Criterio",
      caption: "Explorador de cine con grafo semántico sobre embeddings y pgvector",
    },

    flow: {
      steps: [
        {
          id: "ingesta",
          kind: "input",
          label: "Se toman los títulos de TMDB",
          detail: "Director, género, sinopsis y póster",
        },
        {
          id: "embedding",
          kind: "process",
          label: "Cada película se convierte en un embedding",
          detail: "Vector de 768 dimensiones con Gemini, a partir de título, géneros y sinopsis",
        },
        {
          id: "almacen",
          kind: "process",
          label: "Se guarda en PostgreSQL con pgvector",
          detail: "Índice HNSW para vecinos más cercanos",
        },
        {
          id: "aristas",
          kind: "process",
          label: "Se calculan las conexiones",
          detail: "Mismo director, y los dos vecinos más cercanos con similitud mínima de 0,65",
        },
        {
          id: "grafo",
          kind: "output",
          label: "El grafo se dibuja y se navega",
          detail: "react-force-graph-2d en canvas, con filtros del lado del cliente",
        },
      ],
    },
  },
  {
    slug: "taskflow",
    name: "TaskFlow",
    featured: false,
    status: "deployed",
    tagline:
      "Gestor de tareas con login, drag & drop y resumen por correo.",
    summary:
      "SPA de tareas con registro, login con correo y con Google, filtros, prioridad, fecha de vencimiento y reordenamiento por arrastre. Los datos viven en Firestore y el resumen por correo sale por AWS SES desde una función serverless. Proyecto integrador del bootcamp de Henry.",
    role: "Proyecto individual",
    stack: [
      "React 19",
      "TypeScript",
      "Vite",
      "Firebase (Auth + Firestore)",
      "dnd-kit",
      "AWS SES",
      "Vitest + Testing Library",
      "Vercel",
    ],
    links: [
      { label: "demo", url: "https://taskflow-smoky-sigma.vercel.app" },
      { label: "repositorio", url: "https://github.com/DonJuanC/taskflow" },
    ],
    image: {
      src: "/projects/taskflow.svg",
      alt: "Tablero kanban drag and drop de TaskFlow",
      caption: "Gestor de tareas con drag & drop y notificaciones por AWS SES",
    },
  },
];
