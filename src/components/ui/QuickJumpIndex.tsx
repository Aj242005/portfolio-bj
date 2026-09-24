import React from 'react';
import { Radio } from 'lucide-react';
import { useSignalStore } from '../../store/useSignalStore';
import { STATIONS } from '../../data/stations';

export const QuickJumpIndex: React.FC = () => {
  const jumpToStation = useSignalStore((s) => s.jumpToStation);
  const frequency = useSignalStore((s) => s.frequency);
  const lockedStation = useSignalStore((s) => s.lockedStation);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#1a1410]/90 backdrop-blur border border-[#3a2f22] rounded-xl p-3 w-[90%] max-w-4xl shadow-2xl">
      <div className="flex items-center gap-2 mb-3 px-2">
        <Radio size={16} className="text-[#d4a853]" />
        <span className="font-['IBM_Plex_Mono'] text-xs font-bold tracking-widest text-[#d4a853]">STATION PRESETS</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 px-2 scrollbar-hide">
        {STATIONS.map((station) => {
          const isLocked = lockedStation?.id === station.id;
          const isTuned = Math.abs(frequency - station.frequency) < 0.5 && !isLocked;
          
          return (
            <button
              key={station.id}
              onClick={() => jumpToStation(station.id)}
              className={`flex-shrink-0 flex flex-col items-start p-2 rounded border min-w-[120px] transition-all duration-300 font-['IBM_Plex_Mono']
                ${isLocked 
                  ? 'bg-[#342a1e] text-[#e8dcc8] font-bold shadow-[0_0_10px_rgba(212,168,83,0.2)]' 
                  : isTuned 
                    ? 'bg-[#342a1e] text-[#d4a853] border-[#d4a853]/40' 
                    : 'bg-[#2a2118] border-[#3a2f22] text-[#8a7e6e] hover:bg-[#342a1e] hover:text-[#bfb5a3]'
                }`}
              style={{
                borderColor: isLocked ? station.accentColor : undefined,
                boxShadow: isLocked ? `0 0 10px ${station.accentColor}33` : undefined
              }}
            >
              <span className="text-xs mb-1">{station.frequency.toFixed(1)} MHz</span>
              <span className="text-xs truncate w-full text-left">{station.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
