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
      es: "Salsa brava, montuno pesado, vinilo y golpe. Cero complacencia algorítmica: sonido crudo para bailar con juicio y sabor de barrio.",
      en: "Heavy salsa dura, raw groove, and vinyl grit. Zero algorithm compromise: music to dance with intention and soul.",
    },
    aliases: ["rumba", "salsa", "criterio"],
  },
  {
    id: "4OQTpuxWKoRvu98YOy9Xs7",
    slug: "agua-mar-y-rio",
    title: "Agua (mar y río)",
    description: {
      es: "Sonoridades fluidas, marimba, afro-diáspora y corrientes del Pacífico. Música que fluye fresca como río bajando a la marea.",
      en: "Fluid sonorities, marimba, African diaspora, and Pacific coastal currents. Music that flows like cool river water into the ocean.",
    },
    aliases: ["agua", "mar", "rio"],
  },
  {
    id: "6z72EOaA127mFo9CUcuaEv",
    slug: "bright-music",
    title: "Bright music for dark times",
    description: {
      es: "Texturas luminosas, sintes reconfortantes y melodías que abrazan. Canciones para cuando el día se pone denso y hace falta luz.",
      en: "Luminous synth textures and uplifting melodies to warm the soul when times get heavy and light is scarce.",
    },
    aliases: ["bright", "dark-times"],
  },
  {
    id: "4JBcpfh1uRLNz3oWj3Yda0",
    slug: "michi",
    title: "Acompáñame a la casa, olvidé darle comida al michi",
    description: {
      es: "El soundtrack de esa caminata nocturna de vuelta: calidez, paso apurado, nostalgia y la tierna urgencia de llegar a alimentar al gato.",
      en: "The soundtrack for that late-night walk back home: warmth, hurried steps, gentle nostalgia, and the urgent priority of feeding the cat.",
    },
    aliases: ["michi", "casa", "comida", "gato", "acompaname"],
  },
  {
    id: "0s14siuRn4H623Q4ziBXev",
    slug: "baladas-espanol",
    title: "Ese popcito y esas baladas de antes en español",
    description: {
      es: "Baladas de oro, pop noventero y joyas que se cantan a todo pulmón. Canciones con las que crecimos y que envejecieron con honra.",
      en: "Golden Latin pop, 90s ballads, and vintage gems meant to be sung out loud. Classics that aged with dignity and memory.",
    },
    aliases: ["baladas", "pop", "espanol"],
  },
  {
    id: "1rgXwu0NOdyt5uLGxl16NU",
    slug: "reggaeton-ares",
    title: "reggaeton que uno bajaba de Ares",
    description: {
      es: "El perreo de marquesina, pistas comprimidas a 128 kbps y nostalgia pura de cyber café. Los himnos pioneros de la época dorada.",
      en: "Early 2000s underground reggaeton, 128 kbps MP3 nostalgia, and cyber-café golden era anthems.",
    },
    aliases: ["reggaeton", "ares", "old-school"],
  },
  {
    id: "16fignenlvgV9xkGISiXEi",
    slug: "mueve-el-bote",
    title: "Mueve el bote",
    description: {
      es: "Funk, disco, sabrosura y beats imparables para sacudirse el cansancio. Imposible escucharla sentado frente al código sin marcar el paso.",
      en: "Funk, disco, and infectious rhythms to shake off inertia. Strictly impossible to listen while sitting still.",
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
