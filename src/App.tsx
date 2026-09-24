import React, { useEffect } from 'react';
import { useSignalStore } from './store/useSignalStore';
import { Scene } from './components/3d/Scene';
import { MobileFallback } from './components/2d/MobileFallback';
import { Header } from './components/ui/Header';
import { QuickJumpIndex } from './components/ui/QuickJumpIndex';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { CreditsModal } from './components/ui/CreditsModal';
import { StationCard } from './components/ui/StationCard';

export const App: React.FC = () => {
  const viewMode = useSignalStore((s) => s.viewMode);
  const setViewMode = useSignalStore((s) => s.setViewMode);
  const setReducedMotion = useSignalStore((s) => s.setReducedMotion);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode === '3d') {
        setViewMode('2d');
      }
    };

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    setReducedMotion(motionQuery.matches);
    motionQuery.addEventListener('change', handleMotionChange);
    window.addEventListener('resize', handleResize);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', handleResize);
    };
  }, [viewMode, setViewMode, setReducedMotion]);

  return (
    <div className="relative w-screen h-screen bg-[#1a1410] overflow-hidden text-[#e8dcc8] font-sans">
      {/* Loading screen */}
      <LoadingScreen />

      {/* Persistent Header */}
      <Header />

      {/* Main Experience */}
      <main className="w-full h-full">
        {viewMode === '3d' ? (
          <>
            <Scene />
            <QuickJumpIndex />
            {/* 2D Station Card overlay — rendered OUTSIDE the 3D canvas */}
            <StationCard />
          </>
        ) : (
          <MobileFallback />
        )}
      </main>

      {/* Credits Modal */}
      <CreditsModal />
    </div>
  );
};

export default App;
