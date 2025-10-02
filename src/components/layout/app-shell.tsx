
'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { Header } from '@/components/layout/header';
import { FloatingContactButton } from '@/components/layout/floating-contact-button';
import { AppProviders } from '@/context/app-providers';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <MainSidebar />
          <SidebarInset className="flex min-w-0 flex-1 flex-col">
            <Header />
            <main className="flex-1 p-4 sm:p-6 md:p-8">
              <div className="mx-auto w-full">{children}</div>
            </main>
          </SidebarInset>
          <FloatingContactButton />
        </div>
      </SidebarProvider>
    </AppProviders>
  );
}
