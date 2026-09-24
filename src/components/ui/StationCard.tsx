import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useSignalStore } from '../../store/useSignalStore';
import { STATIONS } from '../../data/stations';
import { FileText, ChevronRight, X } from 'lucide-react';

export const StationCard: React.FC = () => {
  const isLocked = useSignalStore((s) => s.isLocked);
  const lockedStation = useSignalStore((s) => s.lockedStation);
  const isPanelOpen = useSignalStore((s) => s.isPanelOpen);
  const showCredits = useSignalStore((s) => s.showCredits);
  const setPanelOpen = useSignalStore((s) => s.setPanelOpen);
  const jumpToStation = useSignalStore((s) => s.jumpToStation);
  
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLocked && lockedStation && isPanelOpen && !showCredits) {
      gsap.fromTo(
        cardRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [isLocked, lockedStation, isPanelOpen, showCredits]);

  if (!isLocked || !lockedStation || !isPanelOpen || showCredits) return null;

  const station = lockedStation;
  const currentIndex = STATIONS.findIndex(s => s.id === station.id);
  const nextStation = STATIONS[(currentIndex + 1) % STATIONS.length];

  const handleNext = () => {
    jumpToStation(nextStation.id);
  };

  return (
    <div 
      ref={cardRef}
      className="fixed top-20 right-4 z-30 w-[420px] max-h-[calc(100vh-120px)] overflow-y-auto pointer-events-auto bg-[#2a2118]/95 backdrop-blur-md border border-[#3a2f22] rounded-xl shadow-2xl font-['IBM_Plex_Mono'] scrollbar-hide"
      style={{ boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px ${station.accentColor}20 inset` }}
    >
      <div className="p-5 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="px-2 py-1 rounded text-white font-bold text-sm"
              style={{ backgroundColor: station.accentColor }}
            >
              {station.frequency.toFixed(1)}
            </div>
            <span className="text-[#8a7e6e] text-sm tracking-widest">{station.id.toUpperCase()}</span>
          </div>
          <button 
            onClick={() => setPanelOpen(false)}
            aria-label="Close Station Details"
            className="text-[#8a7e6e] hover:text-[#e8dcc8] transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Title Area */}
        <div className="mb-6">
          <h2 className="font-['Special_Elite'] text-2xl text-[#e8dcc8] mb-1">{station.title}</h2>
          <div className="text-[#8a7e6e] text-xs">
            {station.role} · {station.organization} · {station.period}
          </div>
        </div>

        {/* Metrics */}
        {station.metrics && station.metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-6">
            {station.metrics.map((metric, idx) => (
              <div key={idx} className="bg-[#1a1410] border border-[#3a2f22] rounded p-2 flex flex-col items-center justify-center text-center">
                <div className="text-[10px] text-[#8a7e6e] uppercase mb-1">{metric.label}</div>
                <div 
                  className="font-bold text-sm"
                  style={{ color: station.accentColor }}
                >
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="text-[#bfb5a3] text-xs leading-relaxed mb-6">
          {station.description}
        </div>

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {station.tech.map((tech, idx) => (
            <span key={idx} className="bg-[#1a1410] border border-[#3a2f22] text-[#8a7e6e] text-[10px] px-2 py-1 rounded">
              {tech}
            </span>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-auto flex gap-3 pt-4 border-t border-[#3a2f22]">
          <a 
            href="/resume.html" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#1a1410] border border-[#3a2f22] hover:bg-[#342a1e] text-[#e8dcc8] text-xs py-2 rounded transition-colors"
          >
            <FileText size={14} />
            View Full Resume
          </a>
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 bg-[#342a1e] hover:bg-[#3a2f22] text-[#e8dcc8] text-xs py-2 rounded transition-colors border border-[#3a2f22]"
            style={{ borderColor: `${station.accentColor}40` }}
          >
            Next Station
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
