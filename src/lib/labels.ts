import type { Locale } from "@/content/i18n";
import type { ProjectStatus } from "./types";

export const statusLabels: Record<Locale, Record<ProjectStatus, string>> = {
  es: {
    deployed: "desplegado",
    "in-progress": "en desarrollo",
    building: "en construcción",
  },
  en: {
    deployed: "deployed",
    "in-progress": "in progress",
    building: "building",
  },
};

export const statusLabel = statusLabels.es;