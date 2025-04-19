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
      if (typeof window !== 'undefined') {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'windows phone', 'blackberry', 'nokia', 'mobile'];
        const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));
        const isSmallScreen = window.innerWidth < 1024;
        
        setIsMobile(isMobileDevice || isSmallScreen);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

export default useIsMobile;