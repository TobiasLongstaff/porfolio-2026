import React, { useRef, useMemo } from 'react';
import type { BentoProps, CardData } from './types';
import { DEFAULT_PARTICLE_COUNT, DEFAULT_SPOTLIGHT_RADIUS, DEFAULT_GLOW_COLOR } from './constants';
import { useMobileDetection } from './hooks/use-mobile-detection';
import { getTechIcon, getTechColor } from '@/lib/techIcons';
import { GlobalSpotlight } from './components/global-spotlight';
import { BentoCardGrid } from './components/bento-card-grid';
import { ParticleCardWrapper } from './components/cards/particle-card-wrapper';
import { TestingQualityCard } from './components/cards/testing-quality-card';
import { TechnologiesGridCard } from './components/cards/technologies-grid-card';
import { DefaultCard } from './components/cards/default-card';

const MagicBento: React.FC<BentoProps> = ({
  technologies = [],
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  // Procesar tecnologías de la colección con orden personalizado
  const cardData = useMemo(() => {
    const mapped = technologies.map((tech) => {
      // Si tiene múltiples tecnologías, crear array de iconos
      const techIcons = tech.data.technologies
        ? tech.data.technologies.map(techName => ({
            name: techName,
            icon: getTechIcon(techName)
          }))
        : null;

      return {
        title: tech.data.name,
        description: tech.body,
        label: tech.data.category || tech.data.name,
        icon: techIcons ? null : getTechIcon(tech.data.name), // Icono único solo si no hay múltiples
        technologies: techIcons ? techIcons.map(t => ({
          ...t,
          color: getTechColor(t.name)
        })) : null, // Array de tecnologías con iconos y colores
        image: tech.data.image, // Imagen opcional para la tarjeta
        category: tech.data.category,
        order: tech.data.order ?? 999, // Si no tiene order, va al final
      };
    });

    // Ordenar por order
    return mapped.sort((a, b) => {
      return a.order - b.order;
    });
  }, [technologies]);

  return (
    <>
      <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color: ${glowColor};
            --border-color: var(--background-alt);
            --background-light: rgb(255, 255, 255);
            --background-alt: rgb(241, 245, 249);
            --text-primary: rgb(47, 46, 51);
            --text-secondary: rgb(133, 135, 139);
            --primary-color: rgba(${glowColor}, 1);
            --primary-glow: rgba(${glowColor}, 0.15);
            --primary-border: rgba(${glowColor}, 0.3);
          }
          
          .bento-section {
            width: 100%;
            height: 100%;
            max-width: 100vw;
            padding: clamp(0.5rem, 2vw, 1.5rem);
          }
          
          .card-responsive {
            grid-template-columns: 1fr;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            gap: clamp(0.5rem, 1.5vw, 1rem);
          }
          
          @media (min-width: 600px) {
            .card-responsive {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (min-width: 1024px) {
            .card-responsive {
              grid-template-columns: repeat(4, 1fr);
              grid-auto-rows: minmax(200px, 1fr);
            }
            
            /* Estilos por posición personalizada */
            .card-responsive .card[data-grid-position="1"] {
              grid-column: 1;
              grid-row: 1;
            }
            
            .card-responsive .card[data-grid-position="2"] {
              grid-column: 2;
              grid-row: 1;
            }
            
            .card-responsive .card[data-grid-position="3"] {
              grid-column: span 2;
              grid-row: span 2;
            }
            
            .card-responsive .card[data-grid-position="4"] {
              grid-column: 1 / span 2;
              grid-row: 2 / span 2;
            }
            
            .card-responsive .card[data-grid-position="5"] {
              grid-column: 3;
              grid-row: 2;
            }
            
            .card-responsive .card[data-grid-position="6"] {
              grid-column: 4;
              grid-row: 3;
            }
            
            /* Fallback: si no hay gridPosition, usar nth-child como antes */
            .card-responsive .card:not([data-grid-position]):nth-child(3) {
              grid-column: span 2;
              grid-row: span 2;
            }
            
            .card-responsive .card:not([data-grid-position]):nth-child(4) {
              grid-column: 1 / span 2;
              grid-row: 2 / span 2;
            }
            
            .card-responsive .card:not([data-grid-position]):nth-child(6) {
              grid-column: 4;
              grid-row: 3;
            }
          }
          
          @media (min-width: 1440px) {
            .bento-section {
              max-width: 90vw;
              margin: 0 auto;
            }
          }
          
          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.2)) 30%,
                transparent 60%);
            border-radius: inherit;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          
          .card--border-glow:hover::after {
            opacity: 1;
          }
          
          .card--border-glow:hover {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 0 30px rgba(${glowColor}, 0.15);
          }
          
          .particle::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: rgba(${glowColor}, 0.15);
            border-radius: 50%;
            z-index: -1;
          }
          
          .particle-container:hover {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05), 0 0 30px rgba(${glowColor}, 0.1);
          }
          
          .text-clamp-1 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .text-clamp-2 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
          }
          
          .tech-icons-grid {
            grid-template-columns: repeat(8, 1fr);
            grid-auto-rows: minmax(60px, auto);
            width: 100%;
            padding: 0.5rem;
          }
          
          @media (max-width: 599px) {
            .bento-section {
              padding: 1rem;
            }
            
            .card-responsive {
              grid-template-columns: 1fr;
              width: 100%;
              height: auto;
              gap: 1rem;
            }
            
            .card-responsive .card {
              width: 100%;
              min-height: 180px;
              max-height: 250px;
            }
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        <div className="card-responsive grid gap-2">
          {cardData.map((card, index) => {
            const Icon = card.icon;
            const baseClassName = `card flex flex-col justify-between relative w-full h-full min-h-[180px] max-h-full p-4 md:p-5 rounded-[20px] border border-solid font-light transition-colors duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] ${enableBorderGlow ? 'card--border-glow' : ''
              } overflow-hidden`;

            const cardStyle = {
              transition: 'all 0.3s ease',
              backgroundColor: 'var(--background-light)',
              borderColor: 'var(--background-alt)',
              color: 'var(--text-primary)',
              '--glow-x': '50%',
              '--glow-y': '50%',
              '--glow-intensity': '0',
              '--glow-radius': '200px'
            } as React.CSSProperties;

            // Card con ParticleCard cuando enableStars está activo
            if (enableStars) {
              return (
                <ParticleCardWrapper
                  key={index}
                  card={card}
                  index={index}
                  Icon={Icon}
                  baseClassName={baseClassName}
                  cardStyle={cardStyle}
                  textAutoHide={textAutoHide}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                />
              );
            }

            // Si tiene múltiples tecnologías, renderizar diseño especial
            if (card.technologies && card.technologies.length > 0) {
              // Diseño especial para Testing y Calidad de Código
              if (card.category === 'Testing y Calidad de Código') {
                return (
                  <TestingQualityCard
                    key={index}
                    card={card}
                    index={index}
                    baseClassName={baseClassName}
                    cardStyle={cardStyle}
                    textAutoHide={textAutoHide}
                    enableTilt={enableTilt}
                    shouldDisableAnimations={shouldDisableAnimations}
                  />
                );
              }

              // Diseño original para otras cards con múltiples tecnologías
              return (
                <TechnologiesGridCard
                  key={index}
                  card={card}
                  index={index}
                  baseClassName={baseClassName}
                  cardStyle={cardStyle}
                  textAutoHide={textAutoHide}
                  enableTilt={enableTilt}
                  enableMagnetism={enableMagnetism}
                  clickEffect={clickEffect}
                  glowColor={glowColor}
                  shouldDisableAnimations={shouldDisableAnimations}
                />
              );
            }

            // Card por defecto
            return (
              <DefaultCard
                key={index}
                card={card}
                index={index}
                Icon={Icon}
                baseClassName={baseClassName}
                cardStyle={cardStyle}
                textAutoHide={textAutoHide}
                enableTilt={enableTilt}
                enableMagnetism={enableMagnetism}
                clickEffect={clickEffect}
                glowColor={glowColor}
                shouldDisableAnimations={shouldDisableAnimations}
              />
            );
          })}
        </div>
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;
export type { BentoProps, BentoCardProps } from './types';
