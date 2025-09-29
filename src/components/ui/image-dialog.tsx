
'use client';

import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useImageDialog } from '@/context/image-dialog-provider';

export function ImageDialog() {
  const { isOpen, imageUrl, imageAlt, closeImage } = useImageDialog();

  if (!imageUrl) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeImage}>
      <DialogContent className="max-w-4xl h-[80vh] p-2 bg-transparent border-none shadow-none">
        <Image
          src={imageUrl}
          alt={imageAlt || 'Full screen image'}
          fill
          className="object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}
