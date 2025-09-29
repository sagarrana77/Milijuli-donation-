
'use client';

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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { projects, operationalCostsFund } from '@/lib/data';
import { ScrollArea } from '../ui/scroll-area';

const transferSchema = z.object({
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  from: z.string().min(1, 'Please select a source.'),
  to: z.string().min(1, 'Please select a destination.'),
  reason: z.string().min(10, 'Please provide a brief justification for the transfer.'),
}).refine(data => data.from !== data.to, {
    message: "Source and destination cannot be the same.",
    path: ["to"],
});

type TransferFormData = z.infer<typeof transferSchema>;

interface TransferFundsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFundsTransferred: (data: TransferFormData) => void;
}

export function TransferFundsDialog({
  isOpen,
  onOpenChange,
  onFundsTransferred,
}: TransferFundsDialogProps) {
  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      amount: 0,
      from: '',
      to: '',
      reason: '',
    },
  });

  const allCategories = [operationalCostsFund, ...projects];

  const onSubmit = (data: TransferFormData) => {
    onFundsTransferred(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Transfer Funds</DialogTitle>
          <DialogDescription>
            Move funds between different projects or operational costs. This action will be posted as an update on both project pages.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow">
            <div className="px-6">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Amount (NPR)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 100000.00" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>From</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a source" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {allCategories.map(category => (
                                <SelectItem key={`from-${category.id}`} value={category.name}>{category.name}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>To</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a destination" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {allCategories.map(category => (
                                <SelectItem key={`to-${category.id}`} value={category.name}>{category.name}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Reason for Transfer</FormLabel>
                        <FormControl>
                            <Textarea placeholder="e.g., Reallocating surplus funds from a completed project..." {...field} />
                        </FormControl>
                        <FormDescription>
                            Please ensure you have donor consent for this transfer if required by your policies.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                            Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">Confirm Transfer</Button>
                    </DialogFooter>
                </form>
                </Form>
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
