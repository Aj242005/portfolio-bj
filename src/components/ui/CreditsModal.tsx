import React from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useSignalStore } from '../../store/useSignalStore';

export const CreditsModal: React.FC = () => {
  const showCredits = useSignalStore((s) => s.showCredits);
  const toggleCredits = useSignalStore((s) => s.toggleCredits);

  if (!showCredits) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur flex items-center justify-center p-4">
      <div className="bg-[#2a2118] border border-[#3a2f22] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden font-['IBM_Plex_Mono']">
        <div className="flex items-center justify-between p-4 border-b border-[#3a2f22]">
          <div className="flex items-center gap-2 text-[#d4a853]">
            <ShieldCheck size={20} />
            <h2 className="font-bold tracking-wider">ATTRIBUTION & CREDITS</h2>
          </div>
          <button 
            onClick={() => toggleCredits(false)}
            className="text-[#8a7e6e] hover:text-[#d4a853] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm text-[#e8dcc8]">
          <p>
            The Signal is a portfolio experience built with React, Three.js, React Three Fiber, and the Web Audio API. 
            It simulates a vintage AM/FM radio receiver to explore professional projects.
          </p>

          <div className="space-y-4">
            <h3 className="text-[#8a7e6e] text-xs font-bold tracking-widest border-b border-[#3a2f22] pb-2">3D MODELS (SKETCHFAB)</h3>
            
            <div className="bg-[#1a1410] p-4 rounded-lg border border-[#3a2f22]">
              <p className="font-bold mb-1">"Sci_Fi Antenna"</p>
              <p className="text-[#8a7e6e] text-xs mb-2">Used as the beacon tower reference</p>
              <p className="text-xs">
                By <a href="https://sketchfab.com/Zambur" target="_blank" rel="noopener noreferrer" className="text-[#d4a853] hover:underline">Zambur</a> under CC Attribution
              </p>
            </div>

            <div className="bg-[#1a1410] p-4 rounded-lg border border-[#3a2f22]">
              <p className="font-bold mb-1">"Sci-fi Control Panel"</p>
              <p className="text-[#8a7e6e] text-xs mb-2">Used as the dial console reference</p>
              <p className="text-xs">
                By <a href="https://sketchfab.com/holgcool" target="_blank" rel="noopener noreferrer" className="text-[#d4a853] hover:underline">holgcool</a> under CC Attribution
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#3a2f22] bg-[#1a1410] flex justify-end">
          <button 
            onClick={() => toggleCredits(false)}
            className="px-6 py-2 bg-[#342a1e] hover:bg-[#3a2f22] text-[#e8dcc8] rounded font-bold transition-colors border border-[#3a2f22]"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
