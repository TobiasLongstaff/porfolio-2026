import React from "react"
import { percentage, formatMonthYear } from "../utils/helpers"
import { TIMELINE_CONSTANTS } from "../utils/constants"
import type { EnrichedExperience } from "../types"

interface TimelineRailProps {
  experiences: EnrichedExperience[]
  group: "indicum" | "rest"
  fillRef: React.RefObject<HTMLDivElement>
  railRef: React.RefObject<HTMLDivElement>
  restStartPosition?: number
  restEndMaxPosition?: number
  restEndCapRef?: React.RefObject<HTMLDivElement>
}

export const TimelineRail: React.FC<TimelineRailProps> = ({
  experiences,
  group,
  fillRef,
  railRef,
  restStartPosition,
  restEndMaxPosition,
  restEndCapRef,
}) => {
  const filteredExperiences = experiences.filter((exp) => exp.group === group)
  const isIndicum = group === "indicum"
  const labelPosition = isIndicum ? "bottom-full mb-3" : "top-full mt-3"

  return (
    <div className="relative h-[30px]">
      <div
        ref={railRef}
        className="absolute inset-0 overflow-visible"
        style={{ left: TIMELINE_CONSTANTS.DOT_INSET, right: TIMELINE_CONSTANTS.DOT_INSET }}
      >
        {/* Track base */}
        {isIndicum ? (
          <div className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-gray rounded-full left-0 right-0" />
        ) : (
          <>
            <div
              className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-gray rounded-full"
              style={{
                left: percentage(restStartPosition ?? 0),
                width: percentage((restEndMaxPosition ?? 1) - (restStartPosition ?? 0)),
              }}
            />
            {restEndCapRef && (
              <div
                ref={restEndCapRef}
                className="absolute top-1/2 bg-gray rounded-full"
                style={{
                  left: percentage(restEndMaxPosition ?? 1),
                  width: 2,
                  height: 18,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </>
        )}

        {/* Fill progress */}
        <div
          ref={fillRef}
          className={`absolute top-1/2 h-[2px] -translate-y-1/2 rounded-full origin-left ${
            isIndicum ? "left-0 right-0" : ""
          } bg-primary`}
          style={
            !isIndicum && restStartPosition !== undefined && restEndMaxPosition !== undefined
              ? {
                  left: percentage(restStartPosition),
                  width: percentage(restEndMaxPosition - restStartPosition),
                }
              : undefined
          }
        />

        {/* Experience points */}
        {filteredExperiences.map(({ experience, key, slotPosition }) => (
          <div
            key={key}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible"
            style={{ left: percentage(slotPosition) }}
          >
            <div
              data-label
              className={`absolute ${labelPosition} left-1/2 -translate-x-1/2 text-center whitespace-nowrap pointer-events-none`}
            >
              <div className="text-lg font-bold">{experience.data.position}</div>
              <div className="text-base capitalize">
                {formatMonthYear(experience.data.startDate)}
              </div>
            </div>

            <div
              data-dot
              title={`${experience.data.position} @ ${experience.data.company}`}
              className="w-7 h-7 rounded-full bg-white border-[2px] border-primary relative flex items-center justify-center"
              style={{ boxShadow: "0 0 0 2px white" }}
            >
              <div data-dot-inner className="w-3 h-3 rounded-full bg-primary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
