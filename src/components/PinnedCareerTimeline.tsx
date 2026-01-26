import { useEffect, useMemo, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { CollectionEntry } from "astro:content"
import ReactMarkdown from "react-markdown"
import { getTechIcon } from "@/lib/techIcons"

gsap.registerPlugin(ScrollTrigger)

interface PinnedCareerTimelineProps {
  experiences: CollectionEntry<"experience">[]
}

const isIndicumCompany = (company?: string) =>
  (company ?? "").toLowerCase().includes("indicum")

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

const formatMonthYear = (date: string) => {
  const safe = date.length === 7 ? `${date}-01` : date
  const d = new Date(safe)
  if (isNaN(d.getTime())) return date
  return new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(d)
}

export default function PinnedCareerTimeline({ experiences }: PinnedCareerTimelineProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  const indicumFillRef = useRef<HTMLDivElement>(null)
  const indicumPointsRef = useRef<HTMLDivElement>(null)

  const restFillRef = useRef<HTMLDivElement>(null)
  const restPointsRef = useRef<HTMLDivElement>(null)

  const slidesRef = useRef<HTMLDivElement>(null)

  const sorted = useMemo(() => {
    return [...experiences].sort(
      (a, b) =>
        new Date(`${a.data.startDate}-01`).getTime() -
        new Date(`${b.data.startDate}-01`).getTime()
    )
  }, [experiences])

  const model = useMemo(() => {
    const hasOngoingIndicum = sorted.some(
      (e) => isIndicumCompany(e.data.company) && !e.data.endDate
    )

    const axisSlots = sorted.length + (hasOngoingIndicum ? 1 : 0)
    const denom = Math.max(axisSlots - 1, 1)
    const slotP = (i: number) => clamp01(i / denom)

    const restSlots = sorted
      .map((e, i) => ({ e, i }))
      .filter(({ e }) => !isIndicumCompany(e.data.company))
      .map(({ i }) => i)

    const restStartSlot = restSlots.length ? Math.min(...restSlots) : 0
    const restEndSlot = restSlots.length ? Math.max(...restSlots) : 0

    const restStartP = slotP(restStartSlot)
    const restEndP = slotP(restEndSlot)

    let indicumIdx = 0
    let restIdx = 0

    const enriched = sorted.map((exp, slotIndex) => {
      const group = isIndicumCompany(exp.data.company) ? ("indicum" as const) : ("rest" as const)
      const groupIndex = group === "indicum" ? indicumIdx++ : restIdx++
      const key = exp.id ?? `${exp.data.company}-${exp.data.startDate}-${slotIndex}`
      return { exp, key, group, groupIndex, slotIndex, slotP: slotP(slotIndex) }
    })

    return { enriched, axisSlots, restStartP, restEndP }
  }, [sorted])

  useEffect(() => {
    const section = sectionRef.current
    const slides = slidesRef.current
    const indicumFill = indicumFillRef.current
    const restFill = restFillRef.current
    const indicumRail = indicumPointsRef.current
    const restRail = restPointsRef.current

    if (!section || !slides || !indicumFill || !restFill || !indicumRail || !restRail) return

    const ctx = gsap.context(() => {
      const steps = Array.from(slides.querySelectorAll("[data-step]")) as HTMLElement[]
      if (steps.length === 0) return

      const indicumDots = Array.from(indicumRail.querySelectorAll("[data-dot]")) as HTMLElement[]
      const indicumLabels = Array.from(indicumRail.querySelectorAll("[data-label]")) as HTMLElement[]

      const restDots = Array.from(restRail.querySelectorAll("[data-dot]")) as HTMLElement[]
      const restLabels = Array.from(restRail.querySelectorAll("[data-label]")) as HTMLElement[]

      const segmentsAxis = Math.max(model.axisSlots - 1, 1)

      const moveDur = 1.0
      const holdDur = 2.0
      const totalDur = segmentsAxis * (moveDur + holdDur)

      const THRESHOLD = 0.6
      const stepAxis = 1 / segmentsAxis
      const moveFrac = moveDur / (moveDur + holdDur)
      const lead = 0.30

      const driver = { p: 0 }

      gsap.set(driver, { p: 0 })

      gsap.set(steps, { autoAlpha: 0, y: 16 })
      gsap.set(steps[0], { autoAlpha: 1, y: 0 })

      gsap.set(indicumDots, { scale: 1, borderColor: "var(--color-text-secondary)" })
      gsap.set(restDots, { scale: 1, borderColor: "var(--color-text-secondary)" })

      gsap.set(indicumLabels, { autoAlpha: 0, y: 10 })
      gsap.set(restLabels, { autoAlpha: 0, y: 10 })

      gsap.set(indicumFill, { scaleX: 0, transformOrigin: "left center" })
      gsap.set(restFill, { scaleX: 0, transformOrigin: "left center" })

      const REST_END_GAP = 0.08
      const REST_AFTER_LAST = 0.06

      const restStartP = model.restStartP
      const restEndMaxP = Math.min(1 - REST_END_GAP, model.restEndP + REST_AFTER_LAST)

      const restProgress01 = (p: number) => {
        const span = Math.max(1e-6, restEndMaxP - restStartP)
        return clamp01((p - restStartP) / span)
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalDur * 600}`,
          scrub: 1.0,
          pin: true,
          anticipatePin: 1,
          snap:
            steps.length > 1
              ? {
                snapTo: (progress: number) => {
                  const p = clamp01(progress)

                  const segIndex = Math.floor(p / stepAxis)
                  const segStart = segIndex * stepAxis

                  const localSeg = (p - segStart) / stepAxis
                  if (localSeg >= moveFrac) return p

                  const localMove = localSeg / moveFrac
                  if (localMove >= THRESHOLD) return Math.min(1, (segIndex + 1) * stepAxis)

                  return p
                },
                duration: { min: 0.1, max: 1 },
                delay: 0.05,
                ease: "power2.out",
              }
              : undefined,
        },
        onUpdate: () => {
          const p = driver.p
          gsap.set(indicumFill, { scaleX: p })
          gsap.set(restFill, { scaleX: restProgress01(p) })
        },
      })

      for (let s = 0; s < segmentsAxis; s++) {
        const nextP = (s + 1) / segmentsAxis
        tl.to(driver, { p: nextP, ease: "none", duration: moveDur })
        tl.to(driver, { p: nextP, ease: "none", duration: holdDur })
      }

      const getDotAndLabel = (meta: (typeof model.enriched)[number]) => {
        if (meta.group === "indicum") {
          return { dot: indicumDots[meta.groupIndex], label: indicumLabels[meta.groupIndex] }
        }
        return { dot: restDots[meta.groupIndex], label: restLabels[meta.groupIndex] }
      }

      const activeBorderIndicum = "var(--color-primary)"
      const activeBorderRest = "var(--color-secondary)" // ✅ solo el borde “activo” cambia, la línea ya es gradiente

      const first = model.enriched[0]
      if (first) {
        const { dot, label } = getDotAndLabel(first)
        const activeBorder = first.group === "indicum" ? activeBorderIndicum : activeBorderRest
        if (dot) gsap.set(dot, { scale: 1.25, borderColor: activeBorder })
        if (label) gsap.set(label, { autoAlpha: 1, y: 0 })
      }

      model.enriched.forEach((meta, i) => {
        const k = meta.slotIndex
        const reachUnit = k === 0 ? 0 : (k - 1) * (moveDur + holdDur) + moveDur
        const tIn = Math.max(0, reachUnit - lead)

        const stepEl = steps[i]
        if (!stepEl) return

        if (i !== 0 && steps[i - 1]) {
          tl.to(steps[i - 1], { autoAlpha: 0, y: -10, duration: 0.2 }, tIn)
        }
        tl.to(stepEl, { autoAlpha: 1, y: 0, duration: 0.25 }, tIn + 0.05)

        const prev = i > 0 ? model.enriched[i - 1] : null
        if (prev) {
          const { label: prevLabel } = getDotAndLabel(prev)
          if (prevLabel) tl.to(prevLabel, { autoAlpha: 0, y: -6, duration: 0.2 }, tIn)
        }

        const { dot, label } = getDotAndLabel(meta)
        const activeBorder = meta.group === "indicum" ? activeBorderIndicum : activeBorderRest

        if (dot) tl.to(dot, { scale: 1.25, borderColor: activeBorder, duration: 0.15 }, tIn + 0.05)
        if (label) tl.to(label, { autoAlpha: 1, y: 0, duration: 0.25 }, tIn + 0.05)
      })
    }, section)

    return () => ctx.revert()
  }, [model.axisSlots, model.enriched.length, model.restStartP, model.restEndP])

  const pct = (p: number) => `${clamp01(p) * 100}%`

  const REST_END_GAP = 0.08
  const REST_AFTER_LAST = 0.06
  const restEndMaxP = Math.min(1 - REST_END_GAP, model.restEndP + REST_AFTER_LAST)

  const DOT_INSET = 10

  return (
    <section ref={sectionRef} className="py-15 px-40 flex flex-col gap-16" style={{ height: "100vh" }}>
      <div className="w-full flex flex-col items-center justify-center gap-[25px]">
        <h2 className="text-6xl font-bold">Experiencia</h2>
      </div>
      <div className="flex flex-col gap-[10px]">
        {/* Indicum (labels ARRIBA) */}
        <div className="relative h-[40px]">
          <div
            ref={indicumPointsRef}
            className="absolute inset-0 overflow-visible"
            style={{ left: DOT_INSET, right: DOT_INSET }}
          >
            <div className="absolute top-1/2 h-[3px] -translate-y-1/2 bg-text-secondary rounded-full left-0 right-0" />

            {/* ✅ Fill con gradiente (misma lógica, solo fondo distinto) */}
            <div
              ref={indicumFillRef}
              className="absolute top-1/2 h-[3px] -translate-y-1/2 scaleX-0 rounded-full origin-left left-0 right-0"
              style={{ backgroundImage: "var(--gradient-timeline)" }}
            />

            {model.enriched
              .filter((x) => x.group === "indicum")
              .map(({ exp, key, slotP }) => (
                <div
                  key={key}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
                  style={{ left: pct(slotP) }}
                >
                  <div
                    data-label
                    className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 text-center whitespace-nowrap pointer-events-none"
                  >
                    <div className="text-sm font-semibold">{exp.data.position}</div>
                    <div className="text-xs capitalize">{formatMonthYear(exp.data.startDate)}</div>
                  </div>

                  <div
                    data-dot
                    title={`${exp.data.position} @ ${exp.data.company}`}
                    className="w-5 h-5 rounded-full bg-white border-[3px] border-primary shadow-sm"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Rest (labels ABAJO) */}
        <div className="relative h-[40px]">
          <div
            ref={restPointsRef}
            className="absolute inset-0 overflow-visible"
            style={{ left: DOT_INSET, right: DOT_INSET }}
          >
            {/* Track */}
            <div
              className="absolute top-1/2 h-[3px] -translate-y-1/2 bg-text-secondary rounded-full"
              style={{
                left: pct(model.restStartP),
                width: pct(restEndMaxP - model.restStartP),
              }}
            />

            {/* ✅ Fill con gradiente (solo estética) */}
            <div
              ref={restFillRef}
              className="absolute top-1/2 h-[3px] -translate-y-1/2 scaleX-0 rounded-full origin-left"
              style={{
                left: pct(model.restStartP),
                width: pct(restEndMaxP - model.restStartP),
                backgroundImage: "var(--gradient-timeline-alt)",
              }}
            />

            {/* Tope */}
            <div
              className="absolute top-1/2 bg-text-secondary rounded-full"
              style={{
                left: pct(restEndMaxP),
                width: 2,
                height: 18,
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Dots */}
            {model.enriched
              .filter((x) => x.group === "rest")
              .map(({ exp, key, slotP }) => (
                <div
                  key={key}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
                  style={{ left: pct(slotP) }}
                >
                  <div
                    data-label
                    className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-center whitespace-nowrap pointer-events-none"
                  >
                    <div className="text-sm font-semibold">{exp.data.position}</div>
                    <div className="text-xs capitalize">{formatMonthYear(exp.data.startDate)}</div>
                  </div>

                  <div
                    data-dot
                    title={`${exp.data.position} @ ${exp.data.company}`}
                    className="w-5 h-5 rounded-full bg-white border-[3px] border-secondary shadow-sm"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Escena pinneada */}
      <div className="flex justify-between items-center h-full">
        <div ref={slidesRef} className="relative w-full h-full">
          {model.enriched.map(({ exp, key }) => (
            <div key={key} data-step className="absolute inset-0">
              <div className="flex gap-4 bg-background-alt py-[70px] px-[70px] rounded-[40px] h-full">
                <div className="flex gap-[15px]">
                  <img src="https://magnetico.dev/wp-content/uploads/2018/12/favicon-1.png" className="w-15 h-15 bg-primary rounded-[5px] p-[10px] shadow-soft" />
                  <div className="flex flex-col gap-[10px]">
                    <div className="flex flex-col gap-[5px]">
                      <p className="font-bold text-3xl">{exp.data.company}</p>
                      <p className="text-sm text-text-secondary">{formatMonthYear(exp.data.startDate)} - {exp.data.endDate ? formatMonthYear(exp.data.endDate) : "Actualmente"}</p>
                    </div>
                    <article className="prose prose-neutral max-w-none font-medium text-base text-text-secondary">
                      <ReactMarkdown>
                        {exp.body}
                      </ReactMarkdown>
                    </article>
                    <div className="flex gap-[10px] flex-wrap">
                      {exp.data.technologies && exp.data.technologies.map((tech: string, techIndex: number) => {
                        const TechIcon = getTechIcon(tech);
                        return (
                          <span
                            key={techIndex}
                            className="font-medium text-base rounded-full border px-[15px] py-[5px] flex items-center gap-[8px]"
                          >
                            {TechIcon && <TechIcon className="w-5 h-5" />}
                            {tech}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
