
'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { usePhotoDialog } from '@/context/image-dialog-provider';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { ScrollArea } from './scroll-area';
import { DiscussionSection } from '../projects/discussion-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Button } from './button';
import { ArrowRight } from 'lucide-react';

export function ImageDialog() {
  const { isOpen, closeImage, photoData } = usePhotoDialog();

  if (!isOpen || !photoData) {
    return null;
  }

  const { imageUrl, imageAlt, title, donor, project, comments } = photoData;

  const hasDonorInfo = donor && project;

  return (
    <Dialog open={isOpen} onOpenChange={closeImage}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 h-full overflow-hidden">
          <div className="relative bg-black flex items-center justify-center h-full w-full">
            <Image
              src={imageUrl}
              alt={imageAlt || title}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col h-full overflow-y-auto border-t md:border-t-0 md:border-l">
            <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <Tabs defaultValue={hasDonorInfo ? "donor" : "discussion"}>
                      <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="donor" disabled={!hasDonorInfo}>Donor Info</TabsTrigger>
                          <TabsTrigger value="discussion">Discussion</TabsTrigger>
                      </TabsList>
                      {hasDonorInfo && (
                        <TabsContent value="donor" className="mt-4">
                          <Card>
                              <CardHeader>
                                  <CardTitle>{title}</CardTitle>
                                  <CardDescription>A generous contribution to the <Link href={`/projects/${project.id}`} className="text-primary hover:underline">{project.name}</Link> project.</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                  <div className="flex items-center gap-4 rounded-lg border p-4">
                                       <Avatar className="h-16 w-16 border">
                                          <AvatarImage
                                          src={donor.avatarUrl}
                                          alt={donor.name}
                                          />
                                          <AvatarFallback>{donor.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                          <div className="font-bold text-lg">Donated by {donor.name}</div>
                                          <p className="text-sm text-muted-foreground line-clamp-2">{donor.bio}</p>
                                      </div>
                                  </div>
                                  <Button asChild variant="outline" className="w-full">
                                      <Link href={donor.profileUrl}>View Donor's Profile <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                  </Button>
                              </CardContent>
                          </Card>
                        </TabsContent>
                      )}
                       <TabsContent value="discussion" className="mt-4">
                            <DiscussionSection comments={comments || []} projectId="photo-dialog" />
                       </TabsContent>
                    </Tabs>
                </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
