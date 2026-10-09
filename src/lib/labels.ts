import type { ProjectStatus } from "./types";

export const statusLabel: Record<ProjectStatus, string> = {
    deployed: "desplegado",
    "in-progress": "en desarrollo",
    building: "en construcción",
};