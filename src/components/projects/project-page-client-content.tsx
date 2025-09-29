

'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { project as typeProject, platformSettings } from '@/lib/data';
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in';
import { DonorsList } from '@/components/projects/donors-list';
import { DiscussionSection } from '@/components/projects/discussion-section';
import { WishlistTab } from '@/components/projects/wishlist-tab';
import { FundraisingProgress } from '@/components/projects/fundraising-progress';
import { PaymentGateways } from '@/components/projects/payment-gateways';
import { CardHeader, CardTitle, CardDescription } from '../ui/card';
import { usePhotoDialog } from '@/context/image-dialog-provider';
import { InKindDonationsTab } from './in-kind-donations-tab';
import { ArrowRight, Gift, ShoppingCart, Wand2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { summarizeProject, SummarizeProjectOutput } from '@/ai/flows/summarize-project';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

interface ProjectPageClientContentProps {
    project: typeof typeProject;
}

export function ProjectPageClientContent({ project }: ProjectPageClientContentProps) {
    const { openPhoto } = usePhotoDialog();
    const { toast } = useToast();
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [summary, setSummary] = useState<SummarizeProjectOutput | null>(null);

    const handleGenerateSummary = async () => {
        setIsGeneratingSummary(true);
        setSummary(null);
        try {
            const result = await summarizeProject({ projectId: project.id });
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
                onClick={() => openPhoto({ imageUrl: project.imageUrl, title: project.name, comments: project.discussion })}
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

                <p className="text-base text-foreground/90">
                    {project.longDescription}
                </p>
            </CardContent>
            
            <ScrollFadeIn asChild delay={200}>
            <Tabs defaultValue="updates" className="mt-8 px-6 pb-6">
                <TabsList>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                <TabsTrigger value="spending">Spending</TabsTrigger>
                <TabsTrigger value="donors">Donors</TabsTrigger>
                <TabsTrigger value="in-kind">In-Kind Donations</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                </TabsList>
                <TabsContent value="updates" className="mt-4">
                    <Card className="bg-primary/5 border-primary/10">
                        <CardContent className="p-6">
                        {project.updates.length > 0 ? (
                            <div className="space-y-6">
                            {project.updates.map(update => {
                                if (update.isTransfer) {
                                return (
                                    <div key={update.id} className="flex items-start gap-4 rounded-md border bg-card p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <ArrowRight className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{update.title}</p>
                                            <p className="text-sm text-muted-foreground">{format(new Date(update.date), 'PPP')}</p>
                                            <p className="mt-2 text-sm text-foreground/80">{update.description}</p>
                                        </div>
                                    </div>
                                )
                                }
                                if (update.isExpense) {
                                    return (
                                        <div key={update.id} className="flex items-start gap-4 rounded-md border bg-orange-500/10 p-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-600">
                                                <ShoppingCart className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{update.title}</p>
                                                <p className="text-sm text-muted-foreground">{format(new Date(update.date), 'PPP')}</p>
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
                                                <p className="text-sm text-muted-foreground">{format(new Date(update.date), 'PPP')}</p>
                                                <p className="mt-2 text-sm text-foreground/80">{update.description}</p>
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
                                        onClick={() => openPhoto({ imageUrl: update.imageUrl!, title: update.title })}
                                    />
                                )}
                                <div>
                                    <p className="font-semibold">{update.title}</p>
                                    <p className="text-sm text-muted-foreground">{format(new Date(update.date), 'PPP')}</p>
                                    <p className="mt-2 text-sm text-foreground/80">{update.description}</p>
                                </div>
                                </div>
                                )
                            })}
                            </div>
                        ) : <p className="text-muted-foreground">No updates posted yet.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="wishlist" className="mt-4">
                    <WishlistTab />
                </TabsContent>
                <TabsContent value="spending" className="mt-4">
                <Card className="bg-red-500/5 border-red-500/10">
                    <CardContent className="p-6">
                    {project.expenses.length > 0 ? (
                        <ul className="space-y-4">
                        {project.expenses.map(expense => (
                            <li key={expense.id} className="flex items-center justify-between gap-4 rounded-md border bg-card p-3">
                            <div>
                                <p className="font-medium">{expense.item}</p>
                                <p className="text-sm text-muted-foreground">{format(expense.date, 'PP')}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="font-semibold">Rs.{expense.amount.toLocaleString()}</p>
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
                    <Card className="bg-blue-500/5 border-blue-500/10">
                        <DonorsList projectName={project.name} />
                    </Card>
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
