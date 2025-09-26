
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

const faqs = [
  {
    question: 'How do I know my donation is secure?',
    answer:
      'We use industry-standard encryption and partner with trusted payment gateways to ensure every transaction is secure. Additionally, all verified projects use our blockchain ledger to track funds, providing an immutable record of where your money goes.',
  },
  {
    question: 'What does a "Verified Transparent" project mean?',
    answer:
      'A "Verified Transparent" badge means the project has committed to our highest standards of transparency. All their expenses are logged on our public ledger with corresponding receipts, and they provide regular, detailed updates on their progress.',
  },
  {
    question: 'Can I get a refund for my donation?',
    answer:
      'Donations are generally non-refundable. However, in exceptional circumstances, such as a project failing to start, we will work to reallocate the funds to a similar project or offer credits. Please contact support for any specific issues.',
  },
  {
    question: 'How are operational costs managed?',
    answer:
      'Operational costs, such as salaries and equipment, are funded through a dedicated "Operational Costs" fund. This ensures that donations to specific projects are used directly for those projects, maintaining transparency and trust.',
  },
  {
    question: 'How do I create a project on ClarityChain?',
    answer:
      'Currently, project creation is handled internally by our team to ensure all projects meet our standards. If you have a project you\'d like to feature, please reach out to our partnerships team through our contact page.',
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <InfoIcon className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Help & Support</h1>
        <p className="mt-2 text-lg text-muted-foreground">
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
                  <AccordionItem key={index} value={`item-${index}`}>
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
                <Link href="mailto:support@claritychain.com" className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4" /> Email Us
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="tel:+1234567890" className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" /> Call Us
                </Link>
              </Button>
              <div className="pt-4 text-sm">
                <h4 className="font-semibold">Our Office</h4>
                <p className="text-muted-foreground">
                  123 Transparency Lane <br />
                  Kathmandu, Nepal
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
