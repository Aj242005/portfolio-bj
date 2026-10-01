import { Radio } from 'lucide-react';
export function LoadingScreen() {
  return <div className="scene-loading" role="status"><Radio size={27} /><span>Establishing the signal…</span></div>;
}
