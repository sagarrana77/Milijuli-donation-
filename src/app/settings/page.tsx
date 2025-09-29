

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InstagramIcon from '@/components/icons/instagram-icon';
import TwitterIcon from '@/components/icons/TwitterIcon';
import LinkedInIcon from '@/components/icons/LinkedInIcon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Landmark, Save, Sparkles } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { currentUser } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { usePricingDialog } from '@/context/pricing-dialog-provider';


const profileSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Invalid email address."),
    bio: z.string().max(200, "Bio must not exceed 200 characters.").optional(),
});

const socialLinksSchema = z.object({
    linkedin: z.string().url("Invalid URL.").optional().or(z.literal('')),
    twitter: z.string().url("Invalid URL.").optional().or(z.literal('')),
    instagram: z.string().url("Invalid URL.").optional().or(z.literal('')),
});

const creditCardSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits."),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Invalid expiry date format (MM/YY)."),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits."),
  cardName: z.string().min(1, "Name on card is required."),
});

const bankAccountSchema = z.object({
    bankName: z.string().min(1, "Bank name is required."),
    accountHolderName: z.string().min(1, "Account holder name is required."),
    accountNumber: z.string().min(1, "Account number is required."),
    routingNumber: z.string().min(1, "Routing number is required."),
    saveInfo: z.boolean(),
});

export default function SettingsPage() {
    const { toast } = useToast();
    const { openDialog } = usePricingDialog();

    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: currentUser?.name,
            email: currentUser?.email,
            bio: currentUser?.bio
        }
    });

    const socialForm = useForm<z.infer<typeof socialLinksSchema>>({
        resolver: zodResolver(socialLinksSchema),
        defaultValues: { linkedin: '', twitter: '', instagram: ''}
    });
    
    const ccForm = useForm<z.infer<typeof creditCardSchema>>({
        resolver: zodResolver(creditCardSchema),
        defaultValues: { cardNumber: '', expiryDate: '', cvc: '', cardName: ''}
    });

    const bankForm = useForm<z.infer<typeof bankAccountSchema>>({
        resolver: zodResolver(bankAccountSchema),
        defaultValues: { bankName: '', accountHolderName: '', accountNumber: '', routingNumber: '', saveInfo: true}
    });

    const onProfileSubmit = (data: z.infer<typeof profileSchema>) => {
        console.log("Profile data:", data);
        toast({ title: "Profile Updated", description: "Your account information has been saved." });
    };

    const onSocialSubmit = (data: z.infer<typeof socialLinksSchema>) => {
        console.log("Social links data:", data);
        toast({ title: "Social Links Updated", description: "Your social media links have been saved." });
    };
    
    const onCreditCardSubmit = (data: z.infer<typeof creditCardSchema>) => {
        console.log("Credit card data:", data);
        toast({ title: "Payment Method Saved", description: "Your credit card has been securely saved." });
        ccForm.reset();
    };

    const onBankSubmit = (data: z.infer<typeof bankAccountSchema>) => {
        console.log("Bank account data:", data);
        toast({ title: "Payment Method Saved", description: `Your bank account has been ${data.saveInfo ? 'securely saved' : 'used for a one-time transaction'}.` });
        bankForm.reset();
    };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings.
        </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>AI Credits & Status</CardTitle>
          <CardDescription>
            Manage your AI features usage and Pro status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                    <p className="font-medium">Your Status</p>
                    {currentUser?.isProMember ? (
                        <Badge>
                            <Sparkles className="mr-2 h-4 w-4" /> Pro Member
                        </Badge>
                    ) : (
                         <Badge variant="secondary">Standard Member</Badge>
                    )}
                </div>
                 <div className="space-y-1 mt-4 sm:mt-0 text-left sm:text-right">
                    <p className="font-medium">AI Credits</p>
                    <p className="text-2xl font-bold">{currentUser?.aiCredits ?? 0}</p>
                </div>
            </div>
             <p className="text-sm text-muted-foreground">
                Pro members get exclusive benefits and bonus credits. You can become a Pro member by donating to our <Link href="/operational-costs" className="text-primary underline">Operational Costs</Link> fund. Each AI feature usage (like generating a story or summary) costs 1 credit.
            </p>
            <Button onClick={openDialog}>
                <Sparkles className="mr-2 h-4 w-4" /> Get More Credits or Go Pro
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Update your personal details.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <FormField control={profileForm.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={profileForm.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl><Input type="email" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={profileForm.control} name="bio" render={({ field }) => (
                        <FormItem>
                            <FormLabel>About You</FormLabel>
                            <FormControl><Textarea rows={3} placeholder="Tell us a little about yourself" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit">Save Changes</Button>
                </form>
            </Form>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>
            Add your social media profiles to be displayed on your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...socialForm}>
                <form onSubmit={socialForm.handleSubmit(onSocialSubmit)} className="space-y-4">
                    <FormField control={socialForm.control} name="linkedin" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2"><LinkedInIcon className="h-4 w-4" /> LinkedIn URL</FormLabel>
                            <FormControl><Input placeholder="https://linkedin.com/in/your-username" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={socialForm.control} name="twitter" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2"><TwitterIcon className="h-4 w-4" /> Twitter / X URL</FormLabel>
                            <FormControl><Input placeholder="https://twitter.com/your-username" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={socialForm.control} name="instagram" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2"><InstagramIcon className="h-4 w-4" /> Instagram URL</FormLabel>
                            <FormControl><Input placeholder="https://instagram.com/your-username" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit">Save Social Links</Button>
                </form>
            </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Add and manage your payment methods for faster donations.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                                <FormLabel>Card Number</FormLabel>
                                <FormControl><Input placeholder="0000 0000 0000 0000" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={ccForm.control} name="expiryDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={ccForm.control} name="cvc" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CVC</FormLabel>
                                    <FormControl><Input placeholder="123" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <FormField control={ccForm.control} name="cardName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name on Card</FormLabel>
                                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Card</Button>
                    </form>
                </Form>
            </TabsContent>
            <TabsContent value="bank-account" className="mt-6">
                <Form {...bankForm}>
                    <form onSubmit={bankForm.handleSubmit(onBankSubmit)} className="space-y-4">
                        <FormField control={bankForm.control} name="bankName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bank Name</FormLabel>
                                <FormControl><Input placeholder="e.g., Example Bank" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={bankForm.control} name="accountHolderName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account Holder Name</FormLabel>
                                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={bankForm.control} name="accountNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account Number</FormLabel>
                                <FormControl><Input placeholder="Your account number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={bankForm.control} name="routingNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Routing Number</FormLabel>
                                <FormControl><Input placeholder="Your routing number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField
                            control={bankForm.control}
                            name="saveInfo"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                    Save this bank account for future donations.
                                    </FormLabel>
                                    <FormDescription>
                                    If unchecked, this information will only be used for a one-time transaction.
                                    </FormDescription>
                                </div>
                                </FormItem>
                            )}
                        />
                        <Button type="submit"><Save className="mr-2 h-4 w-4" />Save Bank Account</Button>
                    </form>
                </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            For security, choose a strong, unique password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
