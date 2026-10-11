import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";

import { GITHUB, LINKEDIN } from "@/lib/links";
import { LanguageProvider } from "@/context/LanguageContext";

const TITLE = "JCamilo Castellanos · Full Stack Developer";
const DESCRIPTION =
  "Portafolio de JCamilo Castellanos: desarrollador Full Stack con mirada de ingeniero industrial. Cali, Colombia.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · JCamilo Castellanos" },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "JCamilo Castellanos",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "JCamilo Castellanos",
      jobTitle: "Full Stack Developer",
      description: DESCRIPTION,
      url: SITE_URL,
      sameAs: [GITHUB, LINKEDIN],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cali",
        addressCountry: "CO",
      },
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Tailwind CSS",
        "Google Gemini",
        "Full Stack Development",
        "Ingeniería Industrial",
      ],
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: TITLE,
      about: { "@id": `${SITE_URL}/#person` },
      inLanguage: "es-CO",
    },
  ],
};

const mono = localFont({
  src: [
    {
      path: "./fonts/JetBrainsMono-Regular.woff2",
      style: "normal",
    },
    {
      path: "./fonts/JetBrainsMono-Italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={mono.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;var l=localStorage.getItem("portfolio_lang");if(l==="en"||l==="es")document.documentElement.lang=l}catch(e){}`,
          }}
        />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
