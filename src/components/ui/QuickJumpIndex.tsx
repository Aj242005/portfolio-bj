import { ArrowUpRight } from 'lucide-react';
import { STATIONS } from '../../data/stations';
import { useSignalStore } from '../../store/useSignalStore';

export function QuickJumpIndex() {
  const selected = useSignalStore((state) => state.lockedStation?.id);
  return (
    <section className="signal-index" id="signal-index" aria-labelledby="signal-index-title">
      <div className="index-heading"><h2 id="signal-index-title">Signal index</h2><span>Experience / Research / Selected work</span></div>
      <div className="station-grid">{STATIONS.map((station, index) => <button key={station.id} className={'station-preset ' + (selected === station.id ? 'is-selected' : '')} aria-pressed={selected === station.id} onClick={() => { useSignalStore.getState().jumpToStation(station.id); if (window.innerWidth <= 760) document.querySelector('.dossier')?.scrollIntoView({ behavior: useSignalStore.getState().reducedMotion ? 'instant' : 'smooth', block: 'start' }); }}><div className="preset-top"><span>{station.frequency.toFixed(1)}<small>MHz</small></span><span className="preset-indicator">{selected === station.id ? <i /> : <ArrowUpRight size={14} />}</span></div><strong>{station.title.split(' — ')[0] === 'Post-Quantum Cryptography Research Initiative' ? 'PQC Research' : station.title.split(' — ')[0] === 'ZK Proof-of-Reserves Vault' ? 'ZK Vault' : station.title.split(' — ')[0]}</strong><span className="preset-bottom">{station.category === 'origin' ? 'Education & honors' : station.category}<span>{String(index + 1).padStart(2, '0')}</span></span></button>)}</div>
    </section>
  );
}
