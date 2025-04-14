'use client';

import React from 'react';

const ScanLines = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden opacity-10">
      {Array.from({ length: 100 }).map((_, i) => (
        <div 
          key={i} 
          className="w-full h-px bg-white/50" 
          style={{ marginTop: `${i * 4}px` }}
        ></div>
      ))}
    </div>
  );
};

export default ScanLines;