import type { Metadata } from 'next';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Inter } from 'next/font/google';
import { NotificationProvider } from '@/context/notification-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });


export const metadata: Metadata = {
  title: 'ClarityChain',
  description: 'A platform for transparent and accountable fundraising.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased`}>
        <NotificationProvider>
          <AppShell>{children}</AppShell>
        </NotificationProvider>
        <Toaster />
      </body>
    </html>
  );
}
