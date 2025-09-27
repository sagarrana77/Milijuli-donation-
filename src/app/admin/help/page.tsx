
'use client';

import { useState } from 'react';
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
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { faqs, contactInfo } from '@/lib/data';
import type { FAQ } from '@/lib/data';

export default function AdminHelpPage() {
  const [_, setForceRender] = useState(0);
  const { toast } = useToast();

  const handleAddFaq = () => {
    const newFaq: FAQ = {
        id: `faq-${Date.now()}`,
        question: 'New Question',
        answer: 'New answer. Please edit me.'
    }
    faqs.push(newFaq);
    setForceRender(c => c + 1);
  }

  const handleDeleteFaq = (id: string) => {
    const index = faqs.findIndex(faq => faq.id === id);
    if (index !== -1) {
        faqs.splice(index, 1);
        setForceRender(c => c + 1);
    }
  }

  const handleSaveFaqs = () => {
      toast({ title: "FAQs Saved!", description: "Your changes have been saved."});
      setForceRender(c => c + 1);
  }
  
  const handleSaveContact = () => {
      toast({ title: "Contact Info Saved!", description: "Your changes have been saved."});
      setForceRender(c => c + 1);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Manage Help Page</h1>
        <p className="text-muted-foreground">
          Update the FAQs and contact information on your support page.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Add, edit, or remove FAQs to help your users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`faq-q-${index}`}>Question</Label>
                    <Input
                      id={`faq-q-${index}`}
                      defaultValue={faq.question}
                      onChange={(e) => {
                        faq.question = e.target.value;
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`faq-a-${index}`}>Answer</Label>
                    <Textarea
                      id={`faq-a-${index}`}
                      defaultValue={faq.answer}
                      rows={4}
                       onChange={(e) => {
                        faq.answer = e.target.value;
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteFaq(faq.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="flex justify-between pt-6">
            <Button onClick={handleAddFaq}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New FAQ
            </Button>
             <Button onClick={handleSaveFaqs} variant="default">Save All Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Update the contact details displayed on the help page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-email">Support Email</Label>
            <Input
              id="contact-email"
              type="email"
              defaultValue={contactInfo.email}
              onChange={(e) => contactInfo.email = e.target.value}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Support Phone</Label>
            <Input
              id="contact-phone"
              type="tel"
              defaultValue={contactInfo.phone}
              onChange={(e) => contactInfo.phone = e.target.value}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-address">Office Address</Label>
            <Textarea
              id="contact-address"
              defaultValue={contactInfo.address}
              onChange={(e) => contactInfo.address = e.target.value}
            />
          </div>
          <Button onClick={handleSaveContact}>Save Contact Information</Button>
        </CardContent>
      </Card>
    </div>
  );
}
