
'use client';

import { motion } from 'framer-motion';
import { Logo } from '@/components/icons/logo';
import { platformSettings } from '@/lib/data';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export function AnimatedLogo() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="h-16 w-16 text-primary" />
      </motion.div>
      <div className="text-center text-lg font-semibold text-muted-foreground">
        Loading...
      </div>
    </div>
  );
}
