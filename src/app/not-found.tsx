import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.screen}>
      <div className={styles.box}>
        <p className={styles.line}>
          <span className={styles.prompt}>jcamilo@dev:~/cali$</span>cd /404-ruta
        </p>
        <p className={styles.error}>
          bash: cd: /404-ruta: No existe el archivo o directorio
        </p>
        <p className={styles.dim}>
          # error 404: la página que buscas no se encuentra en el sistema
        </p>
      </div>

      <Link href="/" className={styles.back}>
        <span aria-hidden="true">←</span> Volver al inicio
        <span className={styles.cmd} aria-hidden="true">
          cd ~
        </span>
      </Link>
    </main>
  );
}
