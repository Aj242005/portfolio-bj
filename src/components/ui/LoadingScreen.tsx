import React, { useEffect, useState } from 'react';
import { Radio } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
}

const STEPS = [
  'WARMING UP THE VACUUM TUBES...',
  'CALIBRATING FREQUENCY OSCILLATOR...',
  'SCANNING 8 BROADCAST STATIONS...',
  'RECEIVER READY — TUNE IN'
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (step < STEPS.length - 1) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 250);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setFading(true);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-[#1a1410] flex flex-col items-center justify-center transition-opacity duration-500 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative mb-8">
        <Radio size={64} className="text-[#d4a853] animate-pulse" />
        <div className="absolute inset-0 bg-[#d4a853] blur-xl opacity-20 rounded-full animate-pulse"></div>
      </div>
      
      <h1 className="font-['Special_Elite'] text-4xl text-[#d4a853] mb-2 tracking-widest text-center">BHAVYA JAIN</h1>
      <p className="font-['IBM_Plex_Mono'] text-[#8a7e6e] tracking-[0.3em] mb-12 text-sm text-center">THE SIGNAL // VINTAGE RADIO PORTFOLIO</p>
      
      <div className="w-64 max-w-[80vw] bg-[#2a2118] h-2 rounded-full overflow-hidden mb-6 border border-[#3a2f22]">
        <div 
          className="h-full bg-gradient-to-r from-[#d4a853] to-[#c47832] transition-all duration-300 ease-out"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        ></div>
      </div>
      
      <div className="font-['IBM_Plex_Mono'] text-xs min-h-[1.5rem] text-center px-4">
        {STEPS.map((s, i) => (
          <div key={i} className={`${i === step ? 'text-[#d4a853] font-bold' : 'text-[#8a7e6e] hidden'}`}>
            &gt; {s}
          </div>
        ))}
      </div>
    </div>
  );
};
