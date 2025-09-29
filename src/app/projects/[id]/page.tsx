

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { projects, type Project } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransparencySealIcon } from '@/components/icons/transparency-seal';
import { PaymentGateways } from '@/components/projects/payment-gateways';
import { DiscussionSection } from '@/components/projects/discussion-section';
import { format } from 'date-fns';
import { DonationDialogWrapper } from '@/components/projects/donation-dialog-wrapper';
import { DonorsList } from '@/components/projects/donors-list';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { FundraisingProgress } from '@/components/projects/fundraising-progress';
import { WishlistTab } from '@/components/projects/wishlist-tab';
import { ProjectPageClientContent } from '@/components/projects/project-page-client-content';


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

          <ProjectPageClientContent project={project} />
          
      </DonationDialogWrapper>
    </div>
  );
}
