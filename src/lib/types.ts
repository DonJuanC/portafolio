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
}

export type ThemeMode = "dark" | "light" | "toggle";

export type Output =
  | { kind: "text"; lines: string[] }
  | { kind: "theme"; mode: ThemeMode }
  | { kind: "projects" }
  | { kind: "project"; slug: string }
  | { kind: "flow"; slug: string }
  | { kind: "error"; message: string }
  | { kind: "ascii" };

export interface Command {
  name: string;
  aliases?: string[];
  summary: string;
  hidden?: boolean;
  run: (args: string[]) => Output;
}

export interface HistoryEntry {
  id: number;
  input: string;
  output: Output;
}
