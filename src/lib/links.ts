export const GITHUB = "https://github.com/DonJuanC";
export const LINKEDIN =
  "https://www.linkedin.com/in/juancamilo-castellanos-uribe";

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

