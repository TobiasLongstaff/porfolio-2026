import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ReactMarkdown from "react-markdown"
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(ScrollTrigger, SplitText)

interface ExperienceTitleProps {
  title: string
  description?: string
}

export const ExperienceTitle = ({ title, description }: ExperienceTitleProps) => {
  const rootRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const descRef = useRef<HTMLParagraphElement | null>(null)

  useLayoutEffect(() => {
    if (!rootRef.current) return

    const ctx = gsap.context(() => {
      const elements = [descRef.current].filter(Boolean) as HTMLElement[]
      if (elements.length === 0) return

      gsap.set(elements, { opacity: 1 })

      const run = () => {
        elements.forEach((el) => {
          SplitText.create(el, {
            type: "words,lines",
            mask: "lines",
            linesClass: "line",
            autoSplit: true,
            onSplit: (instance) => {
              return gsap.from(instance.lines, {
                yPercent: 120,
                stagger: 0.1,
                ease: "none",
                scrollTrigger: {
                  trigger: rootRef.current!,
                  scrub: true,
                  start: "clamp(top center)",
                  end: "clamp(top top)",
                },
              })
            },
          })
        })
      }

      const fontsReady = (document as any).fonts?.ready
      if (fontsReady?.then) fontsReady.then(run)
      else run()
    }, rootRef)

    return () => ctx.revert()
  }, [title, description])

  return (
    <section
      ref={(node) => {
        rootRef.current = node
      }}
      className={[
        "min-h-screen w-full flex flex-col gap-10 pt-50",
        "px-6 md:px-16 lg:px-40",
        "relative overflow-hidden",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0",
          "mix-blend-color-dodge opacity-80",
        ].join(" ")}
      />

      <div className="relative w-full">
        {/* <h2
          ref={titleRef}
          className={[
            "split opacity-0 text-center font-black",
            "text-5xl md:text-7xl lg:text-8xl",
            "will-change-transform",
          ].join(" ")}
        >
          {title}
        </h2> */}

        {description && (
          <p
            ref={descRef}
            className={[
              "split opacity-0 text-center",
              "text-6xl font-medium leading-tight",
              "will-change-transform",
            ].join(" ")}
          >
            <ReactMarkdown>
              {description}
            </ReactMarkdown>

          </p>
        )}
      </div>
    </section>
  )
}
