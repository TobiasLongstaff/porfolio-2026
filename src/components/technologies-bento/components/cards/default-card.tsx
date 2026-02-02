import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import ReactMarkdown from 'react-markdown';
import type { IconType } from 'react-icons';
import type { CardData } from '../../types';
import { CodeEditorPreview } from '../code-editor-preview';

interface DefaultCardProps {
  card: CardData;
  index: number;
  Icon: IconType | null;
  baseClassName: string;
  cardStyle: React.CSSProperties;
  textAutoHide: boolean;
  enableTilt: boolean;
  enableMagnetism: boolean;
  clickEffect: boolean;
  glowColor: string;
  shouldDisableAnimations: boolean;
}

export const DefaultCard: React.FC<DefaultCardProps> = ({
  card,
  index,
  Icon,
  baseClassName,
  cardStyle,
  textAutoHide,
  enableTilt,
  enableMagnetism,
  clickEffect,
  glowColor,
  shouldDisableAnimations,
}) => {
  return (
    <div
      key={index}
      className={baseClassName}
      style={cardStyle}
      ref={el => {
        if (!el) return;

        const handleMouseMove = (e: MouseEvent) => {
          if (shouldDisableAnimations) return;

          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          if (enableTilt) {
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            gsap.to(el, {
              rotateX,
              rotateY,
              duration: 0.1,
              ease: 'power2.out',
              transformPerspective: 1000
            });
          }

          if (enableMagnetism) {
            const magnetX = (x - centerX) * 0.05;
            const magnetY = (y - centerY) * 0.05;

            gsap.to(el, {
              x: magnetX,
              y: magnetY,
              duration: 0.3,
              ease: 'power2.out'
            });
          }
        };

        const handleMouseLeave = () => {
          if (shouldDisableAnimations) return;

          if (enableTilt) {
            gsap.to(el, {
              rotateX: 0,
              rotateY: 0,
              duration: 0.3,
              ease: 'power2.out'
            });
          }

          if (enableMagnetism) {
            gsap.to(el, {
              x: 0,
              y: 0,
              duration: 0.3,
              ease: 'power2.out'
            });
          }
        };

        const handleClick = (e: MouseEvent) => {
          if (!clickEffect || shouldDisableAnimations) return;

          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const maxDistance = Math.max(
            Math.hypot(x, y),
            Math.hypot(x - rect.width, y),
            Math.hypot(x, y - rect.height),
            Math.hypot(x - rect.width, y - rect.height)
          );

          const ripple = document.createElement('div');
          ripple.style.cssText = `
            position: absolute;
            width: ${maxDistance * 2}px;
            height: ${maxDistance * 2}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(${glowColor}, 0.25) 0%, rgba(${glowColor}, 0.1) 30%, transparent 70%);
            left: ${x - maxDistance}px;
            top: ${y - maxDistance}px;
            pointer-events: none;
            z-index: 1000;
          `;

          el.appendChild(ripple);

          gsap.fromTo(
            ripple,
            {
              scale: 0,
              opacity: 1
            },
            {
              scale: 1,
              opacity: 0,
              duration: 0.8,
              ease: 'power2.out',
              onComplete: () => ripple.remove()
            }
          );
        };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
        el.addEventListener('click', handleClick);
      }}
    >
      <div className="card__header flex justify-between gap-3 relative z-10">
        {Icon && (
          <div className="text-4xl text-primary" style={{ color: `rgb(${glowColor})` }}>
            <Icon />
          </div>
        )}
        <span className="card__label text-sm font-medium opacity-70" style={{ color: 'var(--text-secondary)' }}>
          {card.label}
        </span>
      </div>
      <div className="card__content flex flex-col relative h-full z-10">
        <h3 className={`card__title font-bold text-xl md:text-2xl m-0 mb-2 ${textAutoHide ? 'text-clamp-1' : ''}`} style={{ color: 'var(--text-primary)' }}>
          {card.title}
        </h3>
        <p className={`prose prose-neutral max-w-none font-medium text-base text-text-secondary ${textAutoHide ? 'text-clamp-2' : ''}`} style={{ color: 'var(--text-secondary)' }}>
          <ReactMarkdown>
            {card.description}
          </ReactMarkdown>
        </p>
      </div>

      {/* Editor de código simulado si está disponible */}
      {card.image && (
        <CodeEditorPreview />
      )}
    </div>
  );
};
