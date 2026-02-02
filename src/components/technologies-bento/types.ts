import type { CollectionEntry } from 'astro:content';
import type { IconType } from 'react-icons';
import { getTechIcon } from '@/lib/techIcons';

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  textAutoHide?: boolean;
  disableAnimations?: boolean;
  icon?: ReturnType<typeof getTechIcon>;
  count?: number;
  category?: string;
}

export interface BentoProps {
  technologies?: CollectionEntry<'technologies'>[];
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

export interface CardData {
  title: string;
  description: string;
  label: string;
  icon: IconType | null;
  technologies: Array<{ name: string; icon: IconType | null; color: string }> | null;
  image?: string;
  category?: string;
  order: number;
}
