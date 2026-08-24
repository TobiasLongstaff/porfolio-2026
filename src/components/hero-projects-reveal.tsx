import { Fragment, useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const COPY = "Cada proyecto empezó con una pregunta, una necesidad y un equipo dispuesto a resolverla. Acá reuní algunos de los productos que ayudé a construir y las decisiones que les dieron forma."
const WORDS = COPY.split(" ")

export default function HeroProjectsReveal() {
  const rootRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    if (!rootRef.current) return

    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const words = gsap.utils.toArray<HTMLElement>("[data-reveal-word]", rootRef.current)

        gsap.fromTo(words,
          { autoAlpha: 0.16, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current!,
              start: "top 80%",
              end: "bottom 45%",
              scrub: 0.8,
            },
          },
        )
      })
    }, rootRef)

    return () => {
      media.revert()
      context.revert()
    }
  }, [])

  return (
    <section
      ref={rootRef}
      aria-label="Introducción a proyectos"
      className="min-h-[70svh] bg-[#efeefe] px-6 md:px-16 lg:px-40 flex items-start overflow-hidden"
    >
      <p aria-hidden="true" className="mx-auto max-w-6xl text-center text-4xl sm:text-5xl lg:text-7xl font-medium leading-[1.08] text-text">
        {WORDS.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span data-reveal-word className="inline-block">{word}</span>
            {index < WORDS.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </p>
      <p className="sr-only">{COPY}</p>
    </section>
  )
}
