

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
import { CreditCard, Landmark, UserX, Check, Banknote, QrCode } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Checkbox } from '../ui/checkbox';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PaymentGateways } from './payment-gateways';
import { useDonationContext } from './donation-dialog-wrapper';

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
  routingNumber: z.string().min(1, "Routing number is required."),
});


export function DonationDialog({
  isOpen,
  onOpenChange,
  projectName,
  onDonate,
}: DonationDialogProps) {
  const [step, setStep] = useState<'amount' | 'payment'>('amount');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [relocationConsent, setRelocationConsent] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [currency, setCurrency] = useState<'NPR' | 'USD' | 'EUR'>('NPR');
  
  const context = useDonationContext();

  const ccForm = useForm<z.infer<typeof creditCardSchema>>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: { cardNumber: '', expiryDate: '', cvc: ''}
  });

  const bankForm = useForm<z.infer<typeof bankAccountSchema>>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: { accountHolderName: '', accountNumber: '', routingNumber: ''}
  });

  const handleProceedToPayment = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
     if (!relocationConsent) {
      setError('Please consent to the fund relocation policy to proceed.');
      return;
    }
    setError('');
    setStep('payment');
  }

  const completeDonation = () => {
    const numericAmount = parseFloat(amount);
    const nprAmount = numericAmount * exchangeRates[currency];
    onDonate(nprAmount, isAnonymous);
    onOpenChange(false); // Close dialog
    // Reset state for next time
    setTimeout(() => {
        setStep('amount');
        setAmount('');
        setError('');
        setRelocationConsent(false);
        setIsAnonymous(false);
        setCurrency('NPR');
    }, 300);
  }

  const handlePresetClick = (preset: number) => {
    setAmount(preset.toString());
    if (error) setError('');
  };
  
  const estimatedNprAmount = currency !== 'NPR' ? parseFloat(amount) * exchangeRates[currency] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === 'amount' && (
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
                    <Button type="button" onClick={handleProceedToPayment}>
                        Proceed to Payment
                    </Button>
                </DialogFooter>
            </>
        )}
        {step === 'payment' && (
            <>
                <DialogHeader>
                    <DialogTitle>Complete Your Donation</DialogTitle>
                    <DialogDescription>
                        You are donating <span className="font-bold text-primary">Rs.{(parseFloat(amount) * exchangeRates[currency]).toLocaleString()}</span> to "{projectName}". Please select a payment method.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="qr">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="qr"><QrCode className="mr-2 h-4 w-4" /> QR</TabsTrigger>
                        <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4" /> Card</TabsTrigger>
                        <TabsTrigger value="bank"><Banknote className="mr-2 h-4 w-4" /> Bank</TabsTrigger>
                    </TabsList>
                    <TabsContent value="qr" className="mt-4">
                        <PaymentGateways project={context?.project!} />
                         <DialogFooter className="mt-4">
                             <Button type="button" variant="secondary" onClick={() => setStep('amount')}>Back</Button>
                             <Button onClick={completeDonation}><Check className="mr-2 h-4 w-4" /> I Have Paid</Button>
                         </DialogFooter>
                    </TabsContent>
                    <TabsContent value="card" className="mt-4">
                        <Form {...ccForm}>
                            <form onSubmit={ccForm.handleSubmit(completeDonation)} className="space-y-4">
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
                                    <Button type="button" variant="secondary" onClick={() => setStep('amount')}>Back</Button>
                                    <Button type="submit">Pay Rs.{(parseFloat(amount) * exchangeRates[currency]).toLocaleString()}</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </TabsContent>
                     <TabsContent value="bank" className="mt-4">
                        <Form {...bankForm}>
                            <form onSubmit={bankForm.handleSubmit(completeDonation)} className="space-y-4">
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
                                <FormField control={bankForm.control} name="routingNumber" render={({ field }) => (
                                    <FormItem>
                                        <Label>Routing Number</Label>
                                        <FormControl><Input placeholder="Your routing number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <DialogFooter>
                                    <Button type="button" variant="secondary" onClick={() => setStep('amount')}>Back</Button>
                                    <Button type="submit">Pay Rs.{(parseFloat(amount) * exchangeRates[currency]).toLocaleString()}</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                     </TabsContent>
                </Tabs>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
}
