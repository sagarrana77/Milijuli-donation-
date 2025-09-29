

'use client';

import { useRouter, useParams, notFound } from 'next/navigation';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Save, CreditCard, Wand2, Loader2, Copy, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { projects, type Project, currentUser, paymentGateways as defaultGateways } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image';
import { generateSeoSuggestions } from '@/ai/flows/generate-seo-suggestions';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const wishlistItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Item name is required."),
  description: z.string().min(1, "Description is required."),
  quantityNeeded: z.coerce.number().positive(),
  quantityDonated: z.coerce.number().nonnegative(),
  costPerItem: z.coerce.number().positive(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  imageHint: z.string().optional(),
  allowInKind: z.boolean().optional(),
});

const updateSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  date: z.date(),
  imageUrl: z.string().url("Image URL is required."),
  imageHint: z.string().min(1, "Image hint is required."),
});

const gatewaySchema = z.object({
    name: z.string(),
    enabled: z.boolean(),
    qrValue: z.string(),
    generatedQr: z.string(),
})

const projectSchema = z.object({
  name: z.string().min(5, 'Project name must be at least 5 characters.'),
  organization: z.string().min(3, 'Organization name is required.'),
  description: z.string().min(20, 'Short description must be at least 20 characters.'),
  longDescription: z.string().min(100, 'Long description must be at least 100 characters.'),
  imageUrl: z.string().url('Please enter a valid image URL.'),
  imageHint: z.string().min(2, 'Image hint is required.'),
  targetAmount: z.coerce.number().positive('Target amount must be a positive number.'),
  verified: z.boolean(),
  wishlist: z.array(wishlistItemSchema),
  updates: z.array(updateSchema),
  gateways: z.array(gatewaySchema).optional(),
  metaDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function EditUserCampaignPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [credits, setCredits] = useState(currentUser?.aiCredits ?? 0);

  const project = projects.find(p => p.id === projectId);
  
  // Authorization check
  if (!project || (project.ownerId !== currentUser?.id && !currentUser?.isAdmin)) {
    notFound();
  }

  const handleCreditUsage = () => {
    if (!currentUser) return false;

    if (currentUser.aiCredits !== undefined && currentUser.aiCredits > 0) {
        currentUser.aiCredits -= 1;
        setCredits(currentUser.aiCredits);
        if (currentUser.aiCredits < 10) {
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
        description: 'Redirecting you to the pricing page to get more.',
    });
    router.push('/pricing');
    return false;
  }

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project ? {
      ...project,
      verified: project.verified, // Ensure verified is part of the form
      wishlist: project.wishlist.map(item => ({...item, allowInKind: item.allowInKind || false})),
      updates: project.updates.map(update => ({...update, date: new Date(update.date)})),
      gateways: project.gateways && project.gateways.length > 0 ? project.gateways : defaultGateways.map(g => ({...g, enabled: false, qrValue: '', generatedQr: ''})),
      metaDescription: project.metaDescription || '',
      keywords: project.keywords || [],
    } : undefined,
  });

  const { fields: wishlistFields, append: appendWishlistItem, remove: removeWishlistItem } = useFieldArray({
    control: form.control,
    name: "wishlist",
  });

  const { fields: updateFields, append: appendUpdate, remove: removeUpdate } = useFieldArray({
    control: form.control,
    name: "updates",
  });
  
  const { fields: gatewayFields } = useFieldArray({
    control: form.control,
    name: "gateways"
  });


  function onSubmit(data: ProjectFormData) {
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex !== -1) {
        projects[projectIndex] = { ...projects[projectIndex], ...data };
    }
    
    toast({
      title: 'Campaign Updated!',
      description: `Your campaign "${data.name}" has been successfully updated.`,
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

  const handleGenerateSeo = async () => {
    const name = form.getValues('name');
    const longDescription = form.getValues('longDescription');

    if (!name || name.length < 5) {
        toast({
            variant: 'destructive',
            title: 'Campaign Name Too Short',
            description: 'Please provide a campaign name of at least 5 characters.'
        });
        return;
    }

    if (!longDescription || longDescription.length < 100) {
        toast({
            variant: 'destructive',
            title: 'Full Description Too Short',
            description: 'Please provide a full description of at least 100 characters.'
        });
        return;
    }
    
    if (!handleCreditUsage()) return;
    
    setIsGeneratingSeo(true);
    try {
        const result = await generateSeoSuggestions({ name, longDescription });
        form.setValue('metaDescription', result.metaDescription, { shouldDirty: true });
        form.setValue('keywords', result.keywords, { shouldDirty: true });
        toast({
            title: "SEO Suggestions Generated!",
            description: "The AI has generated a meta description and keywords for your project."
        })
    } catch (error) {
        console.error("Error generating SEO suggestions:", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not generate SEO suggestions. Please try again.'
        })
    } finally {
        setIsGeneratingSeo(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to Clipboard!" });
  };

  return (
    <div className="mx-auto max-w-4xl">
        <div className="mb-8">
            <h1 className="text-3xl font-bold">Edit Campaign</h1>
            <p className="text-muted-foreground">
            Update the details for "{project.name}".
            </p>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="details">Campaign Details</TabsTrigger>
                    <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                    <TabsTrigger value="updates">Updates</TabsTrigger>
                    <TabsTrigger value="gateways">Payments</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-8 mt-6">
                    <Card>
                        <CardHeader>
                        <CardTitle>Campaign Details</CardTitle>
                        <CardDescription>
                            Basic information about your campaign.
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
                                <Input {...field} />
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
                                <Input {...field} />
                                </FormControl>
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
                                <FormControl>
                                <Textarea {...field} />
                                </FormControl>
                                <FormDescription>
                                    This will be shown on campaign cards.
                                </FormDescription>
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
                                <FormControl>
                                <Textarea
                                    rows={6}
                                    {...field}
                                />
                                </FormControl>
                                <FormDescription>
                                    This will be shown on the main campaign page.
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
                            Visuals and financial targets for the campaign.
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
                                <Input {...field} />
                                </FormControl>
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
                                <Input {...field} />
                                </FormControl>
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
                                <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>SEO Suggestions</CardTitle>
                            <CardDescription>Generate AI-powered keywords and meta descriptions to improve search visibility.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center gap-4">
                                <Button type="button" onClick={handleGenerateSeo} disabled={isGeneratingSeo || credits <= 0}>
                                    {isGeneratingSeo ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                                    Generate SEO Suggestions
                                </Button>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Sparkles className="h-4 w-4" />
                                    <span>{credits} Credits Remaining</span>
                                </div>
                            </div>
                            <FormField
                                control={form.control}
                                name="metaDescription"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meta Description</FormLabel>
                                    <FormControl>
                                    <div className="relative">
                                        <Textarea {...field} rows={3} />
                                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => copyToClipboard(field.value || '')} disabled={!field.value}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="keywords"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Keywords</FormLabel>
                                    <FormControl>
                                        <div className="rounded-md border p-4 space-y-2">
                                             <div className="relative">
                                                <Input
                                                    value={field.value?.join(', ')}
                                                    onChange={(e) => form.setValue('keywords', e.target.value.split(',').map(k => k.trim()))}
                                                    placeholder="Keywords will appear here..."
                                                />
                                                <Button type="button" variant="ghost" size="icon" className="absolute top-1/2 right-2 h-7 w-7 -translate-y-1/2" onClick={() => copyToClipboard(field.value?.join(', ') || '')} disabled={!field.value || field.value.length === 0}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {field.value?.map((keyword) => (
                                                    <Badge key={keyword} variant="secondary">{keyword}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {currentUser?.isAdmin && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Admin Settings</CardTitle>
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
                                            Enable this to approve and publish the campaign on the homepage.
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
                    )}
                </TabsContent>

                <TabsContent value="wishlist" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Campaign Wishlist</CardTitle>
                            <CardDescription>Manage specific items donors can fund for this campaign.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {wishlistFields.map((item, index) => (
                                <div key={item.id} className="space-y-4 rounded-md border p-4 relative">
                                    <FormField
                                        control={form.control}
                                        name={`wishlist.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Item Name</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name={`wishlist.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Item Description</FormLabel>
                                                <FormControl><Textarea rows={2} {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`wishlist.${index}.costPerItem`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Cost per Item (NPR)</FormLabel>
                                                    <FormControl><Input type="number" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                         <FormField
                                            control={form.control}
                                            name={`wishlist.${index}.quantityNeeded`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Quantity Needed</FormLabel>
                                                    <FormControl><Input type="number" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`wishlist.${index}.quantityDonated`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Quantity Donated</FormLabel>
                                                    <FormControl><Input type="number" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       <FormField
                                            control={form.control}
                                            name={`wishlist.${index}.imageUrl`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Image URL</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                         <FormField
                                            control={form.control}
                                            name={`wishlist.${index}.imageHint`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Image Hint</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                     <FormField
                                        control={form.control}
                                        name={`wishlist.${index}.allowInKind`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Allow In-Kind Donations</FormLabel>
                                                <FormDescription>
                                                Permit users to donate this item physically.
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
                                    <Button size="sm" variant="destructive" onClick={() => removeWishlistItem(index)} className="absolute top-2 right-2">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => appendWishlistItem({ id: `wish-${Date.now()}`, name: '', description: '', costPerItem: 0, quantityNeeded: 1, quantityDonated: 0, imageUrl: '', allowInKind: false })}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Wishlist Item
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="updates" className="mt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Campaign Updates</CardTitle>
                            <CardDescription>Post updates for your campaign donors.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {updateFields.map((item, index) => (
                                <div key={item.id} className="space-y-4 rounded-md border p-4 relative">
                                    <FormField
                                        control={form.control}
                                        name={`updates.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Update Title</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name={`updates.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Update Description</FormLabel>
                                                <FormControl><Textarea rows={3} {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name={`updates.${index}.imageUrl`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Image URL</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`updates.${index}.imageHint`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Image Hint</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button size="sm" variant="destructive" onClick={() => removeUpdate(index)} className="absolute top-2 right-2">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => appendUpdate({ id: `update-${Date.now()}`, title: '', description: '', date: new Date(), imageUrl: '', imageHint: '' })}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" /> Add New Update
                            </Button>
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
                    <Save className="mr-2 h-4 w-4" /> Save Changes
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
