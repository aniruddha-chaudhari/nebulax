'use client';

import React from 'react';

const CRTEffect = ({ children, className = '' }) => {
  return (
    <div className={`crt-container ${className}`}>
      {children}
      <div className="crt-overlay"></div>
    </div>
  );
};

export default CRTEffect;