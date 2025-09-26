'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { jobOpenings as initialJobOpenings, type JobOpening } from '@/lib/data';
import { MoreHorizontal, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from '@/components/ui/form';

const jobOpeningSchema = z.object({
    title: z.string().min(1, "Title is required."),
    type: z.enum(['Full-time', 'Part-time', 'Volunteer']),
    location: z.string().min(1, "Location is required."),
    description: z.string().min(1, "Description is required."),
    requirements: z.string().min(1, "Requirements are required."),
});

type JobOpeningFormData = z.infer<typeof jobOpeningSchema>;


export default function AdminCareersPage() {
    const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(initialJobOpenings);
    const [editingJob, setEditingJob] = useState<JobOpening | null>(null);

    const form = useForm<JobOpeningFormData>({
        resolver: zodResolver(jobOpeningSchema),
        defaultValues: {
            title: '',
            type: 'Full-time',
            location: '',
            description: '',
            requirements: '',
        }
    });

    const onSubmit = (data: JobOpeningFormData) => {
        const newJob: JobOpening = {
            id: editingJob ? editingJob.id : `job-${Date.now()}`,
            ...data,
            requirements: data.requirements.split('\n').filter(req => req.trim() !== ''),
        };

        if (editingJob) {
            setJobOpenings(jobOpenings.map(job => job.id === editingJob.id ? newJob : job));
            setEditingJob(null);
        } else {
            setJobOpenings([newJob, ...jobOpenings]);
        }
        form.reset();
    };

    const handleEdit = (job: JobOpening) => {
        setEditingJob(job);
        form.reset({
            ...job,
            requirements: job.requirements.join('\n'),
        });
    };

    const handleDelete = (id: string) => {
        setJobOpenings(jobOpenings.filter(job => job.id !== id));
    };

    const handleCancelEdit = () => {
        setEditingJob(null);
        form.reset();
    }


  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Manage Careers</h1>
        <p className="text-muted-foreground">
          Create and manage job openings for employees and volunteers.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingJob ? 'Edit Opening' : 'Add New Opening'}</CardTitle>
          <CardDescription>
            Fill out the form to post a new job or volunteer position.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="job-title">Job Title</Label>
                                    <FormControl>
                                        <Input id="job-title" placeholder="e.g., Community Manager" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="job-type">Position Type</Label>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger id="job-type">
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Full-time">Full-time</SelectItem>
                                            <SelectItem value="Part-time">Part-time</SelectItem>
                                            <SelectItem value="Volunteer">Volunteer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="job-location">Location</Label>
                                <FormControl>
                                    <Input id="job-location" placeholder="e.g., Kathmandu, Nepal or Remote" {...field} />
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
                                <Label htmlFor="job-description">Job Description</Label>
                                <FormControl>
                                    <Textarea
                                    id="job-description"
                                    rows={4}
                                    placeholder="Describe the role and responsibilities..."
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="requirements"
                        render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="job-requirements">Requirements</Label>
                                <FormControl>
                                    <Textarea
                                    id="job-requirements"
                                    rows={4}
                                    placeholder="List the qualifications, one per line."
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-2">
                        <Button type="submit">
                            {editingJob ? (
                                <>Save Changes</>
                            ) : (
                                <><PlusCircle className="mr-2 h-4 w-4" /> Add Opening</>
                            )}
                        </Button>
                        {editingJob && (
                            <Button variant="outline" onClick={handleCancelEdit}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Openings</CardTitle>
          <CardDescription>
            A list of all active job and volunteer positions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobOpenings.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>
                    <Badge variant={job.type === 'Volunteer' ? 'secondary' : 'default'}>
                        {job.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(job)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(job.id)} className="text-destructive">
                           <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
