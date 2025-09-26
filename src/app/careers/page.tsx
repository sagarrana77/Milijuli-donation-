
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { jobOpenings, type JobOpening } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { MapPin, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function CareersPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);

  const handleApplyClick = (job: JobOpening) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  const handleApplicationSubmit = () => {
    // In a real app, you'd handle file upload and form data submission here.
    setIsDialogOpen(false);
    toast({
      title: 'Application Submitted!',
      description: `Thank you for applying for the ${selectedJob?.title} position. We have received your documents and will be in touch.`,
    });
    setSelectedJob(null);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <UserPlus className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Join Our Team</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Help us build a more transparent and accountable world. We're looking
          for passionate individuals to join our mission.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open Positions</CardTitle>
          <CardDescription>
            Browse our current openings for employees and volunteers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {jobOpenings.map((job) => (
              <AccordionItem key={job.id} value={job.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex w-full items-center justify-between pr-4">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge
                          variant={
                            job.type === 'Volunteer' ? 'secondary' : 'default'
                          }
                        >
                          {job.type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div>
                    <h4 className="font-semibold">About the Role</h4>
                    <p className="mt-2 text-muted-foreground">
                      {job.description}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Requirements</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <Button onClick={() => handleApplyClick(job)}>
                    Apply Now
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {jobOpenings.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              There are no open positions at this time. Please check back
              later!
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Submit your application by filling out the form below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cover-letter">Why are you fit for this job?</Label>
              <Textarea
                id="cover-letter"
                placeholder="Tell us about your experience and passion for this role..."
                rows={5}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="resume">CV / Resume</Label>
              <Input id="resume" type="file" />
               <p className="text-xs text-muted-foreground">Please upload your CV in PDF format.</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleApplicationSubmit}>
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
