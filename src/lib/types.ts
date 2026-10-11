import type { Locale } from "@/content/i18n";

export type ProjectStatus = "deployed" | "in-progress" | "building";
export type FlowKind = "input" | "process" | "decision" | "output";

export interface FlowLink {
  to: string; // id del paso al que va
  when?: string; // condición: "sí", "no"
}

export interface FlowStep {
  id: string;
  kind: FlowKind;
  label: string;
  detail?: string;
  then?: FlowLink[];
}

export interface FlowGraph {
  steps: FlowStep[];
  highlight?: { stepId: string; note: string };
}

export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string;
  name: string;
  featured: boolean;
  tag?: string;
  status: ProjectStatus;
  tagline: string;
  summary: string;
  role: string;
  team?: string;
  stack: string[];
  links: { label: string; url: string }[];
  flow?: FlowGraph;
  image?: ProjectImage;
}

export type ThemeMode = "dark" | "light" | "toggle";

export type Output =
  | { kind: "text"; lines: string[] }
  | { kind: "theme"; mode: ThemeMode }
  | { kind: "lang"; locale: Locale; message: string }
  | { kind: "projects" }
  | { kind: "project"; slug: string }
  | { kind: "flow"; slug: string }
  | { kind: "preview"; slug: string }
  | { kind: "navigate"; path: string; message: string }
  | { kind: "open"; url: string; label: string }
  | { kind: "contact" }
  | { kind: "error"; message: string }
  | { kind: "ascii" };

export interface Command {
  name: string;
  aliases?: string[];
  summary: string;
  hidden?: boolean;
  run: (args: string[], locale?: Locale) => Output;
}

export interface HistoryEntry {
  id: number;
  input: string;
  output: Output;
}
