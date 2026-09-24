import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useSignalStore } from '../../store/useSignalStore';

export const PostProcessing: React.FC = () => {
  const reducedMotion = useSignalStore((s) => s.reducedMotion);
  const isLocked = useSignalStore((s) => s.isLocked);

  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      {/* Warm golden bloom for glowing vacuum tubes, dial backlighting, and tower beacons */}
      <Bloom
        intensity={isLocked ? 1.4 : 1.0}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.7}
        mipmapBlur
      />
      {/* Gentle vintage photograph vignette — subtle enough to keep controls and towers bright */}
      <Vignette
        eskil={false}
        offset={0.25}
        darkness={reducedMotion ? 0.35 : 0.55}
      />
    </EffectComposer>
  );
};
