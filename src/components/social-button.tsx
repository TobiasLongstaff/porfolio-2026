import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
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

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold border border-gray-200 cursor-pointer shadow-sm w-fit bg-white/80 backdrop-blur-xl"
    >
      <Icon className="w-4 h-4" />
      {label}
    </a>
  );
}
