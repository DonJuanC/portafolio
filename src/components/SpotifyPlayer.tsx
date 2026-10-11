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
        <a
          href={SPOTIFY_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.profileLink}
          title={isEn ? "Open DonJuanCelektor profile on Spotify" : "Abrir perfil de DonJuanCelektor en Spotify"}
        >
          {isEn ? "Spotify Profile" : "Perfil Spotify"} ↗
        </a>
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
            ? "💡 Click ▶ on any track below to play its 30s preview."
            : "💡 Haz clic en ▶ en cualquier tema abajo para escuchar su preview de 30s."}
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
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`Spotify: ${active.title}`}
        />
      </div>
    </div>
  );
}
