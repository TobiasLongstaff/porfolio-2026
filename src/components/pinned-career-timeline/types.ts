import type { CollectionEntry } from "astro:content"

export type CompanyGroup = "indicum" | "rest"

export interface EnrichedExperience {
  experience: CollectionEntry<"experience">
  key: string
  group: CompanyGroup
  groupIndex: number
  slotIndex: number
  slotPosition: number // posición en porcentaje (0-1)
}

export interface TimelineModel {
  enrichedExperiences: EnrichedExperience[]
  totalAxisSlots: number
  restStartPosition: number
  restEndPosition: number
}

export interface TimelineElements {
  section: HTMLDivElement
  slides: HTMLDivElement
  milestones: HTMLDivElement
  indicumFill: HTMLDivElement
  restFill: HTMLDivElement
  indicumRail: HTMLDivElement
  restRail: HTMLDivElement
  restEndCap: HTMLDivElement
}

export interface DotElements {
  dot: HTMLElement | undefined
  label: HTMLElement | undefined
  dotInner: HTMLElement | undefined
}
