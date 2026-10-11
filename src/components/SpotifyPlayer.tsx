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

  return (
    <div className={styles.container} role="region" aria-label="Spotify Player">
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.titleRow}>
            <span>🎧 DONJUANCELEKTOR</span>
            <span className={styles.badge}>Música con Criterio</span>
          </div>
          <p className={styles.subtitle}>
            {isEn
              ? "Human sound curation · Zero algorithmic shuffle"
              : "Curaduría sonora humana · Cero shuffle algorítmico"}
          </p>
        </div>
        <div className={styles.headerLinks}>
          <a
            href={`https://open.spotify.com/playlist/${active.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
            title={isEn ? "Open playlist on Spotify" : "Abrir playlist en Spotify"}
          >
            {isEn ? "Open Playlist" : "Abrir Playlist"} ↗
          </a>
          <a
            href={SPOTIFY_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
            title={isEn ? "Open DonJuanCelektor profile on Spotify" : "Abrir perfil de DonJuanCelektor en Spotify"}
          >
            {isEn ? "Profile" : "Perfil"} ↗
          </a>
        </div>
      </header>

      <div>
        <p className={styles.selectorLabel}>
          {isEn ? "Select a curated playlist:" : "Elige una playlist curada:"}
        </p>
        <div className={styles.chips} role="tablist" aria-label="Curated playlists">
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
      </div>

      <div className={styles.activeInfo}>
        <h3 className={styles.playlistName}>{active.title}</h3>
        <p className={styles.playlistDesc}>{active.description[locale]}</p>
        <p className={styles.previewTip}>
          {isEn
            ? "💡 Click directly on a track below to play preview (requires active Spotify session in browser)."
            : "💡 Haz clic directamente en una canción abajo para escuchar el preview (requiere sesión iniciada en Spotify en este navegador)."}
        </p>
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
  );
}
