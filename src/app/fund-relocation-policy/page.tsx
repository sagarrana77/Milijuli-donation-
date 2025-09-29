
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Repeat, CheckCircle, AlertCircle, Info, ListChecks, Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollFadeIn } from "@/components/ui/scroll-fade-in";


export default function FundRelocationPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <ScrollFadeIn>
        <div className="text-center">
            <Handshake className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-4xl font-bold tracking-tight">Fund Relocation Policy</h1>
            <p className="mt-2 text-lg text-muted-foreground">
            Ensuring every dollar makes an impact.
            </p>
        </div>
      </ScrollFadeIn>

      <ScrollFadeIn asChild>
        <Card>
            <CardHeader className="flex-row items-start gap-4">
                <Info className="h-8 w-8 text-primary mt-1" />
                <div>
                    <CardTitle className="text-2xl text-primary">Our Commitment to Impact</CardTitle>
                    <CardDescription className="mt-2 text-base">
                        At ClarityChain, our primary goal is to ensure that every donation contributes to positive change. Sometimes, circumstances change, and to maximize the impact of your generosity, we may need to reallocate funds. This policy explains how and why we do this, always with transparency at the forefront.
                    </CardDescription>
                </div>
            </CardHeader>
        </Card>
      </ScrollFadeIn>
      
      <div className="grid md:grid-cols-2 gap-8">
        <ScrollFadeIn asChild>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <Repeat className="h-6 w-6" />
                        When Are Funds Relocated?
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-base font-semibold">1. Campaign is Over-Funded</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                If a campaign raises more money than its target goal, the surplus funds may be relocated. We do this to prevent funds from sitting idle when other active campaigns are in urgent need of support.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                             <AccordionTrigger className="text-base font-semibold">2. Campaign is Cancelled</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                In the rare event a campaign is cancelled by its creator or fails to meet critical milestones, we will relocate the raised funds to ensure donor contributions are not wasted.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                             <AccordionTrigger className="text-base font-semibold">3. Urgent Needs Arise</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                During major crises (like a natural disaster), we may ask for your consent to relocate funds from less urgent campaigns to a dedicated disaster relief fund to provide immediate help.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </ScrollFadeIn>
        <ScrollFadeIn asChild>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                        <ListChecks className="h-6 w-6" />
                        How Does the Process Work?
                    </CardTitle>
                </CardHeader>
                <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-base font-semibold">1. Administrative Review</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                Our administrative team carefully reviews the situation to confirm that a fund relocation is the most effective way to use the donations.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                             <AccordionTrigger className="text-base font-semibold">2. Finding a New Home</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                We prioritize moving funds to a campaign in a similar category (e.g., from one education project to another) or to our general Operational Costs fund to support the platform.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                             <AccordionTrigger className="text-base font-semibold">3. Transparent Public Updates</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                When a fund transfer occurs, a public update is automatically posted to the "Updates" tab of both the source and destination campaigns. This record includes the amount, the reason for the transfer, and is permanently visible to all donors.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </ScrollFadeIn>
      </div>

       <ScrollFadeIn asChild>
            <Card className="bg-amber-50 border-amber-200">
                <CardHeader className="flex-row items-start gap-4">
                    <AlertCircle className="h-8 w-8 text-amber-600 mt-1" />
                    <div>
                        <CardTitle className="text-2xl text-amber-700">Your Consent Matters</CardTitle>
                        <CardDescription className="mt-2 text-base text-amber-800/80">
                            By agreeing to our fund relocation policy during the donation process, you give us the flexibility to make sure your contribution has the greatest possible impact. We take this responsibility seriously and are committed to upholding the highest standards of transparency at every step. If you have any questions, please don't hesitate to contact our support team.
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>
       </ScrollFadeIn>
    </div>
  );
}
