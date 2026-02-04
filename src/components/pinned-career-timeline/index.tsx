import { useEffect, useMemo, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { CollectionEntry } from "astro:content"
import { AnimatedList } from "./components/animated-list"
import { TimelineRail } from "./components/TimelineRail"
import { ExperienceCard } from "./components/ExperienceCard"
import { createTimelineModel } from "./utils/timelineModel"
import {
  initializeTimelineElements,
  getDotElementsForExperience,
  calculateTimelinePosition,
  calculateAnimationStartTime,
} from "./utils/animationHelpers"
import {
  ANIMATION_DURATIONS,
  ANIMATION_TIMINGS,
  TIMELINE_CONSTANTS,
  COLORS,
} from "./utils/constants"
import { percentage, clamp01 } from "./utils/helpers"
import type { TimelineElements } from "./types"

gsap.registerPlugin(ScrollTrigger)

interface PinnedCareerTimelineProps {
  experiences: CollectionEntry<"experience">[]
}

export default function PinnedCareerTimeline({ experiences }: PinnedCareerTimelineProps) {
  // Refs para elementos del DOM
  const sectionRef = useRef<HTMLDivElement>(null)
  const indicumFillRef = useRef<HTMLDivElement>(null)
  const indicumRailRef = useRef<HTMLDivElement>(null)
  const restFillRef = useRef<HTMLDivElement>(null)
  const restRailRef = useRef<HTMLDivElement>(null)
  const restEndCapRef = useRef<HTMLDivElement>(null)
  const experienceCardsRef = useRef<HTMLDivElement>(null)
  const milestonesContainerRef = useRef<HTMLDivElement>(null)

  // Estado para controlar qué experiencia está activa
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState(0)
  const previousExperienceIndexRef = useRef(0)

  // Crear modelo de timeline con experiencias enriquecidas
  const timelineModel = useMemo(() => createTimelineModel(experiences), [experiences])

  // Calcular constantes derivadas
  const totalSegments = Math.max(timelineModel.totalAxisSlots - 1, 1)
  const totalDuration = totalSegments * (ANIMATION_DURATIONS.MOVE + ANIMATION_DURATIONS.HOLD)
  const stepSize = 1 / totalSegments
  const restEndMaxPosition = Math.min(
    1 - TIMELINE_CONSTANTS.REST_END_GAP,
    timelineModel.restEndPosition + TIMELINE_CONSTANTS.REST_AFTER_LAST
  )

  const calculateRestProgress = (progress: number): number => {
    const span = Math.max(1e-6, restEndMaxPosition - timelineModel.restStartPosition)
    return clamp01((progress - timelineModel.restStartPosition) / span)
  }

  useEffect(() => {
    const elements: TimelineElements | null = (() => {
      const section = sectionRef.current
      const slides = experienceCardsRef.current
      const milestones = milestonesContainerRef.current
      const indicumFill = indicumFillRef.current
      const restFill = restFillRef.current
      const indicumRail = indicumRailRef.current
      const restRail = restRailRef.current
      const restEndCap = restEndCapRef.current

      if (
        !section ||
        !slides ||
        !milestones ||
        !indicumFill ||
        !restFill ||
        !indicumRail ||
        !restRail ||
        !restEndCap
      ) {
        return null
      }

      return {
        section,
        slides,
        milestones,
        indicumFill,
        restFill,
        indicumRail,
        restRail,
        restEndCap,
      }
    })()

    if (!elements) return

    const animationContext = gsap.context(() => {
      const experienceCards = Array.from(
        elements.slides.querySelectorAll("[data-step]")
      ) as HTMLElement[]
      if (experienceCards.length === 0) return

      // Obtener elementos de dots y labels
      const indicumDots = Array.from(
        elements.indicumRail.querySelectorAll("[data-dot]")
      ) as HTMLElement[]
      const indicumLabels = Array.from(
        elements.indicumRail.querySelectorAll("[data-label]")
      ) as HTMLElement[]
      const indicumDotInners = Array.from(
        elements.indicumRail.querySelectorAll("[data-dot-inner]")
      ) as HTMLElement[]

      const restDots = Array.from(
        elements.restRail.querySelectorAll("[data-dot]")
      ) as HTMLElement[]
      const restLabels = Array.from(
        elements.restRail.querySelectorAll("[data-label]")
      ) as HTMLElement[]
      const restDotInners = Array.from(
        elements.restRail.querySelectorAll("[data-dot-inner]")
      ) as HTMLElement[]

      // Inicializar elementos
      initializeTimelineElements(
        experienceCards,
        indicumDots,
        restDots,
        indicumDotInners,
        restDotInners,
        indicumLabels,
        restLabels,
        elements.indicumFill,
        elements.restFill,
        elements.restEndCap
      )

      // Objeto para controlar el progreso de la animación
      const progressDriver = { progress: 0 }
      gsap.set(progressDriver, { progress: 0 })

      // Crear timeline principal
      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: elements.section,
          start: "top top",
          end: () => `+=${totalDuration * TIMELINE_CONSTANTS.SCROLL_MULTIPLIER}`,
          scrub: 1.0,
          pin: true,
          anticipatePin: 1,
        },
        onUpdate: () => {
          const currentProgress = progressDriver.progress

          // Actualizar fills de progreso
          gsap.set(elements.indicumFill, { scaleX: currentProgress })
          gsap.set(elements.restFill, { scaleX: calculateRestProgress(currentProgress) })

          // Cambiar color del tope cuando se llega al final
          if (currentProgress >= restEndMaxPosition) {
            gsap.set(elements.restEndCap, { backgroundColor: COLORS.PRIMARY })
          } else {
            gsap.set(elements.restEndCap, { backgroundColor: COLORS.GRAY })
          }

          // Calcular índice de experiencia actual basado en el progreso
          const currentExperienceIndex = Math.min(
            Math.floor(currentProgress / stepSize),
            timelineModel.enrichedExperiences.length - 1
          )
          const currentExperience = timelineModel.enrichedExperiences[currentExperienceIndex]

          // Actualizar índice cuando cambia (funciona en ambas direcciones)
          if (currentExperienceIndex !== previousExperienceIndexRef.current) {
            previousExperienceIndexRef.current = currentExperienceIndex
            setCurrentExperienceIndex(currentExperienceIndex)
          }
        },
      })

      // Crear animaciones para cada segmento
      for (let segmentIndex = 0; segmentIndex < totalSegments; segmentIndex++) {
        const nextProgress = (segmentIndex + 1) / totalSegments
        mainTimeline.to(progressDriver, {
          progress: nextProgress,
          ease: "none",
          duration: ANIMATION_DURATIONS.MOVE,
        })
        mainTimeline.to(progressDriver, {
          progress: nextProgress,
          ease: "none",
          duration: ANIMATION_DURATIONS.HOLD,
        })
      }

      // Configurar primera experiencia
      const firstExperience = timelineModel.enrichedExperiences[0]
      if (firstExperience) {
        const firstDotElements = getDotElementsForExperience(
          firstExperience,
          indicumDots,
          indicumLabels,
          indicumDotInners,
          restDots,
          restLabels,
          restDotInners
        )
        const activeBorderColor = COLORS.PRIMARY

        if (firstDotElements.dot) {
          gsap.set(firstDotElements.dot, { scale: 1, borderColor: activeBorderColor })
        }
        if (firstDotElements.dotInner) {
          gsap.set(firstDotElements.dotInner, { scale: 1 })
        }
        if (firstDotElements.label) {
          gsap.set(firstDotElements.label, { autoAlpha: 1, y: 0 })
        }

        // Establecer índice inicial
        previousExperienceIndexRef.current = 0
        setCurrentExperienceIndex(0)
      }

      // Configurar animaciones para cada experiencia
      timelineModel.enrichedExperiences.forEach((experience, experienceIndex) => {
        const timelinePosition = calculateTimelinePosition(
          experience.slotIndex,
          ANIMATION_DURATIONS.MOVE,
          ANIMATION_DURATIONS.HOLD
        )
        const animationStartTime = calculateAnimationStartTime(
          timelinePosition,
          ANIMATION_TIMINGS.LEAD
        )

        const experienceCard = experienceCards[experienceIndex]
        if (!experienceCard) return

        // Ocultar card anterior
        if (experienceIndex !== 0 && experienceCards[experienceIndex - 1]) {
          mainTimeline.to(
            experienceCards[experienceIndex - 1],
            {
              autoAlpha: 0,
              y: -10,
              duration: ANIMATION_DURATIONS.STEP_FADE,
            },
            animationStartTime
          )
        }

        // Mostrar card actual
        mainTimeline.to(
          experienceCard,
          {
            autoAlpha: 1,
            y: 0,
            duration: ANIMATION_DURATIONS.STEP_SHOW,
          },
          animationStartTime + ANIMATION_TIMINGS.STEP_DELAY
        )

        // Ocultar experiencia anterior
        const previousExperience =
          experienceIndex > 0 ? timelineModel.enrichedExperiences[experienceIndex - 1] : null
        if (previousExperience) {
          const previousDotElements = getDotElementsForExperience(
            previousExperience,
            indicumDots,
            indicumLabels,
            indicumDotInners,
            restDots,
            restLabels,
            restDotInners
          )

          if (previousDotElements.label) {
            mainTimeline.to(
              previousDotElements.label,
              {
                autoAlpha: 0,
                y: -6,
                duration: ANIMATION_DURATIONS.STEP_FADE,
              },
              animationStartTime
            )
          }
          if (previousDotElements.dotInner) {
            mainTimeline.to(
              previousDotElements.dotInner,
              {
                scale: 0,
                duration: ANIMATION_DURATIONS.DOT_ANIMATION,
                ease: "power2.inOut",
              },
              animationStartTime
            )
          }
        }

        // Mostrar experiencia actual
        const currentDotElements = getDotElementsForExperience(
          experience,
          indicumDots,
          indicumLabels,
          indicumDotInners,
          restDots,
          restLabels,
          restDotInners
        )
        const activeBorderColor = COLORS.PRIMARY

        // Actualizar índice cuando cambia el punto
        mainTimeline.call(
          () => {
            if (experienceIndex !== previousExperienceIndexRef.current) {
              previousExperienceIndexRef.current = experienceIndex
              setCurrentExperienceIndex(experienceIndex)
            }
          },
          [],
          animationStartTime + ANIMATION_TIMINGS.STEP_DELAY
        )

        if (currentDotElements.dot) {
          mainTimeline.to(
            currentDotElements.dot,
            {
              scale: 1,
              borderColor: activeBorderColor,
              duration: ANIMATION_DURATIONS.DOT_ANIMATION,
              ease: "power2.inOut",
            },
            animationStartTime + ANIMATION_TIMINGS.STEP_DELAY
          )
        }
        if (currentDotElements.dotInner) {
          mainTimeline.to(
            currentDotElements.dotInner,
            {
              scale: 1,
              duration: ANIMATION_DURATIONS.DOT_ANIMATION,
              ease: "power2.inOut",
            },
            animationStartTime + ANIMATION_TIMINGS.STEP_DELAY
          )
        }
        if (currentDotElements.label) {
          mainTimeline.to(
            currentDotElements.label,
            {
              autoAlpha: 1,
              y: 0,
              duration: ANIMATION_DURATIONS.STEP_SHOW,
            },
            animationStartTime + ANIMATION_TIMINGS.STEP_DELAY
          )
        }
      })
    }, elements.section)

    return () => animationContext.revert()
  }, [
    timelineModel.totalAxisSlots,
    timelineModel.enrichedExperiences.length,
    timelineModel.restStartPosition,
    timelineModel.restEndPosition,
    totalSegments,
    totalDuration,
    stepSize,
    restEndMaxPosition,
  ])

  const currentExperience = timelineModel.enrichedExperiences[currentExperienceIndex]
  const currentMilestones = currentExperience?.experience.data.milestones || []

  return (
    <section
      ref={sectionRef}
      className="px-40 py-30 flex flex-col gap-20"
      style={{ height: "100vh" }}
    >
      {/* Líneas de tiempo */}
      <div className="flex flex-col gap-[10px]">
        <TimelineRail
          experiences={timelineModel.enrichedExperiences}
          group="indicum"
          fillRef={indicumFillRef}
          railRef={indicumRailRef}
        />

        <TimelineRail
          experiences={timelineModel.enrichedExperiences}
          group="rest"
          fillRef={restFillRef}
          railRef={restRailRef}
          restStartPosition={timelineModel.restStartPosition}
          restEndMaxPosition={restEndMaxPosition}
          restEndCapRef={restEndCapRef}
        />
      </div>

      {/* Contenido pinneado */}
      <div className="flex gap-8 h-full">
        {/* Milestones a la izquierda */}
        <div
          ref={milestonesContainerRef}
          className="flex-1 flex flex-col gap-4"
          style={{ overflow: "hidden", minHeight: 0 }}
        >
          <AnimatedList
            items={currentMilestones as Array<{ title: string; description: string }>}
            className="flex flex-col gap-4"
            displayScrollbar={true}
          />
        </div>

        {/* Cards de experiencia a la derecha */}
        <div ref={experienceCardsRef} className="relative" style={{ width: "500px" }}>
          {timelineModel.enrichedExperiences.map(({ experience, key }) => (
            <div key={key} data-step className="absolute inset-0">
              <ExperienceCard experience={experience} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
