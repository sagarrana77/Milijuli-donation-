import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InstagramIcon from '@/components/icons/instagram-icon';
import TwitterIcon from '@/components/icons/TwitterIcon';
import LinkedInIcon from '@/components/icons/LinkedInIcon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Landmark } from 'lucide-react';


export default function SettingsPage() {
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
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Update your personal details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="Current User" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="donor@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">About You</Label>
            <Textarea
              id="bio"
              rows={3}
              placeholder="Tell us a little about yourself"
              defaultValue="A passionate supporter of community-driven projects and a firm believer in the power of transparent giving."
            />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>
            Add your social media profiles to be displayed on your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin" className="flex items-center gap-2"><LinkedInIcon className="h-4 w-4" /> LinkedIn URL</Label>
            <Input id="linkedin" placeholder="https://linkedin.com/in/your-username" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter" className="flex items-center gap-2"><TwitterIcon className="h-4 w-4" /> Twitter / X URL</Label>
            <Input id="twitter" placeholder="https://twitter.com/your-username" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2"><InstagramIcon className="h-4 w-4" /> Instagram URL</Label>
            <Input id="instagram" placeholder="https://instagram.com/your-username" />
          </div>
          <Button>Save Social Links</Button>
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
                <div className="space-y-2">
                  <Label htmlFor="card-name">Name on Card</Label>
                  <Input id="card-name" placeholder="John Doe" />
                </div>
                <Button>Save Card</Button>
              </div>
            </TabsContent>
            <TabsContent value="bank-account" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input id="bank-name" placeholder="e.g., Example Bank" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-holder-name">Account Holder Name</Label>
                  <Input id="account-holder-name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input id="account-number" placeholder="Your account number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routing-number">Routing Number</Label>
                  <Input id="routing-number" placeholder="Your routing number" />
                </div>
                <Button>Save Bank Account</Button>
              </div>
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
