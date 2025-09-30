

'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, CreditCard, Wand2, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { projects, paymentGateways as defaultGateways, platformSettings } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { summarizeProject } from '@/ai/flows/summarize-project';
import { generateCampaignStory } from '@/ai/flows/generate-campaign-story';
import { usePricingDialog } from '@/context/pricing-dialog-provider';
import { useAuth } from '@/context/auth-provider';
import { AnimatedLogo } from '@/components/layout/animated-logo';

const gatewaySchema = z.object({
    name: z.string(),
    enabled: z.boolean(),
    qrValue: z.string(),
    generatedQr: z.string(),
});

const projectSchema = z.object({
  name: z.string().min(5, 'Project name must be at least 5 characters.'),
  organization: z.string().min(3, 'Organization name is required.'),
  description: z.string().min(20, 'Short description must be at least 20 characters.'),
  longDescription: z.string().min(100, 'Long description must be at least 100 characters.'),
  imageUrl: z.string().url('Please enter a valid image URL.'),
  imageHint: z.string().min(2, 'Image hint is required.'),
  targetAmount: z.coerce.number().positive('Target amount must be a positive number.'),
  gateways: z.array(gatewaySchema).optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function CreateCampaignPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { openDialog, onPurchase } = usePricingDialog();
  const { user, loading } = useAuth();

  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [credits, setCredits] = useState(user?.aiCredits ?? 0);
  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!user.canCreateCampaigns && !user.isAdmin) {
         toast({
            title: 'Permission Denied',
            description: 'You do not have permission to create a campaign.',
            variant: 'destructive',
        });
        router.push('/');
      }
    }
  }, [user, loading, router, toast]);

  useEffect(() => {
    setCredits(user?.aiCredits ?? 0);
  }, [user?.aiCredits, onPurchase]);

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
      gateways: defaultGateways.map(g => ({...g, enabled: false, qrValue: '', generatedQr: ''}))
    },
  });
  
  const { fields: gatewayFields } = useFieldArray({
    control: form.control,
    name: "gateways"
  });

  const handleCreditUsage = () => {
    if (!user) return false;

    if (user.aiCredits !== undefined && user.aiCredits > 0) {
        // This is a mock update. In a real app, this would be an API call.
        user.aiCredits -= 1;
        setCredits(user.aiCredits);
        if (user.aiCredits < 10) {
            toast({
                title: 'Low AI Credits',
                description: `You have ${user.aiCredits} credits remaining. Purchase more to continue using AI features.`,
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
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to create a campaign."
        });
        return;
    }

    const newProject = {
      ...data,
      id: data.name.toLowerCase().replace(/\s+/g, '-'),
      raisedAmount: 0,
      donors: 0,
      verified: false, // User-created projects are unverified by default
      ownerId: user.uid,
      updates: [],
      expenses: [],
      discussion: [],
      wishlist: [],
    };
    projects.unshift(newProject);
    toast({
      title: 'Campaign Created!',
      description: `Your campaign "${data.name}" has been created and is pending review.`,
    });
    router.push('/my-campaigns');
  }

  const handleGenerateQr = (index: number) => {
    const gateways = form.getValues('gateways');
    if(gateways) {
        const gateway = gateways[index];
        if (gateway && gateway.qrValue) {
            const newQr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(gateway.qrValue)}`;
            form.setValue(`gateways.${index}.generatedQr`, newQr, { shouldDirty: true });
        }
    }
  };

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
            title: 'Campaign Name Required',
            description: 'Please enter a campaign name before generating a summary.'
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
            title: 'Campaign Name Too Short',
            description: 'Please provide a campaign name of at least 5 characters before generating a story.'
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
            description: "The full campaign story has been filled in."
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

  if (loading || !user) {
    return (
        <div className="flex h-96 items-center justify-center">
            <AnimatedLogo />
        </div>
    );
  }


  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Create New Campaign</h1>
        <p className="text-muted-foreground">
          Fill out the details below to launch your fundraising campaign.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Campaign Details</TabsTrigger>
                <TabsTrigger value="gateways">Payments</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-8 mt-6">
                <Card>
                    <CardHeader>
                    <CardTitle>Campaign Details</CardTitle>
                    <CardDescription>
                        Basic information about your new campaign.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Campaign Name</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Help Rebuild the Local Library" {...field} />
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
                            <FormLabel>Your Name or Organization Name</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Friends of the Library" {...field} />
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
                            <FormLabel>Full Campaign Story</FormLabel>
                            <div className="flex items-start gap-2">
                                <FormControl>
                                <Textarea
                                    rows={6}
                                    placeholder="Tell your story. Describe the campaign's goals, why it's important, and the impact it will have."
                                    {...field}
                                />
                                </FormControl>
                                <Button type="button" variant="outline" size="icon" onClick={handleGenerateStory} disabled={isGeneratingStory || credits <= 0} title="Generate with AI">
                                    {isGeneratingStory ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                                </Button>
                            </div>
                            <FormDescription className="flex items-center justify-between">
                                <span>
                                This will be shown on the main campaign page. You can write this yourself or generate it with AI.
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
                                    placeholder="A brief, one-sentence summary of your campaign."
                                    {...field}
                                />
                                </FormControl>
                                <Button type="button" variant="outline" size="icon" onClick={handleGenerateSummary} disabled={isGeneratingSummary || credits <= 0} title="Generate with AI">
                                    {isGeneratingSummary ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                                </Button>
                            </div>
                            <FormDescription className="flex items-center justify-between">
                                <span>
                                This will be shown on campaign cards. You can write this yourself or generate it with AI based on the full description.
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
                        Set the main image and financial target for your campaign.
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
                            <Input placeholder="e.g., children reading" {...field} />
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
                            <Input type="number" placeholder="500000" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="gateways" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                        <CreditCard />
                        Payment Gateways
                        </CardTitle>
                        <CardDescription>
                        Enable gateways and generate QR codes for your campaign. These will override the platform's default gateways.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {gatewayFields.map((field, index) => (
                            <div key={field.id} className="space-y-4 rounded-md border p-4">
                                <div className="flex items-center justify-between">
                                    <FormField
                                        control={form.control}
                                        name={`gateways.${index}.name`}
                                        render={({ field }) => (
                                        <FormLabel className="text-lg font-medium">{field.value}</FormLabel>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name={`gateways.${index}.enabled`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                        control={form.control}
                                        name={`gateways.${index}.qrValue`}
                                        render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-sm font-normal">Payment URL or ID</FormLabel>
                                <div className="flex gap-2">
                                    <FormControl>
                                    <Input
                                        placeholder={`Enter ${form.getValues(`gateways.${index}.name`)} URL or ID`}
                                        {...field}
                                    />
                                    </FormControl>
                                    <Button type="button" onClick={() => handleGenerateQr(index)}>Generate QR</Button>
                                </div>
                                <FormMessage />
                                </FormItem>
                                )}
                                />
                                {form.watch(`gateways.${index}.generatedQr`) && (
                                    <div className="flex flex-col items-center gap-2 rounded-lg bg-muted p-3 sm:flex-row">
                                        <Image
                                            src={form.watch(`gateways.${index}.generatedQr`)}
                                            alt={`${form.watch(`gateways.${index}.name`)} QR Code`}
                                            width={150}
                                            height={150}
                                            data-ai-hint="qr code"
                                        />
                                        <p className="text-center text-xs text-muted-foreground break-all sm:text-left">
                                            QR Code for: {form.watch(`gateways.${index}.qrValue`)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
          <div className="flex gap-4">
            <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" /> Launch Campaign
            </Button>
            <Button variant="outline" asChild>
                <Link href="/my-campaigns">Cancel</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
