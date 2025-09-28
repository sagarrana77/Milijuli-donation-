

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
                        <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm text-primary">
                            <TransparencySealIcon className="h-5 w-5" />
                            <span className="font-semibold">Verified Transparent</span>
                        </div>
                    )}
                </div>
                <p className="text-lg text-muted-foreground">{project.organization}</p>
            </header>
          </ScrollFadeIn>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <ScrollFadeIn>
                <Card className="overflow-hidden">
                    <Image
                    src={project.imageUrl}
                    alt={project.name}
                    width={1200}
                    height={675}
                    className="aspect-video w-full object-cover"
                    data-ai-hint={project.imageHint}
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
                                <Image src={update.imageUrl} alt={update.title} width={200} height={150} className="aspect-video w-full rounded-md object-cover sm:w-48" data-ai-hint={update.imageHint} />
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
      </DonationDialogWrapper>
    </div>
  );
}
