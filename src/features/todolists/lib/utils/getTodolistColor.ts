export type TodolistColor = {
  accent: string
  light: string
  border: string
}

/** 20 уникальных accent-цветов для тудулистов (Tailwind palette) */
const LIST_COLORS: TodolistColor[] = [
  { accent: "#6366f1", light: "rgba(99, 102, 241, 0.1)", border: "rgba(99, 102, 241, 0.25)" },   // indigo
  { accent: "#ec4899", light: "rgba(236, 72, 153, 0.1)", border: "rgba(236, 72, 153, 0.25)" },   // pink
  { accent: "#10b981", light: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.25)" },   // emerald
  { accent: "#f59e0b", light: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.25)" },  // amber
  { accent: "#3b82f6", light: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.25)" },   // blue
  { accent: "#8b5cf6", light: "rgba(139, 92, 246, 0.1)", border: "rgba(139, 92, 246, 0.25)" },   // violet
  { accent: "#14b8a6", light: "rgba(20, 184, 166, 0.1)", border: "rgba(20, 184, 166, 0.25)" },   // teal
  { accent: "#f43f5e", light: "rgba(244, 63, 94, 0.1)", border: "rgba(244, 63, 94, 0.25)" },    // rose
  { accent: "#f97316", light: "rgba(249, 115, 22, 0.1)", border: "rgba(249, 115, 22, 0.25)" },  // orange
  { accent: "#06b6d4", light: "rgba(6, 182, 212, 0.1)", border: "rgba(6, 182, 212, 0.25)" },   // cyan
  { accent: "#ef4444", light: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.25)" },    // red
  { accent: "#eab308", light: "rgba(234, 179, 8, 0.1)", border: "rgba(234, 179, 8, 0.25)" },    // yellow
  { accent: "#84cc16", light: "rgba(132, 204, 22, 0.1)", border: "rgba(132, 204, 22, 0.25)" },   // lime
  { accent: "#22c55e", light: "rgba(34, 197, 94, 0.1)", border: "rgba(34, 197, 94, 0.25)" },    // green
  { accent: "#0ea5e9", light: "rgba(14, 165, 233, 0.1)", border: "rgba(14, 165, 233, 0.25)" },  // sky
  { accent: "#a855f7", light: "rgba(168, 85, 247, 0.1)", border: "rgba(168, 85, 247, 0.25)" },  // purple
  { accent: "#d946ef", light: "rgba(217, 70, 239, 0.1)", border: "rgba(217, 70, 239, 0.25)" },  // fuchsia
  { accent: "#d97706", light: "rgba(217, 119, 6, 0.1)", border: "rgba(217, 119, 6, 0.25)" },     // gold
  { accent: "#be123c", light: "rgba(190, 18, 60, 0.1)", border: "rgba(190, 18, 60, 0.25)" },     // crimson
  { accent: "#2dd4bf", light: "rgba(45, 212, 191, 0.1)", border: "rgba(45, 212, 191, 0.25)" },  // mint
]

export const TODOLIST_PALETTE_SIZE = LIST_COLORS.length

export const getTodolistColor = (id: string): TodolistColor => {
  let hash = 0
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return LIST_COLORS[hash % LIST_COLORS.length]
}

export const todolistColorVars = (color: TodolistColor): Record<string, string> => ({
  "--list-accent": color.accent,
  "--list-accent-light": color.light,
  "--list-accent-border": color.border,
})
