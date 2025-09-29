'use client';

import { useState, useEffect } from 'react';
import { ProjectCard } from '@/components/projects/project-card';
import { getProjects } from '@/services/projects-service';
import type { Project } from '@/lib/data';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 8;

export default function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
      setLoading(false);
    }
    loadProjects();
  }, []);
  
  const approvedProjects = projects.filter(p => p.verified);

  const totalPages = Math.ceil(approvedProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = approvedProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
        </div>
    )
  }

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
