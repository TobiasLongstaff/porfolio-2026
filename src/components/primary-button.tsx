import React from 'react';
import type { IconType } from 'react-icons';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: IconType;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
}

export default function PrimaryButton({
  children,
  onClick,
  icon: Icon,
  iconPosition = 'right',
  className = '',
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold border border-gray-200 cursor-pointer shadow-sm w-fit ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </button>
  );
}
