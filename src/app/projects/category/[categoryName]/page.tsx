
'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { ProjectCard } from '@/components/projects/project-card';
import { getProjects } from '@/services/projects-service';
import type { Project } from '@/lib/data';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { HeartHandshake, BookOpen, Ambulance, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 8;

const categoryInfo: Record<string, { icon: React.ElementType, title: string, description: string, color: string }> = {
    Education: {
        icon: BookOpen,
        title: 'Education Campaigns',
        description: 'Projects focused on providing access to quality education, building schools, and supplying learning materials.',
        color: 'text-blue-600',
    },
    Health: {
        icon: Ambulance,
        title: 'Health Campaigns',
        description: 'Initiatives aimed at improving healthcare access, providing medical supplies, and promoting community wellness.',
        color: 'text-green-600',
    },
    Relief: {
        icon: ShieldAlert,
        title: 'Relief Campaigns',
        description: 'Emergency response projects for natural disasters, providing food, shelter, and immediate aid to affected communities.',
        color: 'text-red-600',
    },
    Community: {
        icon: HeartHandshake,
        title: 'Community Projects',
        description: 'Grassroots campaigns started by users to support local needs and foster community development.',
        color: 'text-purple-600',
    },
};

export default function ProjectCategoryPage() {
  const params = useParams();
  const categoryName = decodeURIComponent(params.categoryName as string);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const info = categoryInfo[categoryName];

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      const fetchedProjects = await getProjects();
      const filtered = fetchedProjects.filter(p => p.category === categoryName && p.verified);
      setProjects(filtered);
      setLoading(false);
    }
    loadProjects();
  }, [categoryName]);

  if (!info && !loading) {
      notFound();
  }

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const paginatedProjects = projects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-8">
        <div className="text-center">
            {info && <info.icon className={cn("mx-auto h-12 w-12", info.color)} />}
            <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">{info?.title || 'Loading...'}</h1>
            <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                {info?.description || 'Please wait while we fetch the campaigns for this category.'}
            </p>
        </div>

        {loading ? (
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
        ) : (
            <>
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
                {paginatedProjects.length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>There are currently no active campaigns in the "{categoryName}" category.</p>
                    </div>
                )}
            </>
        )}
    </div>
  );
}
