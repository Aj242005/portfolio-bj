import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useSignalStore } from '../../store/useSignalStore';

export function CreditsModal() {
  const open = useSignalStore((state) => state.showCredits);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  return <dialog ref={dialog} className="credits-dialog" aria-labelledby="credits-title" onClose={() => useSignalStore.getState().toggleCredits(false)} onClick={(event) => { if (event.target === event.currentTarget) useSignalStore.getState().toggleCredits(false); }}><div className="credits-heading"><h2 id="credits-title">Inside the observatory.</h2><button className="icon-button" aria-label="Close about this experience" onClick={() => useSignalStore.getState().toggleCredits(false)}><X size={20} /></button></div><p>The Signal is Bhavya Jain’s interactive engineering portfolio. Eight frequencies connect his backend, blockchain, and cryptography work through a live 3D resonator.</p><p>The observatory is built procedurally with React, Three.js, React Three Fiber, and the Web Audio API. Its geometry and materials are created in code.</p><p>Drag to orbit, select a node, or use the frequency tuner. Sound is optional. Pause motion in the header; your system’s reduced-motion preference is also respected.</p><a className="text-link" href="/resume.html" target="_blank" rel="noopener noreferrer">Read the full résumé</a></dialog>;
}
