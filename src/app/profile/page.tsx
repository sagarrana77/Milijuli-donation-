import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
  { href: '#', icon: Linkedin, label: 'LinkedIn' },
  { href: '#', icon: Twitter, label: 'Twitter' },
  { href: '#', icon: Instagram, label: 'Instagram' },
];

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <Avatar className="mx-auto mb-4 h-24 w-24 border-4 border-primary/20">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&h=500&fit=crop" alt="Current User" />
            <AvatarFallback>CU</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl">Current User</CardTitle>
          <p className="text-muted-foreground">donor@example.com</p>
          <div className="flex justify-center gap-2 pt-4">
            {socialLinks.map((link) => (
                <Button key={link.label} variant="ghost" size="icon" asChild>
                    <Link href={link.href} target="_blank" rel="noopener noreferrer">
                        <link.icon className="h-5 w-5" />
                        <span className="sr-only">{link.label}</span>
                    </Link>
                </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            This is a placeholder profile page. In a real application, users would be able to view their donation history, manage their personal information, and update their notification settings here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
