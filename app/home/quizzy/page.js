'use client';

import React from 'react';
// import dynamic from 'next/dynamic'; // Removed dynamic import

// Use standard imports instead of dynamic ones for testing
import ArcadeFrame from './components/ArcadeFrame';
import QuizGame from './components/QuizGame';
// const ArcadeFrame = dynamic(() => import('./components/ArcadeFrame'), { ssr: false }); // Original dynamic import
// const QuizGame = dynamic(() => import('./components/QuizGame'), { ssr: false }); // Original dynamic import

export default function Page() {
  return (
    <ArcadeFrame>
      <QuizGame />
    </ArcadeFrame>
  );
}
