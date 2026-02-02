import React from 'react';

interface BentoCardGridProps {
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
}

export const BentoCardGrid: React.FC<BentoCardGridProps> = ({ children, gridRef }) => (
  <div
    className="bento-section grid gap-2 p-3 w-full h-full select-none relative"
    style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.5rem)' }}
    ref={gridRef}
  >
    {children}
  </div>
);
