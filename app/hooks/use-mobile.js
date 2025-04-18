'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is mobile
 * @returns {boolean} True if the device is mobile, false otherwise
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check if window is defined (is client-side)
      if (typeof window !== 'undefined') {
        // Use user agent to detect mobile devices
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'windows phone', 'blackberry', 'nokia', 'mobile'];
        const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));
        
        // Check screen width as an additional heuristic (include tablets/iPads)
        const isSmallScreen = window.innerWidth < 1024;
        
        setIsMobile(isMobileDevice || isSmallScreen);
      }
    };

    // Initial check
    checkMobile();
    
    // Re-check on resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

export default useIsMobile;