// Constantes de animación
export const ANIMATION_DURATIONS = {
  MOVE: 1.0,
  HOLD: 2.0,
  STEP_FADE: 0.2,
  STEP_SHOW: 0.25,
  DOT_ANIMATION: 0.4,
  MILESTONE_FADE: 0.3,
} as const

export const ANIMATION_TIMINGS = {
  LEAD: 0.30,
  STEP_DELAY: 0.05,
} as const

export const TIMELINE_CONSTANTS = {
  REST_END_GAP: 0.08,
  REST_AFTER_LAST: 0.06,
  DOT_INSET: 10,
  SCROLL_MULTIPLIER: 600,
} as const

export const COLORS = {
  PRIMARY: "var(--color-primary)",
  GRAY: "var(--color-gray)",
} as const
