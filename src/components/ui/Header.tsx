import React from 'react';
import { Volume2, VolumeX, Info, FileText, Monitor, Box } from 'lucide-react';
import { useSignalStore } from '../../store/useSignalStore';

export const Header: React.FC = () => {
  const isMuted = useSignalStore((s) => s.isMuted);
  const toggleMute = useSignalStore((s) => s.toggleMute);
  const viewMode = useSignalStore((s) => s.viewMode);
  const setViewMode = useSignalStore((s) => s.setViewMode);
  const toggleCredits = useSignalStore((s) => s.toggleCredits);
  const frequency = useSignalStore((s) => s.frequency);
  const isLocked = useSignalStore((s) => s.isLocked);

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#1a1410]/90 backdrop-blur border-b border-[#3a2f22] text-[#e8dcc8] px-4 py-3 flex items-center justify-between">
      <div className="flex flex-col">
        <h1 className="font-['Special_Elite'] text-xl tracking-wider text-[#e8dcc8]">BHAVYA JAIN</h1>
        <span className="font-['IBM_Plex_Mono'] text-xs text-[#8a7e6e]">Applied Cryptography · Zero-Knowledge Proofs · P2P Systems</span>
      </div>

      <div className="hidden lg:flex flex-col items-center justify-center">
        <div className="font-['IBM_Plex_Mono'] text-sm text-[#8a7e6e] mb-1">CARRIER FREQUENCY</div>
        <div className="flex items-center gap-2">
          <span className={`font-['IBM_Plex_Mono'] text-2xl ${isLocked ? 'text-[#d4a853]' : 'text-[#8a7e6e]'} transition-colors duration-300`}>
            {frequency.toFixed(1)} MHz
          </span>
          {isLocked && <span className="w-2 h-2 rounded-full bg-[#d4a853] shadow-[0_0_8px_#d4a853] animate-pulse" />}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => toggleMute()}
          className="p-2 rounded bg-[#2a2118] border border-[#3a2f22] text-[#8a7e6e] hover:text-[#d4a853] transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        
        <button
          onClick={() => setViewMode(viewMode === '3d' ? '2d' : '3d')}
          className="p-2 rounded bg-[#2a2118] border border-[#3a2f22] text-[#8a7e6e] hover:text-[#d4a853] transition-colors"
          title="Toggle View Mode"
        >
          {viewMode === '3d' ? <Monitor size={18} /> : <Box size={18} />}
        </button>

        <button
          onClick={() => toggleCredits()}
          className="p-2 rounded bg-[#2a2118] border border-[#3a2f22] text-[#8a7e6e] hover:text-[#d4a853] transition-colors"
          title="About & Credits"
        >
          <Info size={18} />
        </button>

        <a
          href="/resume.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded bg-[#d4a853] text-[#1a1410] font-bold hover:bg-[#c47832] transition-colors font-['IBM_Plex_Mono'] text-sm ml-2"
        >
          <FileText size={16} />
          <span className="hidden sm:inline">VIEW RESUME</span>
        </a>
      </div>
    </header>
  );
};
