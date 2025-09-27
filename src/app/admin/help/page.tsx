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

const initialFaqs = [
  {
    id: 'faq-1',
    question: 'How do I know my donation is secure?',
    answer:
      'We use industry-standard encryption and partner with trusted payment gateways to ensure every transaction is secure. Additionally, all verified projects use our blockchain ledger to track funds, providing an immutable record of where your money goes.',
  },
  {
    id: 'faq-2',
    question: 'What does a "Verified Transparent" project mean?',
    answer:
      'A "Verified Transparent" badge means the project has committed to our highest standards of transparency. All their expenses are logged on our public ledger with corresponding receipts, and they provide regular, detailed updates on their progress.',
  },
  {
    id: 'faq-3',
    question: 'Can I get a refund for my donation?',
    answer:
      'Donations are generally non-refundable. However, in exceptional circumstances, such as a project failing to start, we will work to reallocate the funds to a similar project or offer credits. Please contact support for any specific issues.',
  },
];

type FAQ = {
  id: string;
  question: string;
  answer: string;
};

export default function AdminHelpPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [contactInfo, setContactInfo] = useState({
    email: 'support@claritychain.com',
    phone: '+1234567890',
    address: '123 Transparency Lane\nKathmandu, Nepal',
  });
  const { toast } = useToast();

  const handleAddFaq = () => {
    const newFaq: FAQ = {
        id: `faq-${Date.now()}`,
        question: 'New Question',
        answer: 'New answer. Please edit me.'
    }
    setFaqs([...faqs, newFaq]);
  }

  const handleDeleteFaq = (id: string) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  }

  const handleSaveFaqs = () => {
      toast({ title: "FAQs Saved!", description: "Your changes have been saved. (Demo only)"});
  }
  
  const handleSaveContact = () => {
      toast({ title: "Contact Info Saved!", description: "Your changes have been saved. (Demo only)"});
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
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[index].question = e.target.value;
                        setFaqs(newFaqs);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`faq-a-${index}`}>Answer</Label>
                    <Textarea
                      id={`faq-a-${index}`}
                      value={faq.answer}
                      rows={4}
                       onChange={(e) => {
                        const newFaqs = [...faqs];
                        newFaqs[index].answer = e.target.value;
                        setFaqs(newFaqs);
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
              value={contactInfo.email}
              onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Support Phone</Label>
            <Input
              id="contact-phone"
              type="tel"
              value={contactInfo.phone}
              onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-address">Office Address</Label>
            <Textarea
              id="contact-address"
              value={contactInfo.address}
              onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
            />
          </div>
          <Button onClick={handleSaveContact}>Save Contact Information</Button>
        </CardContent>
      </Card>
    </div>
  );
}
