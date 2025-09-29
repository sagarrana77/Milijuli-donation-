

'use client';

import { useForm, Controller } from 'react-hook-form';
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
} from '@/components/ui/form';
import { projects, operationalCostsFund } from '@/lib/data';

const expenseSchema = z.object({
  project: z.string().min(1, 'Please select a project or category.'),
  item: z.string().min(1, 'Item name is required.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface RecordExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseRecorded: (data: ExpenseFormData) => void;
}

export function RecordExpenseDialog({
  isOpen,
  onOpenChange,
  onExpenseRecorded,
}: RecordExpenseDialogProps) {
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      project: '',
      item: '',
      amount: 0,
    },
  });

  const allCategories = [operationalCostsFund, ...projects];

  const onSubmit = (data: ExpenseFormData) => {
    onExpenseRecorded(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record New Expense</DialogTitle>
          <DialogDescription>
            Log a new expense against a project or operational costs.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project / Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project or category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allCategories.map(category => (
                        <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="item"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item / Service</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Textbooks, Transportation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (NPR)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50000.00" {...field} />
                  </FormControl>
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
              <Button type="submit">Record Expense</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
