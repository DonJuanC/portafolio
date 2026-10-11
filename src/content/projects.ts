import type { Locale } from "./i18n";
import type { Project } from "@/lib/types";

export const projectsEs: Project[] = [
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

export const projectsEn: Project[] = [
  {
    slug: "axora",
    name: "AXORA",
    featured: true,
    tag: "most robust",
    status: "deployed",
    tagline:
      "Multi-currency digital wallet for travelers and digital nomads, powered by an AI assistant.",
    summary:
      "Enables balances in six currencies (USD, EUR, ARS, COP, MXN, and BRL), wallet funding, peer-to-peer transfers, real-time FX exchange, and rate history. A Gemini-powered assistant proposes operations and requires explicit user confirmation before executing.",
    role: "Full stack developer, focused on backend, code reviews, and technical coordination.",
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
      alt: "AXORA multi-currency digital wallet interface with conversational AI assistant",
      caption: "Multi-currency wallet with conversational assistant on Gemini",
    },

    flow: {
      steps: [
        {
          id: "pedido",
          kind: "input",
          label: "User requests currency exchange",
          detail: "Amount and currency pair, authenticated session (JWT)",
        },
        {
          id: "bloqueo",
          kind: "process",
          label: "Opens transaction and locks both balances",
          detail: "Ordered row-level locking to prevent race conditions",
        },
        {
          id: "saldo",
          kind: "decision",
          label: "Sufficient balance?",
          then: [
            { to: "cache", when: "yes" },
            { to: "rechazo", when: "no" },
          ],
        },
        {
          id: "cache",
          kind: "decision",
          label: "Valid rate in cache?",
          detail: "Stored in PostgreSQL, TTL 60 minutes",
          then: [
            { to: "comision", when: "yes" },
            { to: "api", when: "no" },
          ],
        },
        {
          id: "api",
          kind: "decision",
          label: "Does FX rate API respond?",
          detail: "5-second timeout limit",
          then: [
            { to: "comision", when: "yes, stores rate" },
            { to: "respaldo", when: "no" },
          ],
        },
        {
          id: "respaldo",
          kind: "process",
          label: "Use last known rate",
          detail: "If none exists, falls back to a static contingency table",
        },
        {
          id: "comision",
          kind: "process",
          label: "Applies exchange rate and deducts fee",
          detail: "0.3% fee on converted amount",
        },
        {
          id: "registro",
          kind: "output",
          label: "Confirms exchange and logs transaction",
          detail: "Balances before and after, applied rate and fee; notification queued asynchronously",
        },
        {
          id: "rechazo",
          kind: "output",
          label: "Rejects exchange and rolls back",
        },
      ],
      highlight: {
        stepId: "respaldo",
        note: "If the FX rate provider goes down, the exchange doesn't fail: three levels of fallback ensure resilience.",
      },
    },
  },
  {
    slug: "reciclave",
    name: "Reciclá, ve",
    featured: true,
    tag: "latest",
    status: "deployed",
    tagline:
      "AI + Database determining how to sort waste according to Colombian environmental regulations.",
    summary:
      "'Reciclá, ve' tells you which bin your waste belongs to, following Colombia's color-coded recycling standards. The biggest challenge was knowing when NOT to use AI: it first queries a curated database of 50 waste items hand-mapped to the law, only falling back to LLM inference when needed. Similarity thresholds were calibrated across 19 test queries, flagging borderline matches as 'unverified'.",
    role: "Solo project",
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
        label: "repository",
        url: "https://github.com/DonJuanC/reciclave",
      },
    ],

    image: {
      src: "/projects/reciclave.svg",
      alt: "Reciclá, ve interface with regulatory waste classification",
      caption: "Semantic search over curated waste database and color-coded bins",
    },

    flow: {
      steps: [
        {
          id: "entrada",
          kind: "input",
          label: "User enters item to dispose of",
        },
        {
          id: "embedding",
          kind: "process",
          label: "Text is converted into an embedding",
          detail: "Using Gemini",
        },
        {
          id: "busqueda",
          kind: "process",
          label: "Cosine similarity search over curated database",
          detail: "pgvector over 50 hand-classified items against regulations",
        },
        {
          id: "directa",
          kind: "decision",
          label: "Similarity >= 0.77 without ambiguity?",
          detail: "Runner-up is >= 0.05 away, or belongs to the same bin",
          then: [
            { to: "base", when: "yes" },
            { to: "dudosa", when: "no" },
          ],
        },
        {
          id: "dudosa",
          kind: "decision",
          label: "Similarity >= 0.70?",
          then: [
            { to: "candidatos", when: "yes" },
            { to: "norma", when: "no" },
          ],
        },
        {
          id: "base",
          kind: "output",
          label: "Answers from curated database",
          detail: "Includes regulatory citation",
        },
        {
          id: "candidatos",
          kind: "process",
          label: "Gemini decides using database candidates",
          detail: "Strict JSON schema response",
        },
        {
          id: "norma",
          kind: "process",
          label: "Gemini classifies strictly against regulatory rules",
          detail: "Strict JSON schema response",
        },
        {
          id: "aviso",
          kind: "output",
          label: "Returns answer with 'unverified' badge",
        },
      ],
      highlight: {
        stepId: "directa",
        note: "Similarity score alone is not enough: an absent item can score almost as high as a weak hit. The telltale sign is the tiny margin between first and second place.",
      },
    },
  },
  {
    slug: "lotr-chat",
    name: "Middle-earth Chat",
    featured: true,
    tag: "passion project",
    status: "deployed",
    tagline:
      "Chat with seven Middle-earth characters, each with their own distinct persona.",
    summary:
      "SPA to talk with Gandalf, Gollum, Aragorn, Bilbo, Legolas, Gimli, and Saruman powered by Google Gemini. Each character has a tailored system prompt, lore background, and conversation starter hooks. Custom History API routing, conversations stored client-side in the browser, and the Gemini API key stays safe behind a serverless proxy function.",
    role: "Solo project",
    stack: [
      "JavaScript (vanilla)",
      "Pure CSS",
      "History API",
      "Google Gemini (@google/genai)",
      "Vercel Functions as proxy",
      "Vitest",
      "Vercel",
    ],
    links: [
      { label: "demo", url: "https://lotr-chat.vercel.app" },
      { label: "repository", url: "https://github.com/DonJuanC/lotr-chat" },
    ],

    image: {
      src: "/projects/lotr-chat.svg",
      alt: "Middle-earth Chat interface with characters and Gemini proxy",
      caption: "SPA with History API routing and serverless proxy for API key security",
    },

    flow: {
      steps: [
        {
          id: "mensaje",
          kind: "input",
          label: "User sends a message to a character",
          detail: "Gandalf, Gollum, Aragorn, Bilbo, Legolas, Gimli, or Saruman",
        },
        {
          id: "peticion",
          kind: "process",
          label: "Browser sends conversation to serverless function",
          detail: "Gemini API key never leaves the server",
        },
        {
          id: "valida",
          kind: "decision",
          label: "Is request valid?",
          detail: "POST method, valid character, message present",
          then: [
            { to: "gemini", when: "yes" },
            { to: "rechazo", when: "no" },
          ],
        },
        {
          id: "gemini",
          kind: "process",
          label: "Gemini responds in character",
          detail: "Dedicated system prompt, chat history, 500 max tokens",
        },
        {
          id: "respondio",
          kind: "decision",
          label: "Did Gemini respond successfully?",
          then: [
            { to: "guardar", when: "yes" },
            { to: "fallo", when: "no" },
          ],
        },
        {
          id: "guardar",
          kind: "output",
          label: "Renders response and saves chat history locally",
          detail: "One persistent thread per character",
        },
        {
          id: "fallo",
          kind: "output",
          label: "Displays error with HTTP status code",
          detail: "Clear guidance for 429 rate limit exceeded",
        },
        {
          id: "rechazo",
          kind: "output",
          label: "Rejects request with HTTP 400",
        },
      ],
      highlight: {
        stepId: "peticion",
        note: "The browser never communicates directly with Gemini: the secret key lives strictly on the server.",
      },
    },
  },
  {
    slug: "geekeame-store",
    name: "Geekeame",
    featured: true,
    tag: "e-commerce model",
    status: "deployed",
    tagline:
      "Geek merch store featuring full catalog, cart, checkout, and admin dashboard.",
    summary:
      "Full stack e-commerce built for a niche shop: pins, stickers, posters, keychains, and mugs. Features two distinct roles: customer and admin. Customers browse, buy, leave reviews, and bookmark favorites; admins manage inventory, orders, users, and review sales analytics. Product images are uploaded directly to S3 via pre-signed URLs from a serverless function.",
    role: "Solo project",
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
        label: "repository",
        url: "https://github.com/DonJuanC/geekeame-store",
      },
    ],

    image: {
      src: "/projects/geekeame-store.svg",
      alt: "Geekeame catalog and transactional checkout interface",
      caption: "E-commerce store with atomic Firestore transactions and AWS S3 uploads",
    },

    flow: {
      steps: [
        {
          id: "compra",
          kind: "input",
          label: "Customer confirms order",
          detail: "Authenticated session with populated cart",
        },
        {
          id: "transaccion",
          kind: "process",
          label: "Opens Firestore transaction and reads inventory",
          detail: "20-second timeout limit",
        },
        {
          id: "stock",
          kind: "decision",
          label: "All products in stock?",
          then: [
            { to: "descuento", when: "yes" },
            { to: "agotado", when: "no" },
          ],
        },
        {
          id: "descuento",
          kind: "process",
          label: "Deducts stock for each item",
        },
        {
          id: "orden",
          kind: "output",
          label: "Creates order in pending status",
        },
        {
          id: "agotado",
          kind: "output",
          label: "Rolls back transaction and notifies out-of-stock item",
          detail: "Shows available units",
        },
      ],
      highlight: {
        stepId: "stock",
        note: "Read, validate, and deduct happen within a single atomic transaction: concurrent shoppers cannot buy the same unit.",
      },
    },
  },
  {
    slug: "watchlist-con-criterio",
    name: "Watchlist con Criterio",
    featured: false,
    status: "in-progress",
    tagline:
      "Movie connection graph: common director and semantic affinity.",
    summary:
      "Film discovery engine that connects movies by auteurship and semantic tone/thematic affinity calculated via embeddings, rather than rigid genres. Explored as an interactive graph with natural language semantic search.",
    role: "Solo project",
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
        label: "repository",
        url: "https://github.com/DonJuanC/watchlist-con-criterio",
      },
    ],

    image: {
      src: "/projects/watchlist-con-criterio.svg",
      alt: "Watchlist con Criterio semantic movie graph",
      caption: "Film explorer featuring semantic graph on top of embeddings and pgvector",
    },

    flow: {
      steps: [
        {
          id: "ingesta",
          kind: "input",
          label: "Titles ingested from TMDB",
          detail: "Director, genres, synopsis, and poster",
        },
        {
          id: "embedding",
          kind: "process",
          label: "Each movie is converted into an embedding",
          detail: "768-dimension vector via Gemini from title, genres, and synopsis",
        },
        {
          id: "almacen",
          kind: "process",
          label: "Stored in PostgreSQL with pgvector",
          detail: "HNSW index for fast nearest neighbors",
        },
        {
          id: "aristas",
          kind: "process",
          label: "Connections calculated",
          detail: "Same director, plus top 2 nearest neighbors with >= 0.65 similarity",
        },
        {
          id: "grafo",
          kind: "output",
          label: "Graph rendered and interactive",
          detail: "Canvas-based react-force-graph-2d with client-side filters",
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
      "Task manager featuring authentication, drag & drop, and email digests.",
    summary:
      "Task SPA with signup, email & Google authentication, filtering, priorities, due dates, and drag-and-drop reordering. Backed by Firestore, with email summaries delivered via AWS SES through a serverless function. Capstone project from Henry bootcamp.",
    role: "Solo project",
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
      { label: "repository", url: "https://github.com/DonJuanC/taskflow" },
    ],
    image: {
      src: "/projects/taskflow.svg",
      alt: "TaskFlow drag and drop kanban board",
      caption: "Task manager with drag & drop and AWS SES notifications",
    },
  },
];

export const projects: Project[] = projectsEs;

export function getProjects(locale: Locale = "es"): Project[] {
  return locale === "en" ? projectsEn : projectsEs;
}

export function getProject(slug: string, locale: Locale = "es"): Project | undefined {
  return getProjects(locale).find((p) => p.slug === slug);
}
