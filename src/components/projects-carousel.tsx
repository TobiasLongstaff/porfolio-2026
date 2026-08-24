import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue, type Transition } from 'motion/react';
import type { CollectionEntry } from 'astro:content';
import ReactMarkdown from 'react-markdown';
import { getTechIcon } from '../lib/techIcons';

const DRAG_BUFFER = 50;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const MAX_ITEM_WIDTH = 1490;
const AUTOPLAY_DELAY = 6000;
const SPRING_OPTIONS: Transition = { type: 'spring', stiffness: 300, damping: 30 };

interface ProjectCarouselItemProps {
  project: CollectionEntry<"projects">;
  index: number;
  itemWidth: number;
  trackItemOffset: number;
  x: MotionValue<number>;
  isActive: boolean;
  logicalIndex: number;
  itemCount: number;
  shouldReduceMotion: boolean;
}

function ProjectCarouselItem({ project, index, itemWidth, trackItemOffset, x, isActive, logicalIndex, itemCount, shouldReduceMotion }: ProjectCarouselItemProps) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const outputRange = shouldReduceMotion ? [0, 0, 0] : [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  return (
    <motion.div
      role="group"
      aria-roledescription="slide"
      aria-label={`${logicalIndex + 1} de ${itemCount}: ${project.data.title}`}
      aria-hidden={!isActive}
      className="flex flex-col lg:flex-row gap-6 lg:gap-[15px] flex-shrink-0 rounded-[24px] lg:rounded-[40px] border border-white/70 bg-white/35 backdrop-blur-sm backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(255,255,255,0.25),0_30px_80px_rgba(62,55,120,0.16)] p-6 sm:p-10 lg:px-[70px] items-stretch lg:items-center min-h-[560px] lg:h-[600px]"
      style={{
        width: `${itemWidth}px`,
        rotateY: rotateY,
      }}
    >
      <div className='flex flex-col gap-[15px] flex-1 min-w-0'>
        <h3 className="font-bold text-3xl sm:text-4xl">{project.data.title}</h3>
        <div className="font-medium text-lg sm:text-2xl text-text-secondary">
          <ReactMarkdown>{project.body || ''}</ReactMarkdown>
        </div>
        <div className="flex gap-[10px] flex-wrap">
          {project.data.technologies && project.data.technologies.map((tech: string, techIndex: number) => {
            const TechIcon = getTechIcon(tech);
            return (
              <span
                key={techIndex}
                className="font-medium text-base rounded-full border border-white/70 bg-white/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] px-[15px] py-[5px] flex items-center gap-[8px]"
              >
                {TechIcon && <TechIcon aria-hidden="true" className="w-5 h-5" />}
                {tech}
              </span>
            );
          })}
        </div>
      </div>
      <div className="w-full lg:w-1/2 min-h-[220px] lg:h-[370px] rounded-[24px] lg:rounded-[32px] border border-white/75 bg-[linear-gradient(135deg,rgba(237,242,254,0.82),rgba(255,255,255,0.34))] backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_18px_45px_rgba(97,104,237,0.12)] text-primary grid place-items-center flex-shrink-0 text-3xl sm:text-4xl font-bold text-center px-6 sm:px-10">
        {project.data.company}
      </div>
    </motion.div>
  );
}

interface ProjectsCarouselProps {
  items: CollectionEntry<"projects">[];
  slideDirection?: 'left' | 'right';
}

export default function ProjectsCarousel({ items = [], slideDirection = 'right' }: ProjectsCarouselProps) {
  const [itemWidth, setItemWidth] = useState(MAX_ITEM_WIDTH);
  const trackItemOffset = itemWidth + GAP;
  const hasMultipleItems = items.length > 1;
  const startPosition = hasMultipleItems ? 1 : 0;
  const shouldReduceMotion = useReducedMotion() ?? false;

  const itemsForRender = useMemo(() => {
    if (items.length === 0) return [];
    if (!hasMultipleItems) return items;
    return [items[items.length - 1], ...items, items[0]];
  }, [hasMultipleItems, items]);

  const [position, setPosition] = useState(startPosition);
  const positionRef = useRef(startPosition);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const isAutoPlaying = hasMultipleItems && !isHovered && !isFocused && !isPaused && !shouldReduceMotion;

  positionRef.current = position;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      setItemWidth(Math.min(MAX_ITEM_WIDTH, Math.max(0, entry.contentRect.width - 32)));
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return undefined;

    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setPosition(prev => Math.min(prev + 1, itemsForRender.length - 1));
      }
    }, AUTOPLAY_DELAY);

    return () => clearInterval(timer);
  }, [isAutoPlaying, itemsForRender.length]);

  const effectiveTransition = isJumping || shouldReduceMotion ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    if (!hasMultipleItems) {
      setIsAnimating(false);
      return;
    }

    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {
      setIsJumping(true);
      setPosition(1);
      x.set(-trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const finalPosition = items.length;
      setPosition(finalPosition);
      x.set(-finalPosition * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    setIsAnimating(false);
  };

  const move = (direction: -1 | 1) => {
    if (isAnimating || !hasMultipleItems) return;
    setPosition(prev => Math.max(0, Math.min(prev + direction, itemsForRender.length - 1)));
  };

  const handlePanEnd = (_: PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;
    move(direction);
  };

  const activeIndex =
    !hasMultipleItems ? 0 : (position - 1 + items.length) % items.length;

  const carouselKey = items.map(i => i.id).join('-');

  useEffect(() => {
    positionRef.current = startPosition;
    setPosition(startPosition);
    x.set(-startPosition * trackItemOffset);
  }, [carouselKey, startPosition, x]);

  useEffect(() => {
    x.set(-positionRef.current * trackItemOffset);
  }, [trackItemOffset, x]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Proyectos"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={() => setIsFocused(false)}
      className="flex flex-col items-center gap-4 overflow-hidden relative w-full"
    >
      <p className="sr-only" aria-live={isAutoPlaying ? 'off' : 'polite'}>
        Proyecto {activeIndex + 1} de {items.length}: {items[activeIndex]?.data.title}
      </p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={carouselKey}
          className={`flex items-center touch-pan-y select-none ${hasMultipleItems ? 'cursor-grab active:cursor-grabbing' : ''}`}
          style={{
            width: itemWidth,
            gap: `${GAP}px`,
            perspective: 1000,
            perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
            x
          }}
          onPanEnd={handlePanEnd}
          onPanStart={() => setIsPaused(true)}
          animate={{ x: -(position * trackItemOffset), opacity: 1 }}
          transition={effectiveTransition}
          onAnimationStart={handleAnimationStart}
          onAnimationComplete={handleAnimationComplete}
          initial={shouldReduceMotion ? { x: -(position * trackItemOffset), opacity: 1 } : {
            x: slideDirection === 'right' ? itemWidth : -itemWidth,
            opacity: 0
          }}
          exit={shouldReduceMotion ? { x: -(position * trackItemOffset), opacity: 0, transition: { duration: 0 } } : {
            x: slideDirection === 'right' ? -itemWidth : itemWidth,
            opacity: 0,
            transition: { duration: 0.3 }
          }}
        >
          {itemsForRender.map((project, index) => {
            const logicalIndex = hasMultipleItems ? (index - 1 + items.length) % items.length : 0;
            return (
              <ProjectCarouselItem
                key={`${project.id}-${index}`}
                project={project}
                index={index}
                itemWidth={itemWidth}
                trackItemOffset={trackItemOffset}
                x={x}
                isActive={index === position}
                logicalIndex={logicalIndex}
                itemCount={items.length}
                shouldReduceMotion={shouldReduceMotion}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
      {hasMultipleItems && (
        <div role="group" className="flex flex-wrap items-center justify-center gap-2 px-4" aria-label="Controles del carrusel">
          <button type="button" disabled={isAnimating} onClick={() => move(-1)} className="rounded-full border px-4 py-2 font-medium disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Anterior
          </button>
          {!shouldReduceMotion && (
            <button type="button" onClick={() => setIsPaused(value => !value)} className="rounded-full border px-4 py-2 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              {isPaused ? 'Reanudar' : 'Pausar'}
            </button>
          )}
          <button type="button" disabled={isAnimating} onClick={() => move(1)} className="rounded-full border px-4 py-2 font-medium disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
