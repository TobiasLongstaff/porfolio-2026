import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import ReactMarkdown from 'react-markdown';
import type { CardData } from '../../types';
import { getTechColor } from '@/lib/techIcons';

interface TestingQualityCardProps {
  card: CardData;
  index: number;
  baseClassName: string;
  cardStyle: React.CSSProperties;
  textAutoHide: boolean;
  enableTilt: boolean;
  shouldDisableAnimations: boolean;
}

export const TestingQualityCard: React.FC<TestingQualityCardProps> = ({
  card,
  index,
  baseClassName,
  cardStyle,
  textAutoHide,
  enableTilt,
  shouldDisableAnimations,
}) => {
  // Obtener las tecnologías disponibles
  const technologies = card.technologies || [];
  const displayedTechs = technologies.slice(0, 4);
  // Crear array de 4 elementos, rellenando con null si faltan
  const iconSlots = Array.from({ length: 4 }, (_, i) => displayedTechs[i] || null);

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
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            gsap.to(el, {
              rotateX,
              rotateY,
              duration: 0.1,
              ease: 'power2.out',
              transformPerspective: 1000
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
        };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);
      }}
    >
      {/* Subtítulo con icono */}
      <div className="flex items-center gap-2 mb-3">
        <span className="card__label text-sm font-medium opacity-70" style={{ color: 'var(--text-secondary)' }}>
          {card.title}
        </span>
      </div>

      {/* Título grande */}
      <h3 className="card__title font-bold text-xl md:text-2xl m-0 mb-2" style={{ color: 'var(--text-primary)' }}>
        {card.description}
      </h3>

      {/* Iconos en contenedores cuadrados con glassmorphism */}
      <div className="flex justify-between mt-auto">
        {iconSlots.map((tech, techIndex) => {
          if (!tech || !tech.icon) {
            // Cuadrado vacío para rellenar espacios
            return (
              <div
                key={`empty-${techIndex}`}
                className="w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(10px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 2px rgba(0, 0, 0, 0.05)',
                }}
              />
            );
          }

          const TechIcon = tech.icon;
          const techColor = tech.color || getTechColor(tech.name);

          return (
            <div
              key={techIndex}
              className="w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px) saturate(180%)',
                WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 1px 2px rgba(0, 0, 0, 0.05)',
              }}
            >
              <TechIcon className="w-7 h-7 md:w-8 md:h-8" style={{ color: techColor }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
