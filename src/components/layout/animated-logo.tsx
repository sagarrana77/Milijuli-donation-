'use client';

import { motion } from 'framer-motion';
import { Logo } from '@/components/icons/logo';
import { platformSettings } from '@/lib/data';
import Image from 'next/image';

export function AnimatedLogo() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {platformSettings.appLogoUrl ? (
          <Image
            src={platformSettings.appLogoUrl}
            alt={`${platformSettings.appName} Logo`}
            width={64}
            height={64}
            className="h-16 w-16"
          />
        ) : (
          <Logo className="h-16 w-16 text-primary" />
        )}
      </motion.div>
      <p className="text-lg font-semibold text-muted-foreground animate-pulse">
        Loading {platformSettings.appName}...
      </p>
    </div>
  );
}
