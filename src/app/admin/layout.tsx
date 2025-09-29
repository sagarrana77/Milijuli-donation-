
'use client';

import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>; // Or a proper skeleton loader
  }

  if (!user?.isAdmin) {
    router.replace('/');
    return null;
  }

  return <div className="mx-auto max-w-7xl w-full">{children}</div>;
}
