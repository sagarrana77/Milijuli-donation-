
'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useLoginDialog } from '@/context/login-dialog-provider';
import { LoginForm } from '../auth/login-form';

export function LoginDialog() {
  const { isOpen, closeDialog } = useLoginDialog();

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="max-w-4xl p-0 gap-0 border-0 overflow-hidden" aria-describedby="login-dialog-description">
        <DialogTitle className="sr-only">Login or Sign Up</DialogTitle>
        <DialogDescription id="login-dialog-description" className="sr-only">A dialog to log in or create a new account.</DialogDescription>
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
}
