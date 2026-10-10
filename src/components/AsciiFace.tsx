"use client";

import { useEffect, useState } from "react";
import styles from "./AsciiFace.module.css";

export default function AsciiFace() {
  const [text, setText] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/face.txt")
      .then((r) =>
        r.ok ? r.text() : Promise.reject(new Error(String(r.status))),
      )
      .then((t) => alive && setText(t))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  if (failed) return <p>error: no pude cargar el retrato</p>;
  if (text === null) return <p>revelando...</p>;

  return (
    <figure className={styles.frame}>
      <pre
        className={styles.art}
        role="img"
        aria-label="Retrato en ASCII de JCamilo"
      >
        {text}
      </pre>
    </figure>
  );
}
