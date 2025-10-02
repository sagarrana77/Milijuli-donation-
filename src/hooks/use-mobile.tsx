

"use client"

import * as React from "react"

const TABLET_BREAKPOINT = 1024;
const MOBILE_BREAKPOINT = 768;

export type ViewMode = "auto" | "desktop" | "tablet" | "mobile";

export function useDeviceView(defaultViewMode: ViewMode = 'auto') {
  const [viewMode, setViewMode] = React.useState<ViewMode>(defaultViewMode);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      // Force a re-render to re-evaluate breakpoints
      setViewMode(prev => prev);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isTablet = React.useMemo(() => {
    if (!isClient) return false;
    if (viewMode === 'tablet') return true;
    if (viewMode === 'desktop' || viewMode === 'mobile') return false;
    return window.innerWidth < TABLET_BREAKPOINT && window.innerWidth >= MOBILE_BREAKPOINT;
  }, [viewMode, isClient]);

  const isMobile = React.useMemo(() => {
    if (!isClient) return true; // Default to mobile behavior on SSR
    if (viewMode === 'mobile') return true;
    if (viewMode === 'desktop') return false;
    if (viewMode === 'auto') {
      return window.innerWidth < TABLET_BREAKPOINT;
    }
    return false;
  }, [viewMode, isClient]);

  return { isMobile, isTablet, viewMode, setViewMode, isClient };
}
