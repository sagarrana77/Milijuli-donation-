
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
import { DollarSign } from 'lucide-react';

interface DonationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  onDonate: (amount: number) => void;
}

const presetAmounts = [10, 25, 50, 100, 250, 500];

export function DonationDialog({
  isOpen,
  onOpenChange,
  projectName,
  onDonate,
}: DonationDialogProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

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

  const handlePresetClick = (preset: number) => {
    setAmount(preset.toString());
    setError('');
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
      </DialogContent>
    </Dialog>
  );
}
