import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import ReactMarkdown from 'react-markdown';
import type { CardData } from '../../types';
import { getTechColor } from '@/lib/techIcons';
import { CodeEditorPreview } from '../CodeEditorPreview';

interface TechnologiesGridCardProps {
  card: CardData;
  index: number;
  baseClassName: string;
  cardStyle: React.CSSProperties;
  textAutoHide: boolean;
  enableTilt: boolean;
  enableMagnetism: boolean;
  clickEffect: boolean;
  glowColor: string;
  shouldDisableAnimations: boolean;
}

export const TechnologiesGridCard: React.FC<TechnologiesGridCardProps> = ({
  card,
  index,
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
      {/* Área de iconos ordenados en grid intercalado */}
      <div className="tech-icons-grid grid grid-rows-3 gap-3 mb-4">
        {card.technologies && card.technologies.map((tech, techIndex) => {
          const TechIcon = tech.icon;
          if (!TechIcon) return null;

          let row = 1;
          let col = 1;

          if (techIndex < 4) {
            row = 1;
            col = (techIndex * 2) + 1;
          } else if (techIndex < 8) {
            row = 2;
            col = ((techIndex - 4) * 2) + 2;
          } else {
            row = 3;
            col = ((techIndex - 8) * 2) + 1;
          }

          // Obtener el color específico de la tecnología
          const techColor = tech.color || getTechColor(tech.name);

          return (
            <div
              key={techIndex}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-lg hover:scale-110 transition-all duration-300"
              style={{
                gridRow: row,
                gridColumn: col,
                justifySelf: 'center',
              }}
            >
              <TechIcon className="w-6 h-6 md:w-7 md:h-7" style={{ color: techColor }} />
            </div>
          );
        })}
      </div>

      {/* Título y descripción */}
      <div className="card__content flex flex-col relative mt-auto z-10">
        <h3 className="card__title font-bold text-xl md:text-2xl m-0 mb-2" style={{ color: 'var(--text-primary)' }}>
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
