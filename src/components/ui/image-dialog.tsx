
'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePhotoDialog } from '@/context/image-dialog-provider';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import Link from 'next/link';
import { Card, CardContent } from './card';
import { DiscussionSection } from '../projects/discussion-section';
import { ScrollArea } from './scroll-area';

export function ImageDialog() {
  const { isOpen, closeImage, photoData } = usePhotoDialog();

  if (!isOpen || !photoData) {
    return null;
  }

  const { imageUrl, imageAlt, title, donor, project, comments } = photoData;

  return (
    <Dialog open={isOpen} onOpenChange={closeImage}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 h-full overflow-hidden">
          <div className="relative bg-black hidden md:flex items-center justify-center">
            <Image
              src={imageUrl}
              alt={imageAlt || 'Full screen image'}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col h-full">
            <div className="relative bg-black flex md:hidden items-center justify-center aspect-video">
                <Image
                src={imageUrl}
                alt={imageAlt || 'Full screen image'}
                fill
                className="object-contain"
                />
            </div>
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                {donor && project && (
                    <Card>
                        <CardContent className="p-4">
                            <p className="font-semibold text-lg">{title}</p>
                            <p className="text-sm text-muted-foreground">
                                for <Link href={`/projects/${project.id}`} className="text-primary hover:underline">{project.name}</Link>
                            </p>
                            <div className="mt-4">
                                <Link href={donor.profileUrl} className="flex items-center gap-3 w-full">
                                    <Avatar className="h-10 w-10 border">
                                        <AvatarImage
                                        src={donor.avatarUrl}
                                        alt={donor.name}
                                        />
                                        <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">Donated by {donor.name}</div>
                                    </div>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <DiscussionSection comments={comments || []} projectId="photo-dialog" />
                </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
