

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
    RadioGroup,
    RadioGroupItem
} from '@/components/ui/radio-group';
import type { WishlistItem } from '@/lib/data';
import { Truck, Package, PackageCheck } from 'lucide-react';
import { contactInfo } from '@/lib/data';
import { AnimatePresence, motion } from 'framer-motion';


const inKindSchema = z.object({
    donationType: z.enum(['drop-off', 'pickup']),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
    address: z.string().optional(),
}).refine(data => {
    if (data.donationType === 'pickup') {
        return !!data.address && data.address.length > 10;
    }
    return true;
}, {
    message: "A valid address is required for pickup.",
    path: ['address'],
});

type InKindFormData = z.infer<typeof inKindSchema>;

interface InKindDonationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: WishlistItem | null;
  onSubmit: (data: InKindFormData) => void;
}


export function InKindDonationDialog({
  isOpen,
  onOpenChange,
  item,
  onSubmit,
}: InKindDonationDialogProps) {
  const form = useForm<InKindFormData>({
    resolver: zodResolver(inKindSchema),
    defaultValues: {
      donationType: 'drop-off',
      quantity: 1,
      address: '',
    },
  });

  const donationType = form.watch('donationType');
  const pickupAddress = form.watch('address');

  const handleFormSubmit = (data: InKindFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  if (!item) return null;

  const dropoffAddress = contactInfo.address;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Donate "{item.name}" In-Kind</DialogTitle>
          <DialogDescription>
            Thank you for offering to donate this item physically. Please let us know how you'd like to get it to us.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
             <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                            <Input type="number" min="1" max={item.quantityNeeded - item.quantityDonated} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
              control={form.control}
              name="donationType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Donation Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="drop-off" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center gap-2">
                           <Package className="h-4 w-4" /> I will drop it off
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="pickup" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center gap-2">
                          <Truck className="h-4 w-4" /> Please pick it up
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <AnimatePresence>
              {donationType === 'pickup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pickup Address</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Please enter your full address..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                  />
                  {pickupAddress && pickupAddress.length > 10 && (
                     <div className="mt-4 rounded-lg overflow-hidden border">
                         <iframe
                            width="100%"
                            height="200"
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.openstreetmap.org/export/embed.html?layer=mapnik&q=${encodeURIComponent(pickupAddress)}`}
                          ></iframe>
                     </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

             <AnimatePresence>
                {donationType === 'drop-off' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden space-y-2"
                    >
                        <div>
                            <FormLabel>Drop-off Location</FormLabel>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{dropoffAddress}</p>
                        </div>
                         <div className="rounded-lg overflow-hidden border">
                             <iframe
                                width="100%"
                                height="200"
                                loading="lazy"
                                allowFullScreen
                                src={`https://www.openstreetmap.org/export/embed.html?layer=mapnik&q=${encodeURIComponent(dropoffAddress)}`}
                              ></iframe>
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>


            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Submit Pledge</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
