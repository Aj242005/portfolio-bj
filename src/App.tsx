import { lazy, Suspense, useEffect } from 'react';
import { ArrowDown, ArrowUpRight, AudioLines, ChevronLeft, ChevronRight, Radio, ScanLine } from 'lucide-react';
import { useSignalStore } from './store/useSignalStore';
import { soundManager } from './audio/soundManager';
import { STATIONS, MIN_FREQUENCY, MAX_FREQUENCY } from './data/stations';
import { Header } from './components/ui/Header';
import { StationCard } from './components/ui/StationCard';
import { QuickJumpIndex } from './components/ui/QuickJumpIndex';
import { CreditsModal } from './components/ui/CreditsModal';
import { MobileFallback } from './components/2d/MobileFallback';
import { LoadingScreen } from './components/ui/LoadingScreen';

const Scene = lazy(() => import('./components/3d/Scene'));

export default function App() {
  const frequency = useSignalStore((state) => state.frequency);
  const station = useSignalStore((state) => state.nearestStation);
  const locked = useSignalStore((state) => state.isLocked);
  const viewMode = useSignalStore((state) => state.viewMode);
  const isMuted = useSignalStore((state) => state.isMuted);
  const setFrequency = useSignalStore((state) => state.setFrequency);
  const jump = useSignalStore((state) => state.jumpToStation);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => useSignalStore.getState().setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (isMuted) return;
    const update = () => {
      if (document.hidden) return;
      const state = useSignalStore.getState();
      soundManager.updateTuningTone(state.proximity, state.frequency);
    };
    update();
    const timer = window.setInterval(update, 100);
    const visibility = () => {
      soundManager.setMuted(document.hidden || useSignalStore.getState().isMuted);
      update();
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      clearInterval(timer);
      soundManager.setMuted(true);
      soundManager.cancelScheduledSounds();
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [isMuted]);

  const navigate = (direction: number) => {
    const index = STATIONS.findIndex((item) => item.id === station.id);
    jump(STATIONS[(index + direction + STATIONS.length) % STATIONS.length].id);
    if (window.innerWidth <= 760) document.querySelector('.dossier')?.scrollIntoView({ behavior: useSignalStore.getState().reducedMotion ? 'instant' : 'smooth', block: 'start' });
  };

  return (
    <div className="observatory">
      <a className="skip-link" href="#signal-index">Skip to projects</a>
      <Header />
      <main id="main-content">
        <section className="experience" aria-label="Cryptographic observatory">
          <div className="scene-stage" aria-label="Interactive 3D signal resonator">
            {viewMode === '3d' ? <Suspense fallback={<LoadingScreen />}><Scene /></Suspense> : <MobileFallback />}
          </div>
          <div className="scene-shade" aria-hidden="true" />
          <div className="profile-intro">
            <h1>Building trust.<br /><span>Beyond the<br />noise.</span></h1>
            <p className="profile-role">Research Associate · Cryptography @ Namo Labs</p>
            <p className="profile-description">I build verifiable systems: ZK proofs, quantum-resistant networks, and Rust infrastructure. Published researcher. Founder of AlterBlock.</p>
            <div className="specialisms"><span>Applied cryptography</span><span>Distributed systems</span><span>Zero-knowledge proofs</span></div>
            <a className="text-link explore-link" href="#signal-index">Explore my signals <ArrowDown size={16} /></a>
          </div>
          <div className="scene-caption" aria-hidden="true"><span className="caption-cross">+</span><span>THE SIGNAL<br /><strong>Cryptographic observatory</strong></span></div>
          <div className="scene-instruction"><ScanLine size={14} /><span>Drag to orbit. Select a signal to explore.</span></div>
          <StationCard />
        </section>
        <section className="receiver" aria-label="Frequency tuner">
          <div className="receiver-heading"><Radio size={19} /><div><h2>Find your frequency.</h2><p>{STATIONS.length} signals. One engineering journey.</p></div></div>
          <div className="tuning-control">
            <div className="tuning-scale" aria-hidden="true"><span>88</span><span>92</span><span>96</span><span>100</span><span>104</span><span>108 MHz</span></div>
            <div className="frequency-track">
              <div className="frequency-ticks" aria-hidden="true" />
              {STATIONS.map((item) => <span key={item.id} aria-hidden="true" className={'tuner-stop ' + (station.id === item.id && locked ? 'is-active' : '')} style={{ left: (item.frequency - MIN_FREQUENCY) / (MAX_FREQUENCY - MIN_FREQUENCY) * 100 + '%' }} />)}
              <input type="range" min={MIN_FREQUENCY} max={MAX_FREQUENCY} step={0.1} value={frequency} onChange={(event) => setFrequency(Number(event.target.value))} aria-label="Tune signal frequency" aria-valuetext={frequency.toFixed(1) + ' MHz, ' + (locked ? station.title : 'searching')} />
            </div>
          </div>
          <div className="receiver-readout"><div className="frequency-number">{frequency.toFixed(1)}<span>MHz</span></div><span className={'signal-status ' + (locked ? 'locked' : '')}><i />{locked ? 'SIGNAL LOCKED' : 'SCANNING'}</span></div>
          <div className="station-arrows"><button className="icon-button" onClick={() => navigate(-1)} aria-label="Previous signal"><ChevronLeft size={19} /></button><button className="icon-button" onClick={() => navigate(1)} aria-label="Next signal"><ChevronRight size={19} /></button></div>
        </section>
        <a className="receiver-selected" href="#selected-signal"><span>{station.title.split(' — ')[0]}</span>Read selected signal <ArrowUpRight size={14} /></a>
        <QuickJumpIndex />
      </main>
      <footer className="site-footer"><span><AudioLines size={14} /> Built on curiosity. Engineered for trust.</span><a href="/resume.html" target="_blank" rel="noopener noreferrer">Bhavya Jain · Full résumé <ArrowUpRight size={14} /></a><button onClick={() => useSignalStore.getState().toggleCredits(true)}>About this experience</button></footer>
      <CreditsModal />
    </div>
  );
}
