import { describe, it, expect } from "vitest";
import { execute, complete } from "../commands";
import { getContactEmail, getMailtoUrl, GITHUB, LINKEDIN } from "../links";

describe("commands: execute", () => {
  it("help returns available commands", () => {
    const res = execute("help");
    expect(res.kind).toBe("text");
    if (res.kind === "text") {
      expect(res.lines.some((l) => l.startsWith("help"))).toBe(true);
      expect(res.lines.some((l) => l.startsWith("cd"))).toBe(true);
      expect(res.lines.some((l) => l.startsWith("open"))).toBe(true);
      expect(res.lines.some((l) => l.startsWith("theme"))).toBe(true);
    }
  });

  it("whoami identifies JCamilo", () => {
    const res = execute("whoami");
    expect(res.kind).toBe("text");
    if (res.kind === "text") {
      expect(res.lines[0]).toContain("JCamilo Castellanos");
    }
  });

  it("ls returns projects list output", () => {
    const res = execute("ls");
    expect(res.kind).toBe("projects");
  });

  it("cd navigates to root, projects anchor or specific slug", () => {
    expect(execute("cd")).toEqual({
      kind: "navigate",
      path: "/",
      message: "cambiando al directorio raíz (~)",
    });

    expect(execute("cd ~")).toEqual({
      kind: "navigate",
      path: "/",
      message: "cambiando al directorio raíz (~)",
    });

    expect(execute("cd ..")).toEqual({
      kind: "navigate",
      path: "/#proyectos",
      message: "subiendo a proyectos (..)",
    });

    const axoraRes = execute("cd axora");
    expect(axoraRes.kind).toBe("navigate");
    if (axoraRes.kind === "navigate") {
      expect(axoraRes.path).toBe("/proyectos/axora");
    }

    const errorRes = execute("cd ruta-fantasma");
    expect(errorRes.kind).toBe("error");
  });

  it("open handles external shortcuts and projects", () => {
    expect(execute("open github")).toEqual({
      kind: "open",
      url: GITHUB,
      label: "GitHub (@DonJuanC)",
    });

    expect(execute("open linkedin")).toEqual({
      kind: "open",
      url: LINKEDIN,
      label: "LinkedIn",
    });

    const openProject = execute("open axora");
    expect(openProject.kind).toBe("open");
    if (openProject.kind === "open") {
      expect(openProject.url).toBeTruthy();
    }

    expect(execute("open").kind).toBe("error");
  });

  it("cat and flow inspect project details", () => {
    expect(execute("cat axora")).toEqual({ kind: "project", slug: "axora" });
    expect(execute("cat no-existe").kind).toBe("error");

    expect(execute("flow reciclave")).toEqual({
      kind: "flow",
      slug: "reciclave",
    });
  });

  it("preview returns preview output", () => {
    expect(execute("preview axora")).toEqual({
      kind: "preview",
      slug: "axora",
    });
    expect(execute("preview no-existe").kind).toBe("error");
  });

  it("contact outputs contact kind", () => {
    expect(execute("contact")).toEqual({ kind: "contact" });
    expect(execute("contacto")).toEqual({ kind: "contact" });
    expect(execute("email")).toEqual({ kind: "contact" });
  });

  it("theme toggles or changes theme mode", () => {
    expect(execute("theme")).toEqual({ kind: "theme", mode: "toggle" });
    expect(execute("theme dark")).toEqual({ kind: "theme", mode: "dark" });
    expect(execute("theme light")).toEqual({ kind: "theme", mode: "light" });
    expect(execute("theme claro")).toEqual({ kind: "theme", mode: "light" });
    expect(execute("theme oscuro")).toEqual({ kind: "theme", mode: "dark" });
  });

  it("returns error on unknown command", () => {
    const res = execute("inventado");
    expect(res.kind).toBe("error");
    if (res.kind === "error") {
      expect(res.message).toContain("comando no encontrado");
    }
  });
});

describe("commands: complete", () => {
  it("autocompletes unique commands", () => {
    expect(complete("wh")).toBe("whoami");
    expect(complete("sk")).toBe("skills");
  });

  it("autocompletes project slugs for cat, flow, cd, and preview", () => {
    expect(complete("cat ax")).toBe("cat axora");
    expect(complete("flow rec")).toBe("flow reciclave");
    expect(complete("cd ax")).toBe("cd axora");
    expect(complete("preview ax")).toBe("preview axora");
  });

  it("autocompletes open targets", () => {
    expect(complete("open git")).toBe("open github");
    expect(complete("open link")).toBe("open linkedin");
    expect(complete("open ax")).toBe("open axora");
  });
});

describe("links: anti-spam email helpers", () => {
  it("assembles contact email correctly", () => {
    expect(getContactEmail()).toBe("dev.jcamcasteur@gmail.com");
    expect(getMailtoUrl()).toBe("mailto:dev.jcamcasteur@gmail.com");
  });
});
