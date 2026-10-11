"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { complete, execute } from "@/lib/commands";
import { useLanguage } from "@/context/LanguageContext";
import OutputView from "./OutputView";
import styles from "./Terminal.module.css";
import type { HistoryEntry, ThemeMode } from "@/lib/types";

const PROMPT = "jcamilo@dev:~/cali$";

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
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [recall, setRecall] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestedCommands =
    locale === "en"
      ? ["help", "ls", "spotify", "cd axora", "theme", "lang es"]
      : ["help", "ls", "spotify", "cd axora", "theme", "lang en"];

  useEffect(() => {
    if (history.length === 0) return;
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [history]);

  const runRef = useRef<(raw: string) => void>(() => {});

  useEffect(() => {
    function handleFocus() {
      inputRef.current?.focus();
    }
    function handleRunCommand(event: Event) {
      const custom = event as CustomEvent<string>;
      if (custom.detail) {
        runRef.current(custom.detail);
      } else {
        inputRef.current?.focus();
      }
    }
    window.addEventListener("focus-terminal", handleFocus);
    window.addEventListener("run-terminal-command", handleRunCommand);
    return () => {
      window.removeEventListener("focus-terminal", handleFocus);
      window.removeEventListener("run-terminal-command", handleRunCommand);
    };
  }, []);

  function run(raw: string) {
    const text = raw.trim();
    if (!text) return;

    if (text === "clear") {
      setHistory([]);
    } else {
      let output = execute(text, locale);
      if (output.kind === "lang") {
        setLocale(output.locale);
      } else if (output.kind === "theme") {
        const next = applyTheme(output.mode);
        const isEn = locale === "en";
        const modeLabel =
          next === "dark"
            ? isEn
              ? "dark"
              : "oscuro"
            : isEn
              ? "light"
              : "claro";
        output = {
          kind: "text",
          lines: [`${isEn ? "theme" : "tema"}: ${modeLabel}`],
        };
      } else if (output.kind === "navigate") {
        router.push(output.path);
      } else if (output.kind === "open") {
        window.open(output.url, "_blank", "noopener,noreferrer");
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

  useEffect(() => {
    runRef.current = run;
  });

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
      setInput((v) => complete(v, locale));
      return;
    }
  }

  return (
    <section
      className={styles.terminal}
      aria-label={
        locale === "en" ? "Interactive terminal" : "Terminal interactiva"
      }
    >
      <p className={styles.hint}>{t.terminal.hint}</p>

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
        aria-label={t.terminal.suggestedLabel}
      >
        {suggestedCommands.map((cmd) => (
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
        <label htmlFor="comando" className={styles.prompt} aria-hidden="true">
          {PROMPT}
        </label>
        <span id="comando-label" className={styles.srOnly}>
          {t.terminal.srOnlyLabel}
        </span>
        <input
          ref={inputRef}
          id="comando"
          aria-labelledby="comando-label"
          aria-label={t.terminal.srOnlyLabel}
          className={styles.input}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setRecall(-1);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          placeholder={t.terminal.inputPlaceholder}
          autoCapitalize="off"
          spellCheck={false}
        />
      </form>

      <div ref={endRef} />
    </section>
  );
}
