

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
  }, []);

  const isTablet = React.useMemo(() => {
    if (!isClient) return false;
    if (viewMode === 'tablet') return true;
    if (viewMode === 'desktop' || viewMode === 'mobile') return false;
    return window.innerWidth < TABLET_BREAKPOINT && window.innerWidth >= MOBILE_BREAKPOINT;
  }, [viewMode, isClient]);

  const isMobile = React.useMemo(() => {
    if (!isClient) return false;
    if (viewMode === 'mobile') return true;
    if (viewMode === 'desktop') return false;
    // In auto mode, include tablet widths in the mobile-like behavior (drawer menu)
    if (viewMode === 'auto') {
      return window.innerWidth < TABLET_BREAKPOINT;
    }
    // If viewMode is 'tablet', it should not be considered mobile here.
    return false;
  }, [viewMode, isClient]);

  return { isMobile, isTablet, viewMode, setViewMode, isClient };
}
