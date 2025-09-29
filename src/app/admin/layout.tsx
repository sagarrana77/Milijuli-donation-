
'use client';

import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
    return <div>Loading...</div>; // Or a proper skeleton loader
  }

  return <div className="mx-auto max-w-7xl w-full">{children}</div>;
}
