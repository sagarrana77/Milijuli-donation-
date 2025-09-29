
'use client';

import { useEffect, useState } from 'react';
import { SidebarMenuBadge } from '@/components/ui/sidebar';
import { getPendingCampaignsCount } from '@/services/projects-service';
import { getPendingDonationsCount } from '@/services/donations-service';

export function AdminNotificationBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [campaignsCount, donationsCount] = await Promise.all([
          getPendingCampaignsCount(),
          getPendingDonationsCount(),
        ]);
        setCount(campaignsCount + donationsCount);
      } catch (error) {
        console.error('Failed to fetch admin notification counts:', error);
      }
    }

    fetchCounts();
  }, []);

  if (count === 0) {
    return null;
  }

  return <SidebarMenuBadge>{count}</SidebarMenuBadge>;
}
