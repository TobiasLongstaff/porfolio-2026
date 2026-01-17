import { useState, useMemo, useRef } from 'react';
import type { CollectionEntry } from 'astro:content';
import ProjectsTabs from './ProjectsTabs.tsx';
import ProjectsCarousel from './ProjectsCarousel.tsx';

interface ProjectsFilterProps {
  projects: CollectionEntry<"projects">[];
  companies: string[];
  initialCompany: string;
}

export default function ProjectsFilter({ projects, companies, initialCompany }: ProjectsFilterProps) {
  const ALL_COMPANIES = "Todos";
  const [selectedCompany, setSelectedCompany] = useState<string>(ALL_COMPANIES);
  const previousCompanyRef = useRef<string>(ALL_COMPANIES);

  const handleCompanyChange = (company: string) => {
    previousCompanyRef.current = selectedCompany;
    setSelectedCompany(company);
  };

  const filteredProjects = useMemo(() => {
    if (selectedCompany === ALL_COMPANIES) {
      return projects;
    }
    return projects.filter(p => p.data.company === selectedCompany);
  }, [projects, selectedCompany]);

  const slideDirection = useMemo(() => {
    const allCompaniesWithAll = [ALL_COMPANIES, ...companies];
    const currentIndex = allCompaniesWithAll.indexOf(selectedCompany);
    const previousIndex = allCompaniesWithAll.indexOf(previousCompanyRef.current);
    return currentIndex > previousIndex ? 'right' : 'left';
  }, [selectedCompany, companies]);

  const allCompanies = [ALL_COMPANIES, ...companies];

  return (
    <>
      <ProjectsTabs
        companies={allCompanies}
        selectedCompany={selectedCompany}
        onCompanyChange={handleCompanyChange}
      />
      {filteredProjects.length > 0 && (
        <ProjectsCarousel items={filteredProjects} slideDirection={slideDirection} />
      )}
    </>
  );
}
