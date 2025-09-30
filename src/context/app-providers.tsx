
'use client';

import { AuthProvider } from '@/context/auth-provider';
import { PhotoDialogProvider } from '@/context/image-dialog-provider';
import { NotificationProvider } from '@/context/notification-provider';
import { PricingDialogProvider } from '@/context/pricing-dialog-provider';
import { LoginDialogProvider } from '@/context/login-dialog-provider';
import { ChatProvider } from '@/context/chat-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <PhotoDialogProvider>
                <NotificationProvider>
                    <PricingDialogProvider>
                        <LoginDialogProvider>
                            <ChatProvider>
                                {children}
                            </ChatProvider>
                        </LoginDialogProvider>
                    </PricingDialogProvider>
                </NotificationProvider>
            </PhotoDialogProvider>
        </AuthProvider>
    )
}