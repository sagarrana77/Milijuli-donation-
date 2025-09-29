

'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Wand2, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { projects, currentUser } from '@/lib/data';
import { summarizeProject } from '@/ai/flows/summarize-project';
import { generateCampaignStory } from '@/ai/flows/generate-campaign-story';
import { useState } from 'react';
import { usePricingDialog } from '@/context/pricing-dialog-provider';

const projectSchema = z.object({
  name: z.string().min(5, 'Project name must be at least 5 characters.'),
  organization: z.string().min(3, 'Organization name is required.'),
  description: z.string().min(20, 'Short description must be at least 20 characters.'),
  longDescription: z.string().min(100, 'Long description must be at least 100 characters.'),
  imageUrl: z.string().url('Please enter a valid image URL.'),
  imageHint: z.string().min(2, 'Image hint is required.'),
  targetAmount: z.coerce.number().positive('Target amount must be a positive number.'),
  verified: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { openDialog } = usePricingDialog();
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [credits, setCredits] = useState(currentUser?.aiCredits ?? 0);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      organization: '',
      description: '',
      longDescription: '',
      imageUrl: '',
      imageHint: '',
      targetAmount: 0,
      verified: false,
    },
  });

  const handleCreditUsage = () => {
      if (!currentUser) return false;

      if (currentUser.aiCredits !== undefined && currentUser.aiCredits > 0) {
          currentUser.aiCredits -= 1;
          setCredits(currentUser.aiCredits); // Update local state to re-render
          if (currentUser.aiCredits < 10 && currentUser.aiCredits > 0) {
              toast({
                  title: 'Low AI Credits',
                  description: `You have ${currentUser.aiCredits} credits remaining. Purchase more to continue using AI features.`,
                  variant: 'destructive',
              });
          }
          return true;
      }

      toast({
          variant: 'destructive',
          title: 'Out of AI Credits',
          description: 'Please purchase more credits to use this feature.',
      });
      openDialog();
      return false;
  }

  function onSubmit(data: ProjectFormData) {
    const newProject = {
      ...data,
      id: data.name.toLowerCase().replace(/\s+/g, '-'),
      raisedAmount: 0,
      donors: 0,
      updates: [],
      expenses: [],
      discussion: [],
      wishlist: [],
    };
    projects.unshift(newProject);
    toast({
      title: 'Project Created!',
      description: `The project "${data.name}" has been successfully added.`,
    });
    router.push('/admin');
  }

   const handleGenerateSummary = async () => {
    const longDescription = form.getValues('longDescription');
    const name = form.getValues('name');
    if (!longDescription || longDescription.length < 100) {
        toast({
            variant: 'destructive',
            title: 'Full Description Too Short',
            description: 'Please write a full description of at least 100 characters before generating a summary.'
        });
        return;
    }
    if (!name) {
        toast({
            variant: 'destructive',
            title: 'Project Name Required',
            description: 'Please enter a project name before generating a summary.'
        });
        return;
    }
    
    if (!handleCreditUsage()) return;

    setIsGeneratingSummary(true);
    try {
        const result = await summarizeProject({ name, longDescription });
        form.setValue('description', result.summary, { shouldValidate: true, shouldDirty: true });
        toast({
            title: "AI Summary Generated!",
            description: "The short description has been filled in."
        });
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
  };

  const handleGenerateStory = async () => {
    const campaignTitle = form.getValues('name');
    const storyDraft = form.getValues('longDescription');
    if (!campaignTitle || campaignTitle.length < 5) {
        toast({
            variant: 'destructive',
            title: 'Project Name Too Short',
            description: 'Please provide a project name of at least 5 characters before generating a story.'
        });
        return;
    }
    
    if (!handleCreditUsage()) return;

    setIsGeneratingStory(true);
    try {
        const result = await generateCampaignStory({ campaignTitle, storyDraft });
        form.setValue('longDescription', result.campaignStory, { shouldValidate: true, shouldDirty: true });
        toast({
            title: "AI Story Generated!",
            description: "The full project description has been filled in."
        });
    } catch (error) {
        console.error("Error generating story:", error);
        toast({
            variant: 'destructive',
            title: 'Error Generating Story',
            description: 'Could not generate story. Please try again.'
        });
    } finally {
        setIsGeneratingStory(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground">
          Fill out the details below to add a new fundraising project to the platform.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Basic information about your new project.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Build a School in Gorkha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Hope & Future Foundation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Project Description</FormLabel>
                    <div className="flex items-start gap-2">
                        <FormControl>
                        <Textarea
                            rows={6}
                            placeholder="Describe the project's goals, methods, and expected impact in detail."
                            {...field}
                        />
                        </FormControl>
                        <Button type="button" variant="outline" size="icon" onClick={handleGenerateStory} disabled={isGeneratingStory || credits <= 0} title="Generate with AI">
                            {isGeneratingStory ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                        </Button>
                    </div>
                    <FormDescription className="flex items-center justify-between">
                        <span>
                        This will be shown on the main project page. You can write this yourself or generate it with AI based on the project name.
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                            <Sparkles className="h-3 w-3" /> {credits} Credits
                        </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                     <div className="flex items-start gap-2">
                        <FormControl>
                        <Textarea
                            placeholder="A brief, one-sentence summary of the project."
                            {...field}
                        />
                        </FormControl>
                        <Button type="button" variant="outline" size="icon" onClick={handleGenerateSummary} disabled={isGeneratingSummary || credits <= 0} title="Generate with AI">
                            {isGeneratingSummary ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                        </Button>
                    </div>
                     <FormDescription className="flex items-center justify-between">
                        <span>
                        This will be shown on project cards. You can write this yourself or generate it with AI based on the full description above.
                        </span>
                         <span className="flex items-center gap-1 text-xs">
                            <Sparkles className="h-3 w-3" /> {credits} Credits
                        </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Media & Goals</CardTitle>
               <CardDescription>
                Visuals and financial targets for the project.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Header Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://images.unsplash.com/..." {...field} />
                    </FormControl>
                     <FormDescription>
                        Please provide a high-quality image URL (e.g., from Unsplash).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="imageHint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image AI Hint</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., children studying" {...field} />
                    </FormControl>
                     <FormDescription>
                        Provide 1-2 keywords for AI to find replacement images.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fundraising Target (NPR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Verification Status</CardTitle>
                    <CardDescription>
                        Mark this project as verified to build donor trust.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FormField
                        control={form.control}
                        name="verified"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel>Verified Transparent Project</FormLabel>
                                <FormDescription>
                                Enable this if the project meets all transparency requirements.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                        />
                </CardContent>
            </Card>

          <div className="flex gap-4">
            <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Project
            </Button>
            <Button variant="outline" asChild>
                <Link href="/admin">Cancel</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
