import { 
  SiJavascript, 
  SiJquery, 
  SiPhp, 
  SiMysql, 
  SiReact, 
  SiTypescript, 
  SiLaravel,
  SiStorybook
} from 'react-icons/si';
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

export default techIcons;
