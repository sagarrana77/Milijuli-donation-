
'use client';

import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AnimatedLogo } from '@/components/layout/animated-logo';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user?.isAdmin) {
      router.replace('/');
    }
  }, [loading, user, router]);

  if (loading || !user?.isAdmin) {
    return (
        <div className="flex h-96 items-center justify-center">
            <AnimatedLogo />
        </div>
    );
  }

  return <div className="mx-auto max-w-7xl w-full">{children}</div>;
}
