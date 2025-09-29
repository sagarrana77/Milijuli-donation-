

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { paymentGateways as defaultPaymentGateways, platformSettings } from '@/lib/data';
import type { Gateway, Project } from '@/lib/data';
import { AnimatePresence, motion } from 'framer-motion';

const PlaceholderLogo = ({ name }: { name: string }) => (
  <div
    className="flex h-10 w-20 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground"
    title={name}
  >
    {name}
  </div>
);

interface PaymentGatewaysProps {
    project: Project;
}

export function PaymentGateways({ project }: PaymentGatewaysProps) {
  const [selectedGateway, setSelectedGateway] = useState<Gateway | null>(null);

  // Determine if this is a platform-managed project or a user-created one.
  const isUserCampaign = project.ownerId && project.ownerId !== 'clarity-chain-admin';
  
  // Decide whether to show the user's custom gateways.
  // This is only true if it's a user campaign, the admin has enabled the feature globally,
  // the campaign has gateways configured, and at least one of them is enabled.
  const showUserGateways = 
    isUserCampaign &&
    platformSettings.userQrPaymentsEnabled &&
    project.gateways &&
    project.gateways.length > 0 &&
    project.gateways.some(g => g.enabled);

  // Select the appropriate set of gateways to use.
  const availableGateways = showUserGateways ? project.gateways! : defaultPaymentGateways;
  const enabledGateways = availableGateways.filter((g) => g.enabled);

  if (enabledGateways.length === 0) {
    return null; // Don't render the component if no gateways are enabled.
  }

  const handleGatewayClick = (gateway: Gateway) => {
    if (selectedGateway?.name === gateway.name) {
      setSelectedGateway(null); // Deselect if clicked again
    } else {
      setSelectedGateway(gateway);
    }
  };

  return (
    <div className="w-full">
      <p className="mb-2 text-center text-sm text-muted-foreground">
        We accept
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {enabledGateways.map((gateway) => (
          <Button
            key={gateway.name}
            variant={
              selectedGateway?.name === gateway.name ? 'default' : 'outline'
            }
            onClick={() => handleGatewayClick(gateway)}
            className="flex h-10 w-20 items-center justify-center rounded-md text-xs"
          >
            {gateway.name}
          </Button>
        ))}
      </div>
      <AnimatePresence>
        {selectedGateway && selectedGateway.generatedQr && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 overflow-hidden"
          >
            <Image
              src={selectedGateway.generatedQr}
              alt={`${selectedGateway.name} QR Code`}
              width={200}
              height={200}
              data-ai-hint="qr code"
              className="rounded-lg"
            />
             <p className="text-center text-xs text-muted-foreground break-all sm:text-left">
                Scan for {selectedGateway.name}: {selectedGateway.qrValue}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

    