import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, type MotionValue, type Transition } from 'motion/react';
import type { CollectionEntry } from 'astro:content';
import { getTechIcon } from '../lib/techIcons';

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS: Transition = { type: 'spring', stiffness: 300, damping: 30 };

interface ProjectCarouselItemProps {
  project: CollectionEntry<"projects">;
  index: number;
  itemWidth: number;
  trackItemOffset: number;
  x: MotionValue<number>;
  transition: Transition;
}

function ProjectCarouselItem({ project, index, itemWidth, trackItemOffset, x, transition }: ProjectCarouselItemProps) {
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  return (
    <motion.div
      key={`${project.id}-${index}`}
      className="flex gap-[15px] flex-shrink-0 bg-background-alt rounded-[40px] px-[70px] items-center h-[600px]"
      style={{
        width: `${itemWidth}px`,
        rotateY: rotateY,
      }}
      transition={transition}
    >
      <div className='flex flex-col gap-[15px] flex-1 min-w-0'>
        <p className="font-bold text-4xl">{project.data.title}</p>
        <p className="font-medium text-2xl text-text-secondary">
          {project.body || ''}
        </p>
        <div className="flex gap-[10px] flex-wrap">
          {project.data.technologies && project.data.technologies.map((tech: string, techIndex: number) => {
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
      {project.data.image && (
        <img
          src={project.data.image}
          alt={project.data.title}
          className="w-[750px] h-[370px] object-cover flex-shrink-0"
        />
      )}
    </motion.div>
  );
}

interface ProjectsCarouselProps {
  items: CollectionEntry<"projects">[];
  slideDirection?: 'left' | 'right';
}

export default function ProjectsCarousel({ items = [], slideDirection = 'right' }: ProjectsCarouselProps) {
  const itemWidth = 1490;
  const itemHeight = 750;
  const trackItemOffset = itemWidth + GAP;
  const autoplayDelay = 6000;

  const itemsForRender = useMemo(() => {
    if (items.length === 0) return [];
    return [items[items.length - 1], ...items, items[0]];
  }, [items]);

  const [position, setPosition] = useState(1);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  useEffect(() => {
    if (itemsForRender.length <= 1) return undefined;
    if (isHovered) return undefined;

    const timer = setInterval(() => {
      setPosition(prev => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);

    return () => clearInterval(timer);
  }, [isHovered, itemsForRender.length, autoplayDelay]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => {
    setIsAnimating(true);
  };

  const handleAnimationComplete = () => {
    if (itemsForRender.length <= 1) {
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

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;

    if (direction === 0) return;

    setPosition(prev => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const activeIndex =
    items.length === 0 ? 0 : (position - 1 + items.length) % items.length;

  const carouselKey = useMemo(() => {
    return items.map(i => i.id).join('-');
  }, [items]);

  useEffect(() => {
    setPosition(1);
    x.set(-trackItemOffset);
  }, [carouselKey, trackItemOffset, x]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-between overflow-hidden relative w-full"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={carouselKey}
          className="flex items-center"
          drag={isAnimating ? false : 'x'}
          style={{
            width: itemWidth,
            height: itemHeight,
            gap: `${GAP}px`,
            perspective: 1000,
            perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
            x
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(position * trackItemOffset), opacity: 1 }}
          transition={effectiveTransition}
          onAnimationStart={handleAnimationStart}
          onAnimationComplete={handleAnimationComplete}
          initial={{ 
            x: slideDirection === 'right' ? itemWidth : -itemWidth,
            opacity: 0 
          }}
          exit={{ 
            x: slideDirection === 'right' ? -itemWidth : itemWidth,
            opacity: 0,
            transition: { duration: 0.3 }
          }}
        >
        {itemsForRender.map((project, index) => (
          <ProjectCarouselItem
            key={`${project.id}-${index}`}
            project={project}
            index={index}
            itemWidth={itemWidth}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
          />
        ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
