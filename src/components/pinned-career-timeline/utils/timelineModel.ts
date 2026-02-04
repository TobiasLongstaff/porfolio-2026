import { sortExperiencesByDate, isIndicumCompany, clamp01 } from "./helpers"
import type { CollectionEntry } from "astro:content"
import type { TimelineModel, EnrichedExperience } from "../types"

export const createTimelineModel = (
  experiences: CollectionEntry<"experience">[]
): TimelineModel => {
  const sortedExperiences = sortExperiencesByDate(experiences)

  const hasOngoingIndicum = sortedExperiences.some(
    (exp) => isIndicumCompany(exp.data.company) && !exp.data.endDate
  )

  const totalAxisSlots = sortedExperiences.length + (hasOngoingIndicum ? 1 : 0)
  const denominator = Math.max(totalAxisSlots - 1, 1)
  const calculateSlotPosition = (index: number) => clamp01(index / denominator)

  // Calcular posiciones para empresas que no son Indicum
  const restCompanySlots = sortedExperiences
    .map((exp, index) => ({ experience: exp, index }))
    .filter(({ experience }) => !isIndicumCompany(experience.data.company))
    .map(({ index }) => index)

  const restStartSlot = restCompanySlots.length ? Math.min(...restCompanySlots) : 0
  const restEndSlot = restCompanySlots.length ? Math.max(...restCompanySlots) : 0

  const restStartPosition = calculateSlotPosition(restStartSlot)
  const restEndPosition = calculateSlotPosition(restEndSlot)

  // Crear experiencias enriquecidas con información adicional
  let indicumIndex = 0
  let restIndex = 0

  const enrichedExperiences: EnrichedExperience[] = sortedExperiences.map(
    (experience, slotIndex) => {
      const group: "indicum" | "rest" = isIndicumCompany(experience.data.company)
        ? "indicum"
        : "rest"
      const groupIndex = group === "indicum" ? indicumIndex++ : restIndex++
      const key =
        experience.id ?? `${experience.data.company}-${experience.data.startDate}-${slotIndex}`

      return {
        experience,
        key,
        group,
        groupIndex,
        slotIndex,
        slotPosition: calculateSlotPosition(slotIndex),
      }
    }
  )

  return {
    enrichedExperiences,
    totalAxisSlots,
    restStartPosition,
    restEndPosition,
  }
}
