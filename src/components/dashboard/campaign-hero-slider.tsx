
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Card } from '../ui/card';
import type { Project } from '@/lib/data';
import Autoplay from 'embla-carousel-autoplay';

interface CampaignHeroSliderProps {
  projects: Project[];
}

export function CampaignHeroSlider({ projects }: CampaignHeroSliderProps) {
  const featuredProjects = projects.filter(p => p.verified).slice(0, 4);

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <Carousel
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
        className="w-full"
    >
      <CarouselContent>
        {featuredProjects.map(project => {
            const percentage = Math.round(
                (project.raisedAmount / project.targetAmount) * 100
            );

            return (
                 <CarouselItem key={project.id}>
                    <Card className="relative aspect-video w-full overflow-hidden rounded-lg">
                        <Image
                            src={project.imageUrl}
                            alt={project.name}
                            fill
                            className="object-cover"
                            priority
                            data-ai-hint={project.imageHint}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-12">
                            <div className="max-w-2xl text-white">
                                <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">
                                    <Link href={`/projects/${project.id}`} className="hover:underline">
                                        {project.name}
                                    </Link>
                                </h2>
                                <p className="mt-2 hidden max-w-xl text-base md:line-clamp-2">
                                    {project.description}
                                </p>
                                <div className="mt-6">
                                     <div className="w-full max-w-sm">
                                        <div className="mb-1 flex justify-between text-xs text-white/80">
                                            <span>
                                            Rs.{project.raisedAmount.toLocaleString()} raised
                                            </span>
                                            <span>{percentage}%</span>
                                        </div>
                                        <Progress value={percentage} aria-label={`${percentage}% funded`} className="h-2" />
                                    </div>
                                    <Button asChild size="lg" className="mt-4">
                                        <Link href={`/projects/${project.id}`}>
                                            Donate Now
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                 </CarouselItem>
            );
        })}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
}
