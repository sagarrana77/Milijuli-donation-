
'use client';

import { useRouter, useParams } from 'next/navigation';
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
import { PlusCircle, Trash2, Save } from 'lucide-react';
import Link from 'next/link';
import { projects, type Project } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const wishlistItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Item name is required."),
  description: z.string().min(1, "Description is required."),
  quantityNeeded: z.coerce.number().positive(),
  quantityDonated: z.coerce.number().nonnegative(),
  costPerItem: z.coerce.number().positive(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  imageHint: z.string().optional(),
});

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
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function EditProjectPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const project = projects.find(p => p.id === projectId);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: project || {
      name: '',
      organization: '',
      description: '',
      longDescription: '',
      imageUrl: '',
      imageHint: '',
      targetAmount: 0,
      verified: false,
      wishlist: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "wishlist",
  });

  if (!project) {
    return <div>Project not found</div>;
  }

  function onSubmit(data: ProjectFormData) {
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex !== -1) {
        projects[projectIndex] = { ...projects[projectIndex], ...data };
    }
    
    toast({
      title: 'Project Updated!',
      description: `The project "${data.name}" has been successfully updated.`,
    });
    router.push('/admin');
  }

  return (
    <div className="mx-auto max-w-4xl">
        <div className="mb-8">
            <h1 className="text-3xl font-bold">Edit Project</h1>
            <p className="text-muted-foreground">
            Update the details for "{project.name}".
            </p>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Project Details</TabsTrigger>
                    <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-8 mt-6">
                    <Card>
                        <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                        <CardDescription>
                            Basic information about your project.
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
                                <FormLabel>Organization Name</FormLabel>
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
                                    This will be shown on project cards.
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
                                <FormLabel>Full Project Description</FormLabel>
                                <FormControl>
                                <Textarea
                                    rows={6}
                                    {...field}
                                />
                                </FormControl>
                                <FormDescription>
                                    This will be shown on the main project page.
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
                                <FormLabel>Fundraising Target ($)</FormLabel>
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
                            <CardTitle>Verification Status</CardTitle>
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
                </TabsContent>

                <TabsContent value="wishlist" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Wishlist</CardTitle>
                            <CardDescription>Manage specific items donors can fund for this project.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {fields.map((item, index) => (
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
                                                    <FormLabel>Cost per Item ($)</FormLabel>
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
                                    <Button size="sm" variant="destructive" onClick={() => remove(index)} className="absolute top-2 right-2">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => append({ id: `wish-${Date.now()}`, name: '', description: '', costPerItem: 0, quantityNeeded: 1, quantityDonated: 0, imageUrl: '' })}
                            >
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Wishlist Item
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex gap-4">
                <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
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
