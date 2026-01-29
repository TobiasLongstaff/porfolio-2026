import { 
  SiJavascript, 
  SiJquery, 
  SiPhp, 
  SiMysql, 
  SiReact, 
  SiTypescript, 
  SiLaravel,
  SiStorybook,
  SiHtml5,
  SiCss3,
  SiRedux,
  SiReactrouter,
  SiTailwindcss,
  SiReactquery,
  SiPrimereact,
  SiVitest,
  SiJest,
  SiPrettier,
  SiEslint
} from 'react-icons/si';
import { RiNextjsFill } from "react-icons/ri";
import type { IconType } from 'react-icons';

interface TechIconMap {
  [key: string]: IconType;
}

const techIcons: TechIconMap = {
  'JavaScript': SiJavascript,
  'jQuery': SiJquery,
  'PHP': SiPhp,
  'My SQL': SiMysql,
  'MySQL': SiMysql,
  'React': SiReact,
  'TypeScript': SiTypescript,
  'Laravel': SiLaravel,
  'Storybook': SiStorybook,
  'HTML': SiHtml5,
  'CSS': SiCss3,
  'Redux': SiRedux,
  'React Router': SiReactrouter,
  'Tanstack Query': SiReactquery,
  'React Hook Form': SiReact,
  'Prime React': SiPrimereact ,
  'Tailwind CSS': SiTailwindcss,
  'Next.js': RiNextjsFill,
  'Vitest': SiVitest,
  'Jest': SiJest,
  'Prettier': SiPrettier,
  'ESLint': SiEslint,
};

export function getTechIcon(techName: string): IconType | null {
  const normalized = techName.trim();
  
  if (techIcons[normalized]) {
    return techIcons[normalized];
  }
  
  const found = Object.keys(techIcons).find(
    key => key.toLowerCase() === normalized.toLowerCase()
  );
  
  return found ? techIcons[found] : null;
}

// Colores oficiales de cada tecnología
const techColors: { [key: string]: string } = {
  'JavaScript': '#F7DF1E',
  'TypeScript': '#3178C6',
  'React': '#61DAFB',
  'Next.js': '#000000',
  'HTML': '#E34F26',
  'CSS': '#1572B6',
  'Tailwind CSS': '#06B6D4',
  'Tanstack Query': '#FF4154',
  'React Router': '#CA4245',
  'Prime React': '#00D8FF',
  'Redux': '#764ABC',
  'React Hook Form': '#EC5990',
  'jQuery': '#0769AD',
  'PHP': '#777BB4',
  'MySQL': '#4479A1',
  'Laravel': '#FF2D20',
  'Storybook': '#FF4785',
  'Vitest': '#6E9F18',
  'Jest': '#C21325',
  'Prettier': '#F7B93E',
  'ESLint': '#4B32C3',
};

export function getTechColor(techName: string): string {
  const normalized = techName.trim();
  
  if (techColors[normalized]) {
    return techColors[normalized];
  }
  
  const found = Object.keys(techColors).find(
    key => key.toLowerCase() === normalized.toLowerCase()
  );
  
  return found ? techColors[found] : '#6B7280'; // Color gris por defecto
}

export default techIcons;
