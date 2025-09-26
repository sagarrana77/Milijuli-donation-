
'use client';

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
import { jobOpenings } from '@/lib/data';
import { MoreHorizontal, PlusCircle, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminCareersPage() {
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
          <CardTitle>Add New Opening</CardTitle>
          <CardDescription>
            Fill out the form to post a new job or volunteer position.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input id="job-title" placeholder="e.g., Community Manager" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="job-type">Position Type</Label>
                    <Select>
                        <SelectTrigger id="job-type">
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="volunteer">Volunteer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="job-location">Location</Label>
                <Input id="job-location" placeholder="e.g., Kathmandu, Nepal or Remote" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="job-description">Job Description</Label>
                <Textarea
                id="job-description"
                rows={4}
                placeholder="Describe the role and responsibilities..."
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="job-requirements">Requirements</Label>
                <Textarea
                id="job-requirements"
                rows={4}
                placeholder="List the qualifications, one per line."
                />
            </div>
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Opening</Button>
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
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
