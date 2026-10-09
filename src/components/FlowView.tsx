import styles from "./FlowView.module.css";
import type { FlowGraph, FlowKind } from "@/lib/types";

const kindLabel: Record<FlowKind, string> = {
  input: "entrada",
  process: "proceso",
  decision: "decisión",
  output: "salida",
};

export default function FlowView({ flow }: { flow: FlowGraph }) {
  const labelOf = (id: string) =>
    flow.steps.find((s) => s.id === id)?.label ?? id;

  return (
    <ol className={styles.flow} aria-label="Flujo del proceso">
      {flow.steps.map((s) => (
        <li
          key={s.id}
          className={`${styles.step} ${s.kind === "decision" ? styles.decision : ""}`}
        >
          <span className={styles.kind}>{kindLabel[s.kind]}</span>
          <p className={styles.label}>{s.label}</p>
          {s.detail && <p className={styles.detail}>{s.detail}</p>}

          {s.then && (
            <ul className={styles.branches}>
              {s.then.map((b) => (
                <li key={b.to}>
                  {b.when && `${b.when} `}→ {labelOf(b.to)}
                </li>
              ))}
            </ul>
          )}

          {flow.highlight?.stepId === s.id && (
            <p className={styles.note}>{flow.highlight.note}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
