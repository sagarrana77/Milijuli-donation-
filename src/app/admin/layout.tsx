
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/data';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!currentUser?.isAdmin) {
    redirect('/');
  }

  return <>{children}</>;
}
