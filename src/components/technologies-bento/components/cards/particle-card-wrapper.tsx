import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { IconType } from 'react-icons';
import type { CardData } from '../../types';
import { ParticleCard } from '../particle-card';
import { CodeEditorPreview } from '../code-editor-preview';

interface ParticleCardWrapperProps {
  card: CardData;
  index: number;
  Icon: IconType | null;
  baseClassName: string;
  cardStyle: React.CSSProperties;
  textAutoHide: boolean;
  disableAnimations: boolean;
  particleCount: number;
  glowColor: string;
  enableTilt: boolean;
  clickEffect: boolean;
  enableMagnetism: boolean;
}

export const ParticleCardWrapper: React.FC<ParticleCardWrapperProps> = ({
  card,
  index,
  Icon,
  baseClassName,
  cardStyle,
  textAutoHide,
  disableAnimations,
  particleCount,
  glowColor,
  enableTilt,
  clickEffect,
  enableMagnetism,
}) => {
  return (
    <ParticleCard
      key={index}
      className={baseClassName}
      style={cardStyle}
      disableAnimations={disableAnimations}
      particleCount={particleCount}
      glowColor={glowColor}
      enableTilt={enableTilt}
      clickEffect={clickEffect}
      enableMagnetism={enableMagnetism}
    >
      <div className="card__header flex justify-between gap-3 relative">
        {Icon && (
          <div className="text-4xl text-primary" style={{ color: `rgb(${glowColor})` }}>
            <Icon />
          </div>
        )}
        <span className="card__label text-sm font-medium opacity-70" style={{ color: 'var(--text-secondary)' }}>
          {card.label}
        </span>
      </div>
      <div className="card__content flex flex-col relative">
        <h3 className={`card__title font-bold text-xl md:text-2xl m-0 mb-2 ${textAutoHide ? 'text-clamp-1' : ''}`} style={{ color: 'var(--text-primary)' }}>
          {card.title}
        </h3>
        <p
          className={`card__description text-sm leading-5 ${textAutoHide ? 'text-clamp-2' : ''}`}
          style={{ color: 'var(--text-secondary)' }}
        >
          {card.description}
        </p>
      </div>

      {/* Editor de código simulado si está disponible */}
      {card.image && (
        <CodeEditorPreview />
      )}
    </ParticleCard>
  );
};
