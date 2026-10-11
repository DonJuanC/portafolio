import type { Locale } from "./i18n";

export interface PlaylistInfo {
  id: string;
  slug: string;
  title: string;
  description: Record<Locale, string>;
  aliases: string[];
}

export const SPOTIFY_PROFILE_URL =
  "https://open.spotify.com/user/12165616926?si=9eb1505f9d204eef";

export const PLAYLISTS: PlaylistInfo[] = [
  {
    id: "1eil5DN13vMyGAhqTHZk9b",
    slug: "rumba-con-criterio",
    title: "Rumba con criterio",
    description: {
      es: "Salsa brava, golpe y criterio sonoro para la pista.",
      en: "Hard salsa, groove, and authentic dancefloor character.",
    },
    aliases: ["rumba", "salsa", "criterio"],
  },
  {
    id: "4OQTpuxWKoRvu98YOy9Xs7",
    slug: "agua-mar-y-rio",
    title: "Agua (mar y río)",
    description: {
      es: "Corrientes sonoras, fluidez y frecuencias del Pacífico y el trópico.",
      en: "Fluid soundscapes, coastal rhythms, and river currents.",
    },
    aliases: ["agua", "mar", "rio"],
  },
  {
    id: "6z72EOaA127mFo9CUcuaEv",
    slug: "bright-music",
    title: "Bright music for dark times",
    description: {
      es: "Sonidos luminosos y texturas para elevar el ánimo en momentos densos.",
      en: "Luminous tracks and textures to lift spirits in dense times.",
    },
    aliases: ["bright", "dark-times"],
  },
  {
    id: "4JBcpfh1uRLNz3oWj3Yda0",
    slug: "michi",
    title: "Acompáñame a la casa, olvidé darle comida al michi",
    description: {
      es: "El soundtrack del regreso nocturno, calidez y urgencia gatuna.",
      en: "Late walk home soundtrack, warmth, and hungry cat priority.",
    },
    aliases: ["michi", "casa", "comida", "gato", "acompaname"],
  },
  {
    id: "0s14siuRn4H623Q4ziBXev",
    slug: "baladas-espanol",
    title: "Ese popcito y esas baladas de antes en español",
    description: {
      es: "Joyas clásicas del pop y baladas memorables en español.",
      en: "Timeless Spanish pop gems and vintage ballads.",
    },
    aliases: ["baladas", "pop", "espanol"],
  },
  {
    id: "1rgXwu0NOdyt5uLGxl16NU",
    slug: "reggaeton-ares",
    title: "reggaeton que uno bajaba de Ares",
    description: {
      es: "Nostalgia pura de los 2000s, MP3s comprimidos y clásicos de marquesina.",
      en: "Pure 2000s nostalgia, compressed MP3s, and classic old-school perreo.",
    },
    aliases: ["reggaeton", "ares", "old-school"],
  },
  {
    id: "16fignenlvgV9xkGISiXEi",
    slug: "mueve-el-bote",
    title: "Mueve el bote",
    description: {
      es: "Ritmo imparable para soltar el cuerpo y entrar en movimiento.",
      en: "Unstoppable rhythm to get moving and shake off inertia.",
    },
    aliases: ["bote", "mueve"],
  },
];

export function findPlaylist(query: string): PlaylistInfo | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return PLAYLISTS.find(
    (p) =>
      p.id === q ||
      p.slug === q ||
      p.title.toLowerCase().includes(q) ||
      p.aliases.some((a) => a === q),
  );
}
