import { Radio, RotateCcw } from 'lucide-react';
import { useSignalStore } from '../../store/useSignalStore';

// Used only when WebGL fails. Phones receive the real 3D experience.
export function MobileFallback() {
  return <div className="scene-unavailable"><Radio size={40} /><h2>Your signals are still here.</h2><p>This browser couldn’t start the 3D observatory. Explore every project with the frequency tuner and signal index below.</p><button className="text-link" onClick={() => useSignalStore.getState().setViewMode('3d')}><RotateCcw size={15} />Retry 3D</button></div>;
}
