import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import PrimaryButton from './primary-button';
import type { IconType } from 'react-icons';

interface SocialButtonProps {
  platform: 'github' | 'linkedin' | 'instagram';
  url: string;
  label: string;
}

const iconMap: Record<string, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
};

export default function SocialButton({ platform, url, label }: SocialButtonProps) {
  const Icon = iconMap[platform];
  
  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <PrimaryButton onClick={handleClick} icon={Icon} iconPosition="left">
      {label}
    </PrimaryButton>
  );
}
