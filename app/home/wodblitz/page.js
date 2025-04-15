import React from 'react';
import WordGame from './components/WordGame';
import CRTEffect from '../battledeck/components/CRTEffect';
import './styles/wordgame.css';

export default function WodBlitzPage() {
  return (
    <div className="min-h-screen bg-black text-white p-0">
      <CRTEffect>
        <div className="container mx-auto pt-6">
          <WordGame />
        </div>
      </CRTEffect>
    </div>
  );
}