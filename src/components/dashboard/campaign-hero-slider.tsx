
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Card } from '../ui/card';
import type { Project } from '@/lib/data';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';

interface CampaignHeroSliderProps {
  projects: Project[];
}

export function CampaignHeroSlider({ projects }: CampaignHeroSliderProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const featuredProjects = projects.filter((p) => p.verified).slice(0, 5);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  if (featuredProjects.length === 0) {
    return null;
  }
  
  const handleDotClick = (index: number) => {
    api?.scrollTo(index);
  }

  return (
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent>
          {featuredProjects.map((project) => {
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
                        <Link
                          href={`/projects/${project.id}`}
                          className="hover:underline"
                        >
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
                          <Progress
                            value={percentage}
                            aria-label={`${percentage}% funded`}
                            className="h-2"
                          />
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
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
      </Carousel>
       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {Array.from({ length: count }).map((_, index) => (
            <button key={index} onClick={() => handleDotClick(index)}>
                <span className={cn(
                    "block h-2 w-2 rounded-full transition-all",
                    current === index ? "w-4 bg-white" : "bg-white/50"
                )} />
                <span className="sr-only">Go to slide {index + 1}</span>
            </button>
        ))}
      </div>
    </div>
  );
}

