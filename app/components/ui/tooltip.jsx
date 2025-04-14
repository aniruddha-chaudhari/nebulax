"use client";

import * as React from "react";
import { useState, useCallback, useRef, useEffect } from "react";

const TooltipContext = React.createContext({});

export function TooltipProvider({ children }) {
  return <TooltipContext.Provider value={{}}>{children}</TooltipContext.Provider>;
}

export function Tooltip({ children }) {
  return <div className="relative inline-block">{children}</div>;
}

export function TooltipTrigger({ children, asChild }) {
  return <div className="inline-block">{children}</div>;
}

export function TooltipContent({ children }) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  const positionTooltip = useCallback(() => {
    if (tooltipRef.current && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      setPosition({
        top: triggerRect.top - tooltipRect.height - 10,
        left: triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2),
      });
    }
  }, []);

  useEffect(() => {
    const parentEl = tooltipRef.current?.parentElement;
    if (!parentEl) return;

    const triggerEl = parentEl.querySelector('[data-tooltip-trigger]');
    if (triggerEl) {
      triggerRef.current = triggerEl;

      const handleMouseEnter = () => {
        setVisible(true);
        positionTooltip();
      };

      const handleMouseLeave = () => {
        setVisible(false);
      };

      triggerEl.addEventListener('mouseenter', handleMouseEnter);
      triggerEl.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        triggerEl.removeEventListener('mouseenter', handleMouseEnter);
        triggerEl.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [positionTooltip]);

  if (!visible) return null;

  return (
    <div
      ref={tooltipRef}
      className="absolute z-50 px-3 py-2 text-sm text-white bg-black/90 border border-white/10 rounded-sm shadow-md"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {children}
      <div className="absolute w-2 h-2 rotate-45 bg-black/90 border-r border-b border-white/10" 
           style={{ bottom: '-6px', left: 'calc(50% - 4px)' }}></div>
    </div>
  );
}