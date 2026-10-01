import { ArrowUpRight, AudioLines, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useSignalStore } from '../../store/useSignalStore';

export function Header() {
  const muted = useSignalStore((state) => state.isMuted);
  const paused = useSignalStore((state) => state.motionPaused);
  return (
    <header className="site-header">
      <a className="brand" href="#main-content" aria-label="Bhavya Jain, home"><span className="brand-mark"><AudioLines size={25} /></span><span>BHAVYA JAIN<small>Backend · Blockchain · Cryptography</small></span></a>
      <nav className="header-nav" aria-label="Main navigation"><a className="header-index" href="#signal-index">Signal index <span>08</span></a><div className="header-tools"><button className="icon-button" aria-label={muted ? 'Enable sound' : 'Mute sound'} aria-pressed={!muted} onClick={() => useSignalStore.getState().toggleMute()}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button><button className="icon-button motion-button" aria-label={paused ? 'Resume motion' : 'Pause motion'} aria-pressed={paused} onClick={() => useSignalStore.getState().toggleMotion()}>{paused ? <Play size={16} /> : <Pause size={16} />}</button></div><a className="resume-link" href="/resume.html" target="_blank" rel="noopener noreferrer">View résumé <ArrowUpRight size={17} /></a></nav>
    </header>
  );
}
