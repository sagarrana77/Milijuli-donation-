
'use client';

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
import { jobOpenings } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { MapPin, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';


export default function CareersPage() {
  const { toast } = useToast();

  const handleApply = (jobTitle: string) => {
    toast({
        title: "Application Received!",
        description: `Thank you for your interest in the ${jobTitle} position. We will review your application and be in touch.`
    });
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <UserPlus className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Join Our Team</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Help us build a more transparent and accountable world. We're looking for passionate individuals to join our mission.
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
                        <Badge variant={job.type === 'Volunteer' ? 'secondary' : 'default'}>{job.type}</Badge>
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
                    <p className="mt-2 text-muted-foreground">{job.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Requirements</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <Button onClick={() => handleApply(job.title)}>Apply Now</Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
           {jobOpenings.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                There are no open positions at this time. Please check back later!
              </p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
