
'use client';

import React, from 'react';
import type { ReactNode } from 'react';
import { ImageDialog } from '@/components/ui/image-dialog';
import type { Donor, Project, Comment, Update } from '@/lib/data';

export interface PhotoData {
  imageUrl: string;
  imageAlt?: string;
  title: string;
  donor?: Donor;
  project?: Pick<Project, 'id' | 'name'>;
  comments?: Comment[];
  update?: Update;
}

interface PhotoDialogContextType {
  isOpen: boolean;
  photoData: PhotoData | null;
  openPhoto: (data: PhotoData) => void;
  closeImage: () => void;
}

const PhotoDialogContext = React.createContext<PhotoDialogContextType | undefined>(undefined);

export function PhotoDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [photoData, setPhotoData] = React.useState<PhotoData | null>(null);

  const openPhoto = (data: PhotoData) => {
    setPhotoData(data);
    setIsOpen(true);
  };

  const closeImage = () => {
    setIsOpen(false);
    // Delay clearing the image to prevent flickering during closing animation
    setTimeout(() => {
        setPhotoData(null);
    }, 300);
  };

  const value = {
    isOpen,
    photoData,
    openPhoto,
    closeImage,
  };

  return (
    <PhotoDialogContext.Provider value={value}>
      {children}
      <ImageDialog />
    </PhotoDialogContext.Provider>
  );
}

export function usePhotoDialog() {
  const context = React.useContext(PhotoDialogContext);
  if (context === undefined) {
    throw new Error('usePhotoDialog must be used within a PhotoDialogProvider');
  }
  return context;
}
