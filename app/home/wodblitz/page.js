import React from 'react';
import WordGame from './components/WordGame';
import CRTEffect from '../battledeck/components/CRTEffect';
import './styles/wordgame.css';

export default function WodBlitzPage() {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <CRTEffect>
        <div className="container mx-auto py-8">
          <WordGame />
        </div>
      </CRTEffect>
    </div>
  );
}