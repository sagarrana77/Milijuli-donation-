
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { currentUser } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const proFeatures = [
    "Exclusive 'Pro Member' badge on your profile",
    "100 bonus AI credits upon joining",
    "Priority access to new features",
    "Enhanced support from our team",
    "The good feeling of supporting platform operations!"
];

const creditPacks = [
    { credits: 100, price: 5, pricePerCredit: 0.05 },
    { credits: 250, price: 10, pricePerCredit: 0.04, bestValue: true },
    { credits: 1000, price: 35, pricePerCredit: 0.035 },
];


export default function PricingPage() {
    const { toast } = useToast();
    const router = useRouter();

    const handlePurchaseCredits = (credits: number, price: number) => {
        if (currentUser) {
            currentUser.aiCredits = (currentUser.aiCredits || 0) + credits;
            toast({
                title: 'Purchase Successful!',
                description: `You've added ${credits} AI credits to your account for $${price}.`,
            });
            router.push('/settings');
        } else {
             toast({
                title: 'Please Log In',
                description: 'You need to be logged in to purchase credits.',
                variant: 'destructive',
            });
        }
    }
    
    const handleBecomePro = () => {
        router.push('/operational-costs');
    }

  return (
    <div className="mx-auto max-w-5xl space-y-12">
        <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Pricing & Membership</h1>
            <p className="mt-4 text-lg text-muted-foreground">
                Unlock powerful AI features and support our platform's transparency mission.
            </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="flex flex-col border-primary border-2 shadow-primary/20">
                <CardHeader className="text-center">
                    <Star className="mx-auto h-10 w-10 text-primary mb-4" />
                    <CardTitle className="text-3xl">Pro Membership</CardTitle>
                    <CardDescription>
                        Become a core supporter of ClarityChain and get exclusive benefits.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <ul className="space-y-3">
                        {proFeatures.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <p className="text-center text-muted-foreground">
                        Become a Pro Member by making a donation of any amount to our <span className="font-bold">Operational Costs</span> fund.
                    </p>
                    <Button size="lg" className="w-full text-lg" onClick={handleBecomePro}>
                        Become a Pro Member
                    </Button>
                </CardFooter>
            </Card>

            <Card className="flex flex-col">
                <CardHeader className="text-center">
                    <Sparkles className="mx-auto h-10 w-10 text-primary mb-4" />
                    <CardTitle className="text-3xl">AI Credits</CardTitle>
                    <CardDescription>
                        Purchase credits to use our generative AI features for creating campaign content.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-6">
                    {creditPacks.map((pack) => (
                        <Card key={pack.credits} className={pack.bestValue ? "border-primary" : ""}>
                            <CardContent className="p-4 flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-bold text-xl">{pack.credits.toLocaleString()} Credits</p>
                                    <p className="text-sm text-muted-foreground">${pack.pricePerCredit.toFixed(3)} / credit</p>
                                </div>
                                <div className="text-right">
                                    <Button onClick={() => handlePurchaseCredits(pack.credits, pack.price)}>
                                        Buy for ${pack.price}
                                    </Button>
                                    {pack.bestValue && <p className="text-xs font-bold text-primary mt-1">Best Value</p>}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
                 <CardFooter>
                    <p className="text-xs text-muted-foreground">
                        AI credits can be used to generate campaign stories, summaries, SEO suggestions, and social media posts.
                    </p>
                 </CardFooter>
            </Card>
        </div>
    </div>
  );
}
