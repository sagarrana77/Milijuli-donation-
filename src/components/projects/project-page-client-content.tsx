
'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Project as typeProject, platformSettings } from '@/lib/data';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { DonorsList } from '@/components/projects/donors-list';
import { DiscussionSection } from '@/components/projects/discussion-section';
import { WishlistTab } from '@/components/projects/wishlist-tab';
import { FundraisingProgress } from '@/components/projects/fundraising-progress';
import { PaymentGateways } from '@/components/projects/payment-gateways';
import { CardHeader, CardTitle, CardDescription } from '../ui/card';
import { usePhotoDialog } from '@/context/image-dialog-provider';
import { InKindDonationsTab } from './in-kind-donations-tab';
import { ArrowRight, Gift, ShoppingCart, Wand2, Loader2, HandCoins, GalleryHorizontal, MessageSquare, History } from 'lucide-react';
import { useState } from 'react';
import { summarizeProject, SummarizeProjectOutput } from '@/ai/flows/summarize-project';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { useDonationContext } from './donation-dialog-wrapper';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { Pagination } from '../ui/pagination';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ProjectPageClientContentProps {
    project: typeof typeProject;
}

const UPDATES_PER_PAGE = 5;

export function ProjectPageClientContent({ project }: ProjectPageClientContentProps) {
    const { openPhoto } = usePhotoDialog();
    const { toast } = useToast();
    const { allUpdates, isClient } = useDonationContext();
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [summary, setSummary] = useState<SummarizeProjectOutput | null>(null);
    const [updatesPage, setUpdatesPage] = useState(1);

    const totalUpdatesPages = Math.ceil(allUpdates.length / UPDATES_PER_PAGE);
    const paginatedUpdates = allUpdates.slice(
        (updatesPage - 1) * UPDATES_PER_PAGE,
        updatesPage * UPDATES_PER_PAGE
    );
    
    const imageUpdates = allUpdates.filter(update => update.imageUrl);


    const handleGenerateSummary = async () => {
        setIsGeneratingSummary(true);
        setSummary(null);
        try {
            const result = await summarizeProject({ name: project.name, longDescription: project.longDescription });
            setSummary(result);
        } catch (error) {
            console.error("Error generating summary:", error);
            toast({
                variant: 'destructive',
                title: 'Error Generating Summary',
                description: 'Could not generate summary. Please try again.'
            });
        } finally {
            setIsGeneratingSummary(false);
        }
    }


    return (
        <>
            <Image
                src={project.imageUrl}
                alt={project.name}
                width={1200}
                height={675}
                className="aspect-video w-full object-cover cursor-pointer"
                data-ai-hint={project.imageHint}
                onClick={() => openPhoto({ imageUrl: project.imageUrl, title: project.name, comments: project.discussion, project })}
                priority
            />
            
            <CardContent className="p-6 space-y-4">
                 {platformSettings.aiSummaryEnabled && (
                    <Button onClick={handleGenerateSummary} disabled={isGeneratingSummary} variant="outline" className="w-full md:w-auto">
                        {isGeneratingSummary ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                        Generate AI Summary
                    </Button>
                 )}

                 {(isGeneratingSummary || summary) && (
                     <Card className="bg-primary/5 border-dashed border-primary/20">
                         <CardHeader>
                             <CardTitle className="flex items-center gap-2 text-primary">
                                 <Wand2 className="h-5 w-5" />
                                 AI-Powered Summary
                             </CardTitle>
                         </CardHeader>
                         <CardContent>
                             {isGeneratingSummary ? (
                                 <div className="space-y-2">
                                     <Skeleton className="h-4 w-full" />
                                     <Skeleton className="h-4 w-full" />
                                     <Skeleton className="h-4 w-3/4" />
                                 </div>
                             ) : (
                                <p className="text-foreground/90">{summary?.summary}</p>
                             )}
                         </CardContent>
                     </Card>
                 )}

                <div className="prose prose-sm max-w-none text-foreground/90" dangerouslySetInnerHTML={{ __html: project.longDescription.replace(/\n/g, '<br />') }} />
            </CardContent>
            
            <ScrollFadeIn asChild delay={200}>
            <TooltipProvider>
            <Tabs defaultValue="updates" className="mt-8 px-6 pb-6">
                <TabsList className="grid w-full grid-cols-6">
                    <Tooltip><TooltipTrigger asChild><TabsTrigger value="updates"><History className="h-4 w-4 md:mr-2"/><span className="hidden md:inline">Updates</span></TabsTrigger></TooltipTrigger><TooltipContent>Updates</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><TabsTrigger value="wishlist"><ShoppingCart className="h-4 w-4 md:mr-2"/><span className="hidden md:inline">Wishlist</span></TabsTrigger></TooltipTrigger><TooltipContent>Wishlist</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><TabsTrigger value="album"><GalleryHorizontal className="h-4 w-4 md:mr-2"/><span className="hidden md:inline">Album</span></TabsTrigger></TooltipTrigger><TooltipContent>Album</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><TabsTrigger value="donors"><HandCoins className="h-4 w-4 md:mr-2"/><span className="hidden md:inline">Donors</span></TabsTrigger></TooltipTrigger><TooltipContent>Donors</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><TabsTrigger value="in-kind"><Gift className="h-4 w-4 md:mr-2"/><span className="hidden md:inline">In-Kind</span></TabsTrigger></TooltipTrigger><TooltipContent>In-Kind</TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><TabsTrigger value="discussion"><MessageSquare className="h-4 w-4 md:mr-2"/><span className="hidden md:inline">Discussion</span></TabsTrigger></TooltipTrigger><TooltipContent>Discussion</TooltipContent></Tooltip>
                </TabsList>
                <TabsContent value="updates" className="mt-4">
                    <Card className="bg-primary/5 border-primary/10">
                        <CardContent className="p-6">
                        {paginatedUpdates.length > 0 ? (
                            <div className="space-y-6">
                            {paginatedUpdates.map(update => {
                                if (update.isTransfer) {
                                return (
                                    <div key={update.id} className="flex items-start gap-4 rounded-md border bg-card p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <ArrowRight className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{update.title}</p>
                                            <div className="text-sm text-muted-foreground">
                                                {isClient ? format(new Date(update.date), 'PPP') : <Skeleton className="h-4 w-24" />}
                                            </div>
                                            <p className="mt-2 text-sm text-foreground/80">{update.description}</p>
                                        </div>
                                    </div>
                                )
                                }
                                if (update.isExpense) {
                                    return (
                                        <div key={update.id} className="flex items-start gap-4 rounded-md border bg-card p-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-600">
                                                <ShoppingCart className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{update.title}</p>
                                                <div className="text-sm text-muted-foreground">
                                                    {isClient ? format(new Date(update.date), 'PPP') : <Skeleton className="h-4 w-24" />}
                                                </div>
                                                <p className="mt-2 text-sm text-foreground/80">{update.description}</p>
                                            </div>
                                        </div>
                                    )
                                }
                                if (update.isInKindDonation) {
                                return (
                                        <div key={update.id} className="flex items-start gap-4 rounded-md border bg-green-500/10 p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                                            <Gift className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{update.title}</p>
                                            <div className="text-sm text-muted-foreground">
                                                {isClient ? format(new Date(update.date), 'PPP') : <Skeleton className="h-4 w-24" />}
                                            </div>
                                            <p className="mt-2 text-sm text-foreground/80">{update.description}</p>
                                        </div>
                                    </div>
                                )
                                }
                                if(update.isMonetaryDonation && update.monetaryDonationDetails) {
                                    return (
                                        <div key={update.id} className="flex items-start gap-4 rounded-md border bg-card p-4">
                                            <Link href={update.monetaryDonationDetails.donorProfileUrl}>
                                                <Avatar className="h-10 w-10 border">
                                                    <AvatarImage src={update.monetaryDonationDetails.donorAvatarUrl} alt={update.monetaryDonationDetails.donorName} />
                                                    <AvatarFallback>{update.monetaryDonationDetails.donorName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            </Link>
                                            <div>
                                                <div className="flex items-baseline gap-2">
                                                    <div className="text-sm">
                                                        <Link href={update.monetaryDonationDetails.donorProfileUrl} className="font-semibold hover:underline">
                                                            {update.monetaryDonationDetails.donorName}
                                                        </Link>
                                                        {' '}donated <span className="font-bold text-primary">Rs.{update.monetaryDonationDetails.amount.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                  {isClient ? (
                                                    format(new Date(update.date), 'PPp')
                                                  ) : (
                                                    <div className="h-4 w-24"><Skeleton /></div>
                                                  )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                return (
                                <div key={update.id} className="flex flex-col gap-4 sm:flex-row rounded-md border bg-card p-4">
                                {update.imageUrl && (
                                    <Image 
                                        src={update.imageUrl} 
                                        alt={update.title} 
                                        width={200} 
                                        height={150} 
                                        className="aspect-video w-full rounded-md object-cover sm:w-48 cursor-pointer" 
                                        data-ai-hint={update.imageHint} 
                                        onClick={() => openPhoto({ imageUrl: update.imageUrl!, title: update.title, comments: update.comments, project, update })}
                                    />
                                )}
                                <div>
                                    <p className="font-semibold">{update.title}</p>
                                    <div className="text-sm text-muted-foreground">
                                        {isClient ? format(new Date(update.date), 'PPP') : <Skeleton className="h-4 w-24" />}
                                    </div>
                                    <p className="mt-2 text-sm text-foreground/80">{update.description}</p>
                                </div>
                                </div>
                                )
                            })}
                            </div>
                        ) : <p className="text-muted-foreground">No updates posted yet.</p>}
                        </CardContent>
                        {totalUpdatesPages > 1 && (
                            <CardFooter>
                                <Pagination
                                    currentPage={updatesPage}
                                    totalPages={totalUpdatesPages}
                                    onPageChange={setUpdatesPage}
                                />
                            </CardFooter>
                        )}
                    </Card>
                </TabsContent>
                <TabsContent value="wishlist" className="mt-4">
                    <WishlistTab />
                </TabsContent>
                <TabsContent value="album" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><GalleryHorizontal /> Project Album</CardTitle>
                            <CardDescription>A collection of all images from project updates.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {imageUpdates.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {imageUpdates.map(update => (
                                        <div key={`album-${update.id}`} className="aspect-square relative rounded-lg overflow-hidden cursor-pointer group" onClick={() => openPhoto({ imageUrl: update.imageUrl!, title: update.title, comments: update.comments, project, update })}>
                                            <Image 
                                                src={update.imageUrl!} 
                                                alt={update.title} 
                                                fill
                                                className="object-cover transition-transform group-hover:scale-110"
                                                data-ai-hint={update.imageHint} 
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                                <p className="text-white text-xs font-medium line-clamp-2">{update.title}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">No images have been posted in updates yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="donors" className="mt-4">
                    <DonorsList />
                </TabsContent>
                <TabsContent value="in-kind" className="mt-4">
                    <InKindDonationsTab />
                </TabsContent>
                <TabsContent value="discussion" className="mt-4">
                <Card>
                    <DiscussionSection
                        comments={project.discussion}
                        projectId={project.id}
                    />
                </Card>
                </TabsContent>
            </Tabs>
            </TooltipProvider>
            </ScrollFadeIn>
      </>
    )
}

export function ProjectPageClientAside({ project }: { project: typeof typeProject }) {
     return (
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
                    <PaymentGateways project={project} />
                </CardContent>
            </Card>
            </ScrollFadeIn>
        </aside>
    )
}
