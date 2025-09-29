
'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TransparencySealIcon } from '@/components/icons/transparency-seal';
import { usePhotoDialog } from '@/context/image-dialog-provider';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { openPhoto } = usePhotoDialog();
  const percentage = Math.round(
    (project.raisedAmount / project.targetAmount) * 100
  );
  
  const isFunded = percentage >= 100;

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="relative p-0">
        <div onClick={() => openPhoto({ imageUrl: project.imageUrl, title: project.name })} className="cursor-pointer">
          <Image
            src={project.imageUrl}
            alt={project.name}
            width={600}
            height={400}
            className="aspect-video w-full object-cover"
            data-ai-hint={project.imageHint}
          />
        </div>
        {project.verified && (
          <div
            className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-green-600 backdrop-blur-sm"
            title="Verified Transparent"
          >
            <TransparencySealIcon className="h-5 w-5 rounded-full animate-subtle-glow" />
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="mb-1 text-lg font-bold leading-tight">
          <Link href={`/projects/${project.id}`}>{project.name}</Link>
        </CardTitle>
        <CardDescription className="text-sm">
          {project.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 p-4 pt-0">
        <div className="w-full">
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>
              ${project.raisedAmount.toLocaleString()} raised
            </span>
            <span>{percentage}%</span>
          </div>
          <Progress value={percentage} aria-label={`${percentage}% funded`} />
        </div>
        <Button asChild className="w-full" variant={isFunded ? 'secondary' : 'default'}>
            <Link href={`/projects/${project.id}`}>
              {isFunded ? 'View Funded Project' : 'Donate Now'}
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
