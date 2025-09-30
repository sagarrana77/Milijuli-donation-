
'use client';

import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { useLoginDialog } from '@/context/login-dialog-provider';
import { LoginForm } from '../auth/login-form';

export function LoginDialog() {
  const { isOpen, closeDialog } = useLoginDialog();

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="max-w-4xl p-0 gap-0 border-0 overflow-hidden">
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
}
