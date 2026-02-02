import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface ProjectsTabsProps {
  companies: string[];
  selectedCompany: string;
  onCompanyChange: (company: string) => void;
}

export default function ProjectsTabs({ companies, selectedCompany, onCompanyChange }: ProjectsTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedIndex = companies.indexOf(selectedCompany);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    buttonRefs.current = buttonRefs.current.slice(0, companies.length);
  }, [companies.length]);

  useEffect(() => {
    const selectedButton = buttonRefs.current[selectedIndex];
    if (selectedButton && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = selectedButton.getBoundingClientRect();
      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width
      });
    }
  }, [selectedIndex, selectedCompany]);

  return (
    <div 
      ref={containerRef}
      className="px-[10px] py-[12px] rounded-full shadow-soft bg-white flex gap-[10px] relative"
    >
      {companies.map((company, index) => {
        const isSelected = selectedCompany === company;
        return (
          <button
            key={company}
            ref={(el) => { buttonRefs.current[index] = el; }}
            onClick={() => onCompanyChange(company)}
            className={`relative h-[60px] px-[20px] font-medium text-2xl rounded-full transition-opacity z-10 ${
              isSelected
                ? "text-primary opacity-100"
                : "text-text-secondary opacity-60 hover:opacity-100"
            }`}
          >
            {company}
          </button>
        );
      })}
      <motion.div
        className="absolute h-[60px] bg-secondary rounded-full z-0"
        layoutId="activeTab"
        initial={false}
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        style={{
          top: '12px'
        }}
      />
    </div>
  );
}
