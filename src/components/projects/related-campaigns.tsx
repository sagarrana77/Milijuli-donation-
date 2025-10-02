

'use client';

import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { Project } from '@/lib/data';
import { ProjectCard } from './project-card';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { HeartHandshake } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

interface RelatedCampaignsProps {
  projects: Project[];
}

export function RelatedCampaigns({ projects }: RelatedCampaignsProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
    );

  if (projects.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <HeartHandshake />
          Other Campaigns You Might Like
        </CardTitle>
        <CardDescription>
          Explore other transparent projects and help them reach their goals.
        </CardDescription>
      </CardHeader>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent className="-ml-4 px-4 pb-4">
          {projects.map((project) => (
            <CarouselItem key={project.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="h-full">
                <ProjectCard project={project} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
      </Carousel>
    </Card>
  );
}
