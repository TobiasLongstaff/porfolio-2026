import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { CollectionEntry } from "astro:content"

gsap.registerPlugin(ScrollTrigger)

interface PinnedCareerTimelineProps {
  experiences: CollectionEntry<"experience">[]
}

export default function PinnedCareerTimeline({ experiences }: PinnedCareerTimelineProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const pointsRef = useRef<HTMLDivElement>(null)
  const slidesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const fill = fillRef.current
    const points = pointsRef.current
    const slides = slidesRef.current
    if (!section || !fill || !points || !slides) return

    const steps = Array.from(slides.querySelectorAll("[data-step]")) as HTMLElement[]
    const dots = Array.from(points.querySelectorAll("[data-dot]")) as HTMLElement[]
    const labels = Array.from(points.querySelectorAll("[data-label]")) as HTMLElement[]
    if (steps.length === 0 || dots.length === 0 || labels.length === 0) return

    const segments = Math.max(steps.length - 1, 1)

    const moveDur = 1.0
    const holdDur = 2
    const totalDur = segments * (moveDur + holdDur)

    const THRESHOLD = 0.6
    const step = 1 / segments

    const lead = 0.30
    const spacer = { t: 0 }

    gsap.set(fill, { scaleX: 0, transformOrigin: "left center" })
    gsap.set(steps, { autoAlpha: 0, y: 16 })
    gsap.set(steps[0], { autoAlpha: 1, y: 0 })

    gsap.set(dots, { scale: 1, borderColor: "var(--color-text-secondary)" })
    gsap.set(dots[0], { scale: 1.25, borderColor: "var(--color-primary)" })

    // Labels arriba de los puntos: ocultos al inicio
    gsap.set(labels, { autoAlpha: 0, y: 10 })
    gsap.set(labels[0], { autoAlpha: 1, y: 0 })

    const moveFrac = moveDur / (moveDur + holdDur)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${totalDur * 600}`,
        scrub: 1.0,
        pin: true,
        anticipatePin: 1,

        // Snap condicional (solo si estás cerca del próximo punto) respetando hold
        snap: steps.length > 1
          ? {
              snapTo: (progress: number) => {
                const p = Math.min(1, Math.max(0, progress))

                const segIndex = Math.floor(p / step)
                const segStart = segIndex * step

                const localSeg = (p - segStart) / step
                // si estás en HOLD, no snap
                if (localSeg >= moveFrac) return p

                const localMove = localSeg / moveFrac
                if (localMove >= THRESHOLD) {
                  return Math.min(1, (segIndex + 1) * step)
                }
                return p
              },
              duration: { min: 0.1, max: 1 },
              delay: 0.05,
              ease: "power2.out",
            }
          : undefined,
      },
    })

    // Fill + hold (tensión) por segmento
    for (let s = 0; s < segments; s++) {
      const nextScale = (s + 1) / segments
      tl.to(fill, { scaleX: nextScale, ease: "none", duration: moveDur })
      tl.to(spacer, { t: 1, ease: "none", duration: holdDur })
    }

    // Texto + dot + label (arriba del punto) sincronizados
    steps.forEach((stepEl, i) => {
      const reachUnit = i === 0 ? 0 : (i - 1) * (moveDur + holdDur) + moveDur
      const tIn = Math.max(0, reachUnit - lead)

      if (i !== 0) {
        tl.to(steps[i - 1], { autoAlpha: 0, y: -10, duration: 0.2 }, tIn)
        tl.to(dots[i - 1], { scale: 1, duration: 0.15 }, tIn)
        tl.to(labels[i - 1], { autoAlpha: 0, y: -6, duration: 0.2 }, tIn)
      }

      tl.to(stepEl, { autoAlpha: 1, y: 0, duration: 0.25 }, tIn + 0.05)
      tl.to(dots[i], { scale: 1.25, borderColor: "var(--color-primary)", duration: 0.15 }, tIn + 0.05)
      tl.to(labels[i], { autoAlpha: 1, y: 0, duration: 0.25 }, tIn + 0.05)
    })

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill()
      })
      tl.kill()
    }
  }, [experiences.length])

  const count = Math.max(experiences.length, 1)

  const formatMonthYear = (date: string) => {
    const d = new Date(date)
    if (isNaN(d.getTime())) return date // fallback por si viene mal
  
    return new Intl.DateTimeFormat("es-ES", {
      month: "long",
      year: "numeric",
    }).format(d)
  }

  return (
    <section ref={sectionRef} className="p-20 flex flex-col gap-20" style={{ height: "100vh" }}>
      {/* Timeline horizontal */}
      <div className="relative h-[25px]">
        {/* Track */}
        <div
          ref={trackRef}
          className="absolute left-0 right-0 top-1/2 h-[2px] transform -translate-y-1/2 scaleX-0 bg-text-secondary rounded-full w-full"
        />

        {/* Fill */}
        <div
          ref={fillRef}
          className="absolute left-0 right-0 top-1/2 h-[2px] transform -translate-y-1/2 scaleX-0 bg-primary rounded-full w-full"
        />

        {/* Points + Labels */}
        <div ref={pointsRef} className="absolute inset-0">
          {experiences.map((exp, idx) => {
            const leftPct = count === 1 ? 0 : (idx / (count - 1)) * 100

            return (
              <div
                key={exp.id ?? `${exp.data.company}-${idx}`}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${leftPct}%` }}
              >
                {/* Label arriba */}
                <div
                  data-label
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 text-center whitespace-nowrap pointer-events-none"
                >
                  <div className="text-sm font-semibold">
                    {exp.data.position}
                  </div>
                  <div className="text-xs opacity-70">
                    {formatMonthYear(exp.data.startDate)}
                  </div>
                </div>

                {/* Dot */}
                <div
                  data-dot
                  title={`${exp.data.position} @ ${exp.data.company}`}
                  className="w-5 h-5 rounded-full bg-white border-[2px] border-primary shadow-sm"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Escena pinneada: contenido que cambia */}
      <div className="flex justify-between items-center h-full">
        <h2 className="text-8xl font-bold">Experiencia</h2>
        <div ref={slidesRef} className="relative w-[400px]">
          {experiences.map((experience, idx) => (
            <div
              key={experience.id ?? `${experience.data.company}-${idx}`}
              data-step
              className="absolute inset-0"
            >
              <p className="mt-2">
                {experience.data.company}
              </p>
              <p className="mt-4 max-w-2xl">
                {experience.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
