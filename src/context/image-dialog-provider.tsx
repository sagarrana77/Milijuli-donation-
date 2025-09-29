
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ImageDialog } from '@/components/ui/image-dialog';

interface ImageDialogContextType {
  isOpen: boolean;
  imageUrl: string | null;
  imageAlt: string | null;
  openImage: (url: string, alt?: string) => void;
  closeImage: () => void;
}

const ImageDialogContext = createContext<ImageDialogContextType | undefined>(undefined);

export function ImageDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState<string | null>(null);

  const openImage = (url: string, alt: string = '') => {
    setImageUrl(url);
    setImageAlt(alt);
    setIsOpen(true);
  };

  const closeImage = () => {
    setIsOpen(false);
    // Delay clearing the image to prevent flickering during closing animation
    setTimeout(() => {
        setImageUrl(null);
        setImageAlt(null);
    }, 300);
  };

  const value = {
    isOpen,
    imageUrl,
    imageAlt,
    openImage,
    closeImage,
  };

  return (
    <ImageDialogContext.Provider value={value}>
      {children}
      <ImageDialog />
    </ImageDialogContext.Provider>
  );
}

export function useImageDialog() {
  const context = useContext(ImageDialogContext);
  if (context === undefined) {
    throw new Error('useImageDialog must be used within an ImageDialogProvider');
  }
  return context;
}
