import React from "react"
import ReactMarkdown from "react-markdown"
import { getTechIcon } from "@/lib/techIcons"
import { formatMonthYear } from "../utils/helpers"
import type { CollectionEntry } from "astro:content"

interface ExperienceCardProps {
  experience: CollectionEntry<"experience">
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  return (
    <>
      <div className="relative w-full h-full overflow-hidden rounded-2xl bg-black">
        {/* BLOBS */}
        <div className="absolute inset-0 blur-[150px] opacity-75">
          <div className="absolute -top-[35%] -left-[25%] w-[700px] h-[700px]
          bg-[radial-gradient(circle_at_center,#ff00cc,transparent_60%)]" />

          <div className="absolute top-[0%] -right-[30%] w-[800px] h-[800px]
          bg-[radial-gradient(circle_at_center,#ffe600,transparent_60%)]" />

          <div className="absolute -bottom-[35%] left-[10%] w-[800px] h-[800px]
          bg-[radial-gradient(circle_at_center,#00d4ff,transparent_60%)]" />

          <div className="absolute -bottom-[20%] right-[0%] w-[700px] h-[700px]
          bg-[radial-gradient(circle_at_center,#ff3c00,transparent_60%)]" />
        </div>

        {/* CONTRAST RETRO */}
        <div className="absolute inset-0 magma-contrast" />

        {/* NOISE */}
        <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-40 pointer-events-none" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-white">
        <div className="flex flex-col gap-[15px] justify-center px-8">
          <p className="font-bold text-4xl">{experience.data.company}</p>
          <p className="text-lg">
            {formatMonthYear(experience.data.startDate)} -{" "}
            {experience.data.endDate ? formatMonthYear(experience.data.endDate) : "Actualmente"}
          </p>
          <article className="prose prose-neutral max-w-none text-xl">
            <ReactMarkdown>{experience.body}</ReactMarkdown>
          </article>
          <div className="flex gap-[10px] flex-wrap">
            {experience.data.technologies?.map((tech: string, techIndex: number) => {
              const TechIcon = getTechIcon(tech)
              return (
                <span
                  key={techIndex}
                  className="font-medium text-base rounded-lg shadow-sm px-[20px] py-[5px] flex items-center gap-[8px]"
                >
                  {TechIcon && <TechIcon className="w-5 h-5" />}
                  {tech}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </>

  )
}
