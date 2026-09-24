import React from 'react';
import { useSignalStore } from '../../store/useSignalStore';
import { STATIONS, MIN_FREQUENCY, MAX_FREQUENCY } from '../../data/stations';
import { FileText, ArrowRight } from 'lucide-react';

export const MobileFallback: React.FC = () => {
  const frequency = useSignalStore((s) => s.frequency);
  const lockedStation = useSignalStore((s) => s.lockedStation);
  const setViewMode = useSignalStore((s) => s.setViewMode);
  const lockStation = useSignalStore((s) => s.lockStation);

  const setFrequency = useSignalStore((s) => s.setFrequency);
  const setInteracted = useSignalStore((s) => s.setInteracted);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setInteracted();
    setFrequency(val);
    const matched = STATIONS.find((s) => Math.abs(s.frequency - val) < 0.4);
    if (matched && lockedStation?.id !== matched.id) {
      lockStation(matched);
    }
  };

  const handleSelectStation = (stationId: string) => {
    const st = STATIONS.find((s) => s.id === stationId);
    if (!st) return;
    setInteracted();
    lockStation(st);
  };

  return (
    <div className="w-full min-h-screen bg-[#1a1410] text-[#e8dcc8] pt-20 pb-24 px-4 overflow-y-auto font-['IBM_Plex_Mono']">
      
      {/* Header Hero */}
      <div className="mb-8 text-center">
        <h1 className="font-['Special_Elite'] text-4xl text-[#d4a853] mb-2 tracking-wider">Bhavya Jain</h1>
        <p className="text-[#8a7e6e] text-sm">Applied Cryptography · Zero-Knowledge Proofs</p>
        <button 
          onClick={() => setViewMode('3d')}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#2a2118] border border-[#3a2f22] text-[#d4a853] rounded hover:bg-[#342a1e] transition-colors text-sm"
        >
          Launch 3D Experience <ArrowRight size={16} />
        </button>
      </div>

      {/* Tuner Card */}
      <div className="bg-[#2a2118] border border-[#3a2f22] rounded-xl p-5 mb-8 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[#8a7e6e] text-xs font-bold tracking-widest">CARRIER FREQUENCY</span>
          <span className="text-2xl text-[#d4a853] font-bold">{frequency.toFixed(1)} MHz</span>
        </div>
        
        <input 
          type="range"
          min={MIN_FREQUENCY}
          max={MAX_FREQUENCY}
          step={0.1}
          value={frequency}
          onChange={handleSliderChange}
          className="w-full h-2 bg-[#1a1410] rounded-lg appearance-none cursor-pointer accent-[#d4a853] mb-6"
        />

        <div className="flex flex-wrap gap-2">
          {STATIONS.map((station) => {
            const isActive = lockedStation?.id === station.id;
            return (
              <button
                key={station.id}
                onClick={() => handleSelectStation(station.id)}
                className={`px-3 py-1.5 rounded text-xs transition-colors border ${
                  isActive 
                    ? 'font-bold text-[#e8dcc8]' 
                    : 'bg-[#1a1410] border-[#3a2f22] text-[#8a7e6e]'
                }`}
                style={{ 
                  backgroundColor: isActive ? station.accentColor : undefined,
                  borderColor: isActive ? station.accentColor : undefined
                }}
              >
                {station.frequency.toFixed(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Station Showcase */}
      {lockedStation && (
        <div 
          className="bg-[#2a2118]/90 border rounded-xl p-5 mb-8 shadow-xl transition-all duration-300"
          style={{ borderColor: lockedStation.accentColor, boxShadow: `0 0 20px ${lockedStation.accentColor}20` }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="px-2 py-1 rounded text-white font-bold text-sm"
              style={{ backgroundColor: lockedStation.accentColor }}
            >
              {lockedStation.frequency.toFixed(1)}
            </div>
            <span className="text-[#8a7e6e] text-sm tracking-widest">{lockedStation.id.toUpperCase()}</span>
          </div>

          <div className="mb-6">
            <h2 className="font-['Special_Elite'] text-2xl text-[#e8dcc8] mb-1">{lockedStation.title}</h2>
            <div className="text-[#8a7e6e] text-xs">
              {lockedStation.role} · {lockedStation.organization} · {lockedStation.period}
            </div>
          </div>

          {lockedStation.metrics && lockedStation.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {lockedStation.metrics.map((metric, idx) => (
                <div key={idx} className="bg-[#1a1410] border border-[#3a2f22] rounded p-2 flex flex-col items-center justify-center text-center">
                  <div className="text-[10px] text-[#8a7e6e] uppercase mb-1">{metric.label}</div>
                  <div 
                    className="font-bold text-sm"
                    style={{ color: lockedStation.accentColor }}
                  >
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-[#bfb5a3] text-xs leading-relaxed mb-6">
            {lockedStation.description}
          </div>

          <div className="flex flex-wrap gap-2">
            {lockedStation.tech.map((tech: string, idx: number) => (
              <span key={idx} className="bg-[#1a1410] border border-[#3a2f22] text-[#8a7e6e] text-[10px] px-2 py-1 rounded">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* All Stations Roster */}
      <div className="mb-8">
        <h3 className="text-[#8a7e6e] text-sm font-bold tracking-widest mb-4">ALL STATIONS</h3>
        <div className="flex flex-col gap-3">
          {STATIONS.map((station) => (
            <div 
              key={station.id}
              onClick={() => handleSelectStation(station.id)}
              className="bg-[#2a2118] border border-[#3a2f22] rounded-lg p-4 flex flex-col cursor-pointer hover:border-[#d4a853]/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-['Special_Elite'] text-lg text-[#e8dcc8]">{station.title}</h4>
                <div 
                  className="px-2 py-0.5 rounded text-white text-xs font-bold"
                  style={{ backgroundColor: station.accentColor }}
                >
                  {station.frequency.toFixed(1)}
                </div>
              </div>
              <div className="text-[#8a7e6e] text-xs">
                {station.role} · {station.period}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resume Callout */}
      <div className="bg-[#2a2118] border border-[#d4a853]/40 rounded-xl p-6 text-center">
        <h3 className="font-['Special_Elite'] text-xl text-[#e8dcc8] mb-2">Detailed Transmissions</h3>
        <p className="text-[#8a7e6e] text-xs mb-4">Access the full unclassified records</p>
        <a 
          href="/resume.html" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#d4a853] hover:bg-[#c47832] text-[#1a1410] font-bold py-2 px-6 rounded transition-colors"
        >
          <FileText size={18} />
          VIEW RESUME
        </a>
      </div>

    </div>
  );
};
