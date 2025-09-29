
'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Project } from '@/lib/data';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { DonorsList } from '@/components/projects/donors-list';
import { DiscussionSection } from '@/components/projects/discussion-section';
import { WishlistTab } from '@/components/projects/wishlist-tab';
import { FundraisingProgress } from '@/components/projects/fundraising-progress';
import { PaymentGateways } from '@/components/projects/payment-gateways';
import { CardHeader, CardTitle } from '../ui/card';
import { usePhotoDialog } from '@/context/image-dialog-provider';

interface ProjectPageClientContentProps {
    project: Project;
}

export function ProjectPageClientContent({ project }: ProjectPageClientContentProps) {
    const { openPhoto } = usePhotoDialog();
    return (
         <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <ScrollFadeIn>
                <Card className="overflow-hidden">
                    <Image
                        src={project.imageUrl}
                        alt={project.name}
                        width={1200}
                        height={675}
                        className="aspect-video w-full object-cover cursor-pointer"
                        data-ai-hint={project.imageHint}
                        onClick={() => openPhoto({ imageUrl: project.imageUrl, title: project.name })}
                        priority
                    />
                    <CardContent className="p-6">
                    <p className="text-base text-foreground/90">
                        {project.longDescription}
                    </p>
                    </CardContent>
                </Card>
                </ScrollFadeIn>
                
              <ScrollFadeIn asChild delay={200}>
                <Tabs defaultValue="updates" className="mt-8">
                    <TabsList>
                    <TabsTrigger value="updates">Updates</TabsTrigger>
                    <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                    <TabsTrigger value="spending">Spending</TabsTrigger>
                    <TabsTrigger value="donors">Donors</TabsTrigger>
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                    </TabsList>
                    <TabsContent value="updates" className="mt-4">
                    <Card>
                        <CardContent className="p-6">
                        {project.updates.length > 0 ? (
                            <div className="space-y-6">
                            {project.updates.map(update => (
                                <div key={update.id} className="flex flex-col gap-4 sm:flex-row">
                                <Image 
                                    src={update.imageUrl} 
                                    alt={update.title} 
                                    width={200} 
                                    height={150} 
                                    className="aspect-video w-full rounded-md object-cover sm:w-48 cursor-pointer" 
                                    data-ai-hint={update.imageHint} 
                                    onClick={() => openPhoto({ imageUrl: update.imageUrl, title: update.title })}
                                />
                                <div>
                                    <p className="font-semibold">{update.title}</p>
                                    <p className="text-sm text-muted-foreground">{format(update.date, 'PPP')}</p>
                                </div>
                                </div>
                            ))}
                            </div>
                        ) : <p className="text-muted-foreground">No updates posted yet.</p>}
                        </CardContent>
                    </Card>
                    </TabsContent>
                    <TabsContent value="wishlist" className="mt-4">
                        <WishlistTab />
                    </TabsContent>
                    <TabsContent value="spending" className="mt-4">
                    <Card>
                        <CardContent className="p-6">
                        {project.expenses.length > 0 ? (
                            <ul className="space-y-4">
                            {project.expenses.map(expense => (
                                <li key={expense.id} className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-medium">{expense.item}</p>
                                    <p className="text-sm text-muted-foreground">{format(expense.date, 'PP')}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="font-semibold">${expense.amount.toLocaleString()}</p>
                                    <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm">View Receipt</Button>
                                    </a>
                                </div>
                                </li>
                            ))}
                            </ul>
                        ) : <p className="text-muted-foreground">No spending recorded yet.</p>}
                        </CardContent>
                    </Card>
                    </TabsContent>
                    <TabsContent value="donors" className="mt-4">
                        <DonorsList projectName={project.name} />
                    </TabsContent>
                    <TabsContent value="discussion" className="mt-4">
                    <DiscussionSection
                        comments={project.discussion}
                        projectId={project.id}
                    />
                    </TabsContent>
                </Tabs>
              </ScrollFadeIn>
            </div>

            <aside className="space-y-8 lg:sticky lg:top-24 self-start">
              <ScrollFadeIn>
                <FundraisingProgress />
              </ScrollFadeIn>
              
              <ScrollFadeIn asChild delay={200}>
                <Card>
                    <CardHeader>
                        <CardTitle>Donate via QR</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <PaymentGateways />
                    </CardContent>
                </Card>
              </ScrollFadeIn>
            </aside>
          </div>
    )
}
