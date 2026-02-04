import type { CollectionEntry } from "astro:content"

export const isIndicumCompany = (company?: string): boolean =>
  (company ?? "").toLowerCase().includes("indicum")

export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value))

export const formatMonthYear = (date: string): string => {
  const safeDate = date.length === 7 ? `${date}-01` : date
  const dateObject = new Date(safeDate)
  if (isNaN(dateObject.getTime())) return date
  return new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(dateObject)
}

export const percentage = (value: number): string => `${clamp01(value) * 100}%`

export const sortExperiencesByDate = (
  experiences: CollectionEntry<"experience">[]
): CollectionEntry<"experience">[] => {
  return [...experiences].sort(
    (a, b) =>
      new Date(`${a.data.startDate}-01`).getTime() -
      new Date(`${b.data.startDate}-01`).getTime()
  )
}
