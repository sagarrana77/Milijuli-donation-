
'use client';

import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { InfoIcon } from '@/components/icons/InfoIcon';
import { MailIcon } from '@/components/icons/MailIcon';
import { PhoneIcon } from '@/components/icons/PhoneIcon';
import { getFaqs, contactInfo } from '@/lib/data';
import type { FAQ } from '@/lib/data';

export default function HelpPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);

    useEffect(() => {
        async function loadFaqs() {
            const data = await getFaqs();
            setFaqs(data);
        }
        loadFaqs();
    }, []);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <InfoIcon className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">Help & Support</h1>
        <p className="mt-2 text-base md:text-lg text-muted-foreground">
          Find answers to your questions and get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Can't find the answer you're looking for? Our team is here to help.
              </p>
              <Button asChild className="w-full">
                <Link href={`mailto:${contactInfo.email}`} className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4" /> Email Us
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`tel:${contactInfo.phone}`} className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" /> Call Us
                </Link>
              </Button>
              <div className="pt-4 text-sm">
                <h4 className="font-semibold">Our Office</h4>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {contactInfo.address}
                </p>
                 <p className="text-muted-foreground mt-2">
                  Mon-Fri, 9am - 5pm NPT
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
