
"use client"

import * as React from "react"

const TABLET_BREAKPOINT = 1024;
const MOBILE_BREAKPOINT = 768;

export type ViewMode = "auto" | "desktop" | "tablet" | "mobile";

export function useDeviceView(defaultViewMode: ViewMode = 'auto') {
  const [viewMode, setViewMode] = React.useState<ViewMode>(defaultViewMode);
  const [isClient, setIsClient] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(0);

  React.useEffect(() => {
    setIsClient(true);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    }
    
    handleResize(); // Set initial width
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isTablet = React.useMemo(() => {
    if (!isClient) return false;
    if (viewMode === 'tablet') return true;
    if (viewMode === 'desktop' || viewMode === 'mobile') return false;
    // Use windowWidth from state for consistent rendering
    return windowWidth < TABLET_BREAKPOINT && windowWidth >= MOBILE_BREAKPOINT;
  }, [viewMode, isClient, windowWidth]);

  const isMobile = React.useMemo(() => {
    if (!isClient) return true; // Default to mobile behavior on SSR
    if (viewMode === 'mobile') return true;
    if (viewMode === 'desktop') return false;
    if (viewMode === 'auto') {
      // Check for touch capability as well for more reliable mobile detection
      const hasTouchEvent = 'ontouchstart' in window;
      return windowWidth < TABLET_BREAKPOINT && hasTouchEvent;
    }
    return false;
  }, [viewMode, isClient, windowWidth]);

  return { isMobile, isTablet, viewMode, setViewMode, isClient };
}
