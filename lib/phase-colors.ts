export const PHASE_COLORS: string[] = [
  '#E44D26', // Phase 1 — HTML + CSS
  '#F7DF1E', // Phase 2 — Vanilla JS
  '#61DAFB', // Phase 3 — React
  '#3178C6', // Phase 4 — TypeScript
  '#EDEDED', // Phase 5 — Next.js
  '#336791', // Phase 6 — SQL
  '#C5F74F', // Phase 7 — Drizzle ORM
  '#FF4500', // Phase 8 — Deployment
]

export function progressColor(pct: number): string {
  if (pct >= 80) return '#43A047'
  if (pct >= 41) return '#FF6D00'
  return '#FFA000'
}
