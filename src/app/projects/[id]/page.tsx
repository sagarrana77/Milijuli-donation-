import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@/services/projects-service';
import type { Project } from '@/lib/data';
import {
  Card,
} from '@/components/ui/card';
import { TransparencySealIcon } from '@/components/icons/transparency-seal';
import { DonationDialogWrapper } from '@/components/projects/donation-dialog-wrapper';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { ProjectPageClientContent, ProjectPageClientAside } from '@/components/projects/project-page-client-content';
import { RelatedCampaigns } from '@/components/projects/related-campaigns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const categoryColors: Record<string, string> = {
    Education: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    Health: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    Relief: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
    Community: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
};


export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProject(params.id);
  const allProjects = await getProjects();

  if (!project) {
    notFound();
  }

  const relatedProjects = allProjects.filter(p => p.id !== project.id && p.category === project.category);
  const otherProjects = allProjects.filter(p => p.id !== project.id && p.category !== project.category);
  const projectsForCarousel = [...relatedProjects, ...otherProjects];


  return (
    <div className="mx-auto max-w-6xl space-y-12">
      <DonationDialogWrapper project={project}>
          <ScrollFadeIn>
            <header className="mb-8">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                        {project.name}
                        </h1>
                        <Link href={`/projects/category/${project.category}`}>
                            <Badge className={cn("text-base transition-colors", categoryColors[project.category] || "bg-muted text-muted-foreground")}>
                                {project.category}
                            </Badge>
                        </Link>
                    </div>
                    {project.verified && (
                        <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm text-green-600">
                            <TransparencySealIcon className="h-5 w-5 rounded-full animate-subtle-glow" />
                            <span className="font-semibold">Verified Transparent</span>
                        </div>
                    )}
                </div>
                <p className="text-lg text-muted-foreground">{project.organization}</p>
            </header>
          </ScrollFadeIn>
           <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <ScrollFadeIn>
                    <Card className="overflow-hidden">
                         <ProjectPageClientContent project={project} />
                    </Card>
                </ScrollFadeIn>
            </div>
            <ProjectPageClientAside project={project} />
          </div>
      </DonationDialogWrapper>
      
      <RelatedCampaigns projects={projectsForCarousel} />
    </div>
  );
}
