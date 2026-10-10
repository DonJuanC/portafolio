import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: "2rem" }}>
      <p>
        <span style={{ color: "var(--accent)" }}>jcamilo@dev:~/cali$</span> cd
        /esa-ruta
      </p>
      <p>bash: cd: /esa-ruta: No existe el archivo o directorio</p>
      <p>
        <Link href="/">← volver al inicio</Link>
      </p>
    </main>
  );
}
