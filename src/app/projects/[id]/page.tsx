

import { notFound } from 'next/navigation';
import { projects, type Project } from '@/lib/data';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { TransparencySealIcon } from '@/components/icons/transparency-seal';
import { DonationDialogWrapper } from '@/components/projects/donation-dialog-wrapper';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { ProjectPageClientContent, ProjectPageClientAside } from '@/components/projects/project-page-client-content';


function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = getProject(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <DonationDialogWrapper project={project}>
          <ScrollFadeIn>
            <header className="mb-8">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    {project.name}
                    </h1>
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
                        <CardContent className="p-6">
                        <p className="text-base text-foreground/90">
                            {project.longDescription}
                        </p>
                        </CardContent>
                    </Card>
                </ScrollFadeIn>
            </div>
            <ProjectPageClientAside project={project} />
          </div>
      </DonationDialogWrapper>
    </div>
  );
}
