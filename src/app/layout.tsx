import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Inter } from 'next/font/google';
import { NotificationProvider } from '@/context/notification-provider';
import { PhotoDialogProvider } from '@/context/image-dialog-provider';
import { PricingDialogProvider } from '@/context/pricing-dialog-provider';
import { AuthProvider } from '@/context/auth-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });


export const metadata: Metadata = {
  title: 'milijuli sewa',
  description: 'A platform for transparent and accountable fundraising.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased`}>
        <AuthProvider>
          <PhotoDialogProvider>
            <NotificationProvider>
              <PricingDialogProvider>
                <AppShell>{children}</AppShell>
              </PricingDialogProvider>
            </NotificationProvider>
          </PhotoDialogProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
