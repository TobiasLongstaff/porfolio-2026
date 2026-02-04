import gsap from "gsap"
import { COLORS } from "./constants"
import type { EnrichedExperience, DotElements } from "../types"

export const getDotElementsForExperience = (
  experience: EnrichedExperience,
  indicumDots: HTMLElement[],
  indicumLabels: HTMLElement[],
  indicumDotInners: HTMLElement[],
  restDots: HTMLElement[],
  restLabels: HTMLElement[],
  restDotInners: HTMLElement[]
): DotElements => {
  if (experience.group === "indicum") {
    return {
      dot: indicumDots[experience.groupIndex],
      label: indicumLabels[experience.groupIndex],
      dotInner: indicumDotInners[experience.groupIndex],
    }
  }
  return {
    dot: restDots[experience.groupIndex],
    label: restLabels[experience.groupIndex],
    dotInner: restDotInners[experience.groupIndex],
  }
}

export const initializeTimelineElements = (
  steps: HTMLElement[],
  indicumDots: HTMLElement[],
  restDots: HTMLElement[],
  indicumDotInners: HTMLElement[],
  restDotInners: HTMLElement[],
  indicumLabels: HTMLElement[],
  restLabels: HTMLElement[],
  indicumFill: HTMLDivElement,
  restFill: HTMLDivElement,
  restEndCap: HTMLDivElement
): void => {
  // Inicializar steps
  gsap.set(steps, { autoAlpha: 0, y: 16 })
  gsap.set(steps[0], { autoAlpha: 1, y: 0 })

  // Inicializar dots
  gsap.set([...indicumDots, ...restDots], { scale: 1, borderColor: COLORS.GRAY })
  gsap.set([...indicumDotInners, ...restDotInners], { scale: 0 })
  gsap.set([...indicumLabels, ...restLabels], { autoAlpha: 0, y: 10 })

  // Inicializar fills
  gsap.set([indicumFill, restFill], { scaleX: 0, transformOrigin: "left center" })
  gsap.set(restEndCap, { backgroundColor: COLORS.GRAY })
}

export const calculateTimelinePosition = (
  slotIndex: number,
  moveDuration: number,
  holdDuration: number
): number => {
  if (slotIndex === 0) return 0
  return (slotIndex - 1) * (moveDuration + holdDuration) + moveDuration
}

export const calculateAnimationStartTime = (
  timelinePosition: number,
  lead: number
): number => {
  return Math.max(0, timelinePosition - lead)
}
