
'use client';

import { useState } from 'react';
import { ProjectCard } from '@/components/projects/project-card';
import { projects } from '@/lib/data';
import { Pagination } from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 8;

export default function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const approvedProjects = projects.filter(p => p.verified);

  const totalPages = Math.ceil(approvedProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = approvedProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
         {totalPages > 1 && (
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        )}
    </div>
  );
}
