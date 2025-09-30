
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Star, X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './dialog';
import { usePricingDialog } from '@/context/pricing-dialog-provider';
import { useAuth } from '@/context/auth-provider';
import { ScrollArea } from './scroll-area';

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


export function PricingDialog() {
    const { toast } = useToast();
    const router = useRouter();
    const { isOpen, closeDialog, onPurchase } = usePricingDialog();
    const { user } = useAuth();

    const handlePurchaseCredits = (credits: number, price: number) => {
        if (user) {
            // In a real app, this would be an API call to update the user's credits in the database.
            // For now, we'll optimistically update the local user object.
            user.aiCredits = (user.aiCredits || 0) + credits;
            toast({
                title: 'Purchase Successful!',
                description: `You've added ${credits} AI credits to your account for $${price}.`,
            });
            onPurchase(credits);
            closeDialog();
        } else {
             toast({
                title: 'Please Log In',
                description: 'You need to be logged in to purchase credits.',
                variant: 'destructive',
            });
        }
    }
    
    const handleBecomePro = () => {
        closeDialog();
        router.push('/operational-costs');
    }

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-4xl p-0 max-h-[90vh] flex flex-col">
            <DialogHeader className="p-6 pb-4 text-center sticky top-0 bg-background z-10 border-b">
                 <DialogTitle className="text-2xl md:text-3xl font-bold tracking-tight">
                    Pricing & Membership
                </DialogTitle>
                <DialogDescription className="text-base max-w-2xl mx-auto">
                    Supercharge your fundraising with Pro status and AI credits.
                </DialogDescription>
            </DialogHeader>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogClose>
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 gap-8 p-4 md:grid-cols-2 md:p-6">
                    <Card className="flex flex-col border-primary border-2 shadow-primary/20">
                        <CardHeader className="text-center">
                            <Star className="mx-auto h-10 w-10 text-primary mb-4" />
                            <CardTitle className="text-3xl">Pro Membership</CardTitle>
                            <CardDescription>
                                Become a core supporter of milijuli donation sewa and get exclusive benefits.
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
                        <div className="p-6 flex flex-col gap-4">
                            <p className="text-center text-muted-foreground">
                                Become a Pro Member by making a donation of any amount to our <span className="font-bold">Operational Costs</span> fund.
                            </p>
                            <Button size="lg" className="w-full text-lg" onClick={handleBecomePro}>
                                Become a Pro Member
                            </Button>
                        </div>
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
                                    <CardContent className="p-4 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
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
                        <div className="p-6">
                            <p className="text-xs text-muted-foreground">
                                AI credits can be used to generate campaign stories, summaries, SEO suggestions, and social media posts.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  );
}
