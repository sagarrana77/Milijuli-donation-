

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Landmark, Save, UserX } from 'lucide-react';
import { currentUser } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '../ui/checkbox';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface DonationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  onDonate: (amount: number, isAnonymous: boolean) => void;
}

const presetAmounts: { [key: string]: number[] } = {
    NPR: [1000, 2500, 5000, 10000, 25000, 50000],
    USD: [10, 20, 50, 100, 200, 500],
    EUR: [10, 20, 50, 100, 200, 500],
};

const exchangeRates = {
    NPR: 1,
    USD: 133,
    EUR: 142,
};

const creditCardSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits."),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Invalid expiry date format (MM/YY)."),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits."),
});

const bankAccountSchema = z.object({
  accountHolderName: z.string().min(1, "Account holder name is required."),
  accountNumber: z.string().min(1, "Account number is required."),
});


export function DonationDialog({
  isOpen,
  onOpenChange,
  projectName,
  onDonate,
}: DonationDialogProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [hasPaymentMethod, setHasPaymentMethod] = useState(currentUser?.hasPaymentMethod || false);
  const [relocationConsent, setRelocationConsent] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [currency, setCurrency] = useState<'NPR' | 'USD' | 'EUR'>('NPR');
  const { toast } = useToast();

  const ccForm = useForm<z.infer<typeof creditCardSchema>>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: { cardNumber: '', expiryDate: '', cvc: ''}
  });

  const bankForm = useForm<z.infer<typeof bankAccountSchema>>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: { accountHolderName: '', accountNumber: ''}
  });

  const handleDonateClick = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
     if (!relocationConsent) {
      setError('Please consent to the fund relocation policy to proceed.');
      return;
    }
    
    const nprAmount = numericAmount * exchangeRates[currency];

    console.log(`Donation of Rs.${nprAmount} for "${projectName}" with relocation consent: ${relocationConsent}`);
    onDonate(nprAmount, isAnonymous);
    onOpenChange(false); // Close dialog on successful donation
    setAmount(''); // Reset amount
    setError('');
    setRelocationConsent(false);
    setIsAnonymous(false);
    setCurrency('NPR');
  };

  const handleSavePaymentMethod = () => {
    // In a real app, this would save the payment method to the backend
    if (currentUser) {
        currentUser.hasPaymentMethod = true;
    }
    toast({ title: "Payment Method Saved", description: "Your payment method has been securely saved." });
    setHasPaymentMethod(true);
  }

  const onCreditCardSubmit = (data: z.infer<typeof creditCardSchema>) => {
    console.log("Credit Card data (dialog):", data);
    handleSavePaymentMethod();
    ccForm.reset();
  }

  const onBankSubmit = (data: z.infer<typeof bankAccountSchema>) => {
    console.log("Bank Account data (dialog):", data);
    handleSavePaymentMethod();
    bankForm.reset();
  }

  const handlePresetClick = (preset: number) => {
    setAmount(preset.toString());
    if (error) setError('');
  };
  
  const estimatedNprAmount = currency !== 'NPR' ? parseFloat(amount) * exchangeRates[currency] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!hasPaymentMethod ? (
           <>
             <DialogHeader>
                <DialogTitle>Add a Payment Method</DialogTitle>
                <DialogDescription>
                    To continue, please add a payment method. This will be saved for future donations.
                </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="credit-card">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="credit-card">
                  <CreditCard className="mr-2 h-4 w-4" /> Credit Card
                </TabsTrigger>
                <TabsTrigger value="bank-account">
                  <Landmark className="mr-2 h-4 w-4" /> Bank Account
                </TabsTrigger>
              </TabsList>
              <TabsContent value="credit-card" className="mt-6">
                <Form {...ccForm}>
                  <form onSubmit={ccForm.handleSubmit(onCreditCardSubmit)} className="space-y-4">
                    <FormField control={ccForm.control} name="cardNumber" render={({ field }) => (
                      <FormItem>
                        <Label>Card Number</Label>
                        <FormControl><Input placeholder="0000 0000 0000 0000" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={ccForm.control} name="expiryDate" render={({ field }) => (
                        <FormItem>
                          <Label>Expiry Date</Label>
                          <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={ccForm.control} name="cvc" render={({ field }) => (
                        <FormItem>
                          <Label>CVC</Label>
                          <FormControl><Input placeholder="123" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit"><Save className="mr-2 h-4 w-4" />Save and Continue</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="bank-account" className="mt-6">
                <Form {...bankForm}>
                    <form onSubmit={bankForm.handleSubmit(onBankSubmit)} className="space-y-4">
                        <FormField control={bankForm.control} name="accountHolderName" render={({ field }) => (
                            <FormItem>
                                <Label>Account Holder Name</Label>
                                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={bankForm.control} name="accountNumber" render={({ field }) => (
                            <FormItem>
                                <Label>Account Number</Label>
                                <FormControl><Input placeholder="Your account number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit"><Save className="mr-2 h-4 w-4" />Save and Continue</Button>
                        </DialogFooter>
                    </form>
                </Form>
              </TabsContent>
            </Tabs>
           </>
        ) : (
            <>
                <DialogHeader>
                <DialogTitle>Fund "{projectName}"</DialogTitle>
                <DialogDescription>
                    Your contribution makes a difference. Please enter the amount you'd like to donate.
                </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-3 gap-2">
                        {presetAmounts[currency].map(preset => (
                            <Button key={preset} variant="outline" onClick={() => handlePresetClick(preset)}>
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(preset).replace('NPR', 'Rs.')}
                            </Button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">
                               {currency === 'NPR' ? 'Rs.' : currency === 'USD' ? '$' : '€'}
                            </span>
                            <Input
                            id="amount"
                            type="number"
                            placeholder="Or enter custom amount"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                if (error) setError('');
                            }}
                            className="pl-8 text-lg"
                            />
                        </div>
                        <Select value={currency} onValueChange={(value) => setCurrency(value as 'NPR' | 'USD' | 'EUR')}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NPR">NPR</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     {estimatedNprAmount && !isNaN(estimatedNprAmount) && (
                        <p className="text-sm text-muted-foreground text-center">
                            Estimated contribution: <span className="font-bold text-primary">Rs.{estimatedNprAmount.toLocaleString()}</span>
                        </p>
                    )}
                    <div className="items-top flex space-x-2">
                        <Checkbox id="terms1" checked={relocationConsent} onCheckedChange={(checked) => {
                            setRelocationConsent(checked as boolean);
                            if (error) setError('');
                        }} />
                        <div className="grid gap-1.5 leading-none">
                            <label
                            htmlFor="terms1"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                            I agree that my donation may be relocated if needed.
                            </label>
                            <p className="text-sm text-muted-foreground">
                            If this project is over-funded or cancelled, your donation may be moved to another project. <Link href="/fund-relocation-policy" target="_blank" className="text-primary hover:underline">Learn More</Link>.
                            </p>
                        </div>
                    </div>
                    <div className="items-top flex space-x-2">
                        <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={(checked) => {
                            setIsAnonymous(checked as boolean);
                        }} />
                        <div className="grid gap-1.5 leading-none">
                            <label
                            htmlFor="anonymous"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                            >
                            <UserX className="h-4 w-4" /> Donate Anonymously
                            </label>
                            <p className="text-sm text-muted-foreground">
                                Your name and profile will not be publicly displayed for this donation.
                            </p>
                        </div>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                    Cancel
                    </Button>
                </DialogClose>
                <Button type="button" onClick={handleDonateClick}>
                    Confirm Donation
                </Button>
                </DialogFooter>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}
