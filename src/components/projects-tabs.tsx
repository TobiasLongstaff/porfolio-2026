interface ProjectsTabsProps {
  companies: string[];
  selectedCompany: string;
  onCompanyChange: (company: string) => void;
}

export default function ProjectsTabs({ companies, selectedCompany, onCompanyChange }: ProjectsTabsProps) {
  return (
    <div 
      role="group"
      aria-label="Filtrar proyectos por empresa"
      className="max-w-[calc(100vw-2rem)] overflow-x-auto px-[10px] py-[12px] rounded-full shadow-soft bg-white flex gap-[10px]"
    >
      {companies.map((company) => {
        const isSelected = selectedCompany === company;
        return (
          <button
            key={company}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onCompanyChange(company)}
            className={`h-[52px] sm:h-[60px] px-[20px] flex-shrink-0 font-medium text-lg sm:text-2xl rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
              isSelected
                ? "bg-secondary text-primary"
                : "text-text-secondary hover:bg-secondary"
            }`}
          >
            {company}
          </button>
        );
      })}
    </div>
  );
}
