"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { complete, execute } from "@/lib/commands";
import OutputView from "./OutputView";
import styles from "./Terminal.module.css";
import type { HistoryEntry, ThemeMode } from "@/lib/types";

const PROMPT = "jcamilo@dev:~/cali$";
const SUGGESTED = ["help", "ls", "cat axora", "flow reciclave", "contact"];

function applyTheme(mode: ThemeMode): "dark" | "light" {
  const root = document.documentElement;
  const current = root.dataset.theme === "light" ? "light" : "dark";
  const next =
    mode === "toggle" ? (current === "dark" ? "light" : "dark") : mode;
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    // sin almacenamiento: el tema vale solo para esta visita
  }
  return next;
}

export default function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [recall, setRecall] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (history.length === 0) return;
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [history]);

  function run(raw: string) {
    const text = raw.trim();
    if (!text) return;

    if (text === "clear") {
      setHistory([]);
    } else {
      let output = execute(text);
      if (output.kind === "theme") {
        const next = applyTheme(output.mode);
        output = {
          kind: "text",
          lines: [`tema: ${next === "dark" ? "oscuro" : "claro"}`],
        };
      }
      const result = output;
      setHistory((prev) => [
        ...prev,
        {
          id: (prev[prev.length - 1]?.id ?? 0) + 1,
          input: text,
          output: result,
        },
      ]);
    }
    setInput("");
    setRecall(-1);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    run(input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const past = history.map((h) => h.input);

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (past.length === 0) return;
      const next = recall === -1 ? past.length - 1 : Math.max(0, recall - 1);
      setRecall(next);
      setInput(past[next] ?? "");
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (recall === -1) return;
      const next = recall + 1;
      if (next >= past.length) {
        setRecall(-1);
        setInput("");
      } else {
        setRecall(next);
        setInput(past[next] ?? "");
      }
    }

    if (e.key === "Tab") {
      e.preventDefault();
      setInput((v) => complete(v));
      return;
    }
  }

  return (
    <section className={styles.terminal} aria-label="Terminal interactiva">
      <p className={styles.hint}># escribe help para ver los comandos</p>

      <div aria-live="polite">
        {history.map((entry) => (
          <div key={entry.id} className={styles.entry}>
            <p className={styles.line}>
              <span className={styles.prompt}>{PROMPT}</span>
              {entry.input}
            </p>
            <OutputView output={entry.output} />
          </div>
        ))}
      </div>

      <div
        className={styles.chips}
        role="group"
        aria-label="Comandos sugeridos"
      >
        {SUGGESTED.map((cmd) => (
          <button
            key={cmd}
            type="button"
            className={styles.chip}
            onClick={() => run(cmd)}
          >
            {cmd}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="comando" className={styles.prompt}>
          {PROMPT}
        </label>
        <input
          id="comando"
          className={styles.input}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setRecall(-1);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          placeholder="escribe un comando (o 'help')... "
          autoCapitalize="off"
          spellCheck={false}
        />
      </form>

      <div ref={endRef} />
    </section>
  );
}
