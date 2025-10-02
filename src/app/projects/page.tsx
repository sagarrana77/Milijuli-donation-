'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectCard } from '@/components/projects/project-card';
import { getProjects } from '@/services/projects-service';
import type { Project } from '@/lib/data';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryStatsCard } from '@/components/categories/category-stats-card';
import { allDonations } from '@/lib/data';
import { CategoryLiveFeed } from '@/components/categories/category-live-feed';
import { HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 8;
const allCategories = ['Education', 'Health', 'Relief', 'Community'];

export default function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  return (
    <div className="space-y-8">
       <div className="text-center">
            <HeartHandshake className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">All Campaigns</h1>
            <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                Explore all the verified transparent projects on our platform. Your contribution can make a world of difference.
            </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-2">
            <Button variant={'default'} onClick={() => router.push(`/projects`)}>
                All
            </Button>
            {allCategories.map(cat => (
                 <Button key={cat} variant={'outline'} onClick={() => router.push(`/projects/category/${cat}`)}>
                    {cat}
                </Button>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 lg:order-1">
                {loading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {paginatedProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="mt-8">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                        {paginatedProjects.length === 0 && (
                            <div className="text-center py-16 text-muted-foreground border rounded-lg bg-card">
                                <p>There are currently no active campaigns.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
            <aside className="lg:col-span-1 lg:order-2 space-y-8 lg:sticky top-24 self-start">
                <CategoryStatsCard projects={approvedProjects} allDonations={allDonations} />
                <CategoryLiveFeed projects={approvedProjects} />
            </aside>
        </div>
    </div>
  );
}
