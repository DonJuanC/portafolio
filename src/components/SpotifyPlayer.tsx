"use client";

import { useState } from "react";
import { PLAYLISTS, SPOTIFY_PROFILE_URL, type PlaylistInfo } from "@/content/music";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./SpotifyPlayer.module.css";

interface SpotifyPlayerProps {
  initialPlaylistId?: string;
}

export default function SpotifyPlayer({ initialPlaylistId }: SpotifyPlayerProps) {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  const initial =
    PLAYLISTS.find((p) => p.id === initialPlaylistId || p.slug === initialPlaylistId) ??
    PLAYLISTS[0];

  const [active, setActive] = useState<PlaylistInfo>(initial);
  const [showEmbed, setShowEmbed] = useState(false);

  return (
    <div className={styles.container} role="region" aria-label="Curaduría sonora">
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.titleRow}>
            <span>🎧 DONJUANCELEKTOR</span>
            <span className={styles.badge}>Música con Criterio</span>
          </div>
          <p className={styles.subtitle}>
            {isEn
              ? "Handcrafted audio curation · Zero algorithmic shuffle"
              : "Curaduría sonora artesanal · Cero shuffle algorítmico"}
          </p>
        </div>
      </header>

      <p className={styles.intro}>
        {isEn
          ? "A curated showcase of 7 thematic playlists to explore (from many more living in my personal library). Each carries its own context, memory, and purpose:"
          : "Una muestra curada de 7 playlists temáticas para explorar (de muchas más que rotan en mi biblioteca personal). Cada una tiene su propio contexto, memoria y razón de ser:"}
      </p>

      {/* Listado editorial de las 7 playlists */}
      <div className={styles.playlistList}>
        {PLAYLISTS.map((p, index) => {
          const numberLabel = `[0${index + 1}]`;
          const spotifyUrl = `https://open.spotify.com/playlist/${p.id}`;
          return (
            <article key={p.id} className={styles.playlistCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleWrapper}>
                  <span className={styles.cardIndex}>{numberLabel}</span>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                </div>
                <a
                  href={spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.openLink}
                  title={`${isEn ? "Open" : "Abrir"} ${p.title} ${isEn ? "on Spotify" : "en Spotify"}`}
                >
                  {isEn ? "Open in Spotify" : "Abrir en Spotify"} ↗
                </a>
              </div>
              <p className={styles.cardDesc}>{p.description[locale]}</p>
              <span className={styles.cmdHint}>
                $ spotify {p.slug}
              </span>
            </article>
          );
        })}
      </div>

      {/* Invitación al catálogo completo */}
      <div className={styles.catalogInvite}>
        <div className={styles.inviteText}>
          <h4 className={styles.inviteTitle}>
            {isEn
              ? "Looking for more sound explorations?"
              : "¿Buscas más exploraciones sonoras?"}
          </h4>
          <p className={styles.inviteDesc}>
            {isEn
              ? "These 7 are just the showcase. My Spotify profile houses many more thematic selections, vinyl sessions, and ongoing rotations."
              : "Estas 7 son solo la muestra. En mi perfil de Spotify guardo muchas más selecciones temáticas, rescates de vinilo y rotaciones continuas."}
          </p>
        </div>
        <a
          href={SPOTIFY_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.profileBtn}
          title={isEn ? "Follow DonJuanCelektor on Spotify" : "Seguir a DonJuanCelektor en Spotify"}
        >
          {isEn ? "Follow on Spotify" : "Seguir en Spotify"} ↗
        </a>
      </div>

      {/* Opción no invasiva para montar el reproductor web */}
      <section className={styles.embedGate} aria-label="Reproductor web opcional">
        <div className={styles.gateHeader}>
          <h4 className={styles.gateTitle}>
            {isEn ? "In-browser web player (optional)" : "Reproductor web embebido (opcional)"}
          </h4>
        </div>
        <p className={styles.gateNotice}>
          {isEn ? (
            <>
              <strong>Technical notice:</strong> Per Spotify platform rules, in-browser playback requires an active login to <code>open.spotify.com</code> in this browser. If you are not logged in, we recommend using the direct links above to open the music cleanly in your Spotify app.
            </>
          ) : (
            <>
              <strong>Aviso técnico:</strong> Por políticas de Spotify, la reproducción dentro del navegador requiere tener sesión iniciada en <code>open.spotify.com</code> en este navegador. Si no tienes sesión, te recomendamos usar los enlaces directos de arriba para abrir tu aplicación de Spotify.
            </>
          )}
        </p>

        <button
          type="button"
          onClick={() => setShowEmbed((prev) => !prev)}
          className={`${styles.toggleBtn} ${showEmbed ? styles.toggleBtnActive : ""}`}
        >
          {showEmbed
            ? (isEn ? "✕ Hide web player" : "✕ Ocultar reproductor web")
            : (isEn ? "▶ Load web player (I'm logged in)" : "▶ Cargar reproductor web (tengo sesión)")}
        </button>

        {showEmbed && (
          <div className={styles.embedArea}>
            <p className={styles.selectorLabel}>
              {isEn ? "Select playlist to load:" : "Elige la playlist a cargar:"}
            </p>
            <div className={styles.chips} role="tablist" aria-label="Playlists embebidas">
              {PLAYLISTS.map((p) => {
                const isSelected = p.id === active.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`${styles.chip} ${isSelected ? styles.chipActive : ""}`}
                    onClick={() => setActive(p)}
                  >
                    {isSelected ? "▶ " : ""}
                    {p.title}
                  </button>
                );
              })}
            </div>

            <div className={styles.embedWrapper}>
              <iframe
                key={active.id}
                className={styles.iframe}
                src={`https://open.spotify.com/embed/playlist/${active.id}?utm_source=generator&theme=0`}
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`Spotify: ${active.title}`}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
