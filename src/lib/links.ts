export const GITHUB = "https://github.com/DonJuanC";
export const LINKEDIN =
  "https://www.linkedin.com/in/juancamilo-castellanos-uribe";
export const SPOTIFY_PROFILE =
  "https://open.spotify.com/user/12165616926?si=9eb1505f9d204eef";

// Componentes protegidos contra scrapers automáticos en HTML estático
const USER = "dev.jcamcasteur";
const DOMAIN = "gmail.com";

export function getContactEmail(): string {
  return `${USER}@${DOMAIN}`;
}

export function getMailtoUrl(): string {
  return `mailto:${getContactEmail()}`;
}

export const EMAIL_DISPLAY_OBFUSCATED = `${USER} [arroba] ${DOMAIN}`;

