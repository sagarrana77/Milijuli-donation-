
'use client';

import { useState } from 'react';
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
import { CreditCard, DollarSign, Landmark } from 'lucide-react';
import { users } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DonationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  onDonate: (amount: number) => void;
}

const presetAmounts = [10, 25, 50, 100, 250, 500];

// In a real app, this would come from an auth hook or context
const currentUser = users.find(u => u.id === 'current-user');

export function DonationDialog({
  isOpen,
  onOpenChange,
  projectName,
  onDonate,
}: DonationDialogProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [hasPaymentMethod, setHasPaymentMethod] = useState(currentUser?.hasPaymentMethod || false);

  const handleDonateClick = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    onDonate(numericAmount);
    onOpenChange(false); // Close dialog on successful donation
    setAmount(''); // Reset amount
    setError('');
  };

  const handleSavePaymentMethod = () => {
    // In a real app, this would save the payment method to the backend
    setHasPaymentMethod(true);
  }

  const handlePresetClick = (preset: number) => {
    setAmount(preset.toString());
    setError('');
  };

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
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="0000 0000 0000 0000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry-date">Expiry Date</Label>
                    <Input id="expiry-date" placeholder="MM / YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="bank-account" className="mt-6">
              <div className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="account-holder-name">Account Holder Name</Label>
                  <Input id="account-holder-name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input id="account-number" placeholder="Your account number" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
           <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                    Cancel
                    </Button>
                </DialogClose>
                <Button type="button" onClick={handleSavePaymentMethod}>
                    Save and Continue
                </Button>
            </DialogFooter>
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
                    {presetAmounts.map(preset => (
                        <Button key={preset} variant="outline" onClick={() => handlePresetClick(preset)}>
                            ${preset}
                        </Button>
                    ))}
                </div>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                    id="amount"
                    type="number"
                    placeholder="Or enter custom amount"
                    value={amount}
                    onChange={(e) => {
                        setAmount(e.target.value);
                        if (error) setError('');
                    }}
                    className="pl-10 text-lg"
                    />
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
