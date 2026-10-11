"use client";

import { useLanguage } from "@/context/LanguageContext";
import styles from "./FlowView.module.css";
import type { FlowGraph } from "@/lib/types";

export default function FlowView({ flow }: { flow: FlowGraph }) {
  const { t } = useLanguage();
  const labelOf = (id: string) =>
    flow.steps.find((s) => s.id === id)?.label ?? id;

  return (
    <ol className={styles.flow} aria-label={t.detail.flowLabel}>
      {flow.steps.map((s) => (
        <li
          key={s.id}
          className={`${styles.step} ${s.kind === "decision" ? styles.decision : ""}`}
        >
          <span className={styles.kind}>{t.detail.kindLabels[s.kind]}</span>
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
