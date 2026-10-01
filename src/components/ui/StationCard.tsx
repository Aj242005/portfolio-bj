import { ArrowUpRight, ChevronRight, Radio } from 'lucide-react';
import { useSignalStore } from '../../store/useSignalStore';
import { STATIONS } from '../../data/stations';

export function StationCard() {
  const station = useSignalStore((state) => state.lockedStation);
  const nearest = useSignalStore((state) => state.nearestStation);
  const current = station ?? nearest;
  const index = STATIONS.findIndex((item) => item.id === current.id);
  const next = STATIONS[(index + 1) % STATIONS.length];
  return (
    <aside className="dossier" id="selected-signal" aria-label="Selected signal details">
      <div className="dossier-status"><span><i className={station ? 'status-dot' : 'status-dot scanning'} />{station ? 'RECEIVING TRANSMISSION' : 'SEARCHING FOR SIGNAL'}</span><Radio size={15} /></div>
      <span className="dossier-scroll-cue">Scroll for technologies and details</span>
      <article key={current.id} className="dossier-content">
        <div className="dossier-frequency"><span>{current.frequency.toFixed(1)} <small>MHz</small></span><span className="dossier-category">{current.category}</span></div>
        <h2>{current.title}</h2>
        <p className="dossier-role">{current.role}</p>
        <p className="dossier-period">{current.period}<span> / </span>{current.location}</p>
        <p className="dossier-description">{current.description}</p>
        <dl className="dossier-metrics">{current.metrics.map((metric) => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl>
        <div className="tech-stack" aria-label="Technologies">{current.tech.map((tech) => <span key={tech}>{tech}</span>)}</div>
        <div className="dossier-actions"><a href={current.caseStudyUrl ?? '/resume.html'} target="_blank" rel="noopener noreferrer">{current.caseStudyUrl ? current.category === 'research' ? 'Read publication' : 'Visit project' : 'Full engineering record'}<ArrowUpRight size={15} /></a>{current.repoUrl && <a href={current.repoUrl} target="_blank" rel="noopener noreferrer">Source code<ArrowUpRight size={15} /></a>}{current.links?.map((link) => <a key={link.url} href={link.url} target={link.url.startsWith('https:') ? '_blank' : undefined} rel={link.url.startsWith('https:') ? 'noopener noreferrer' : undefined}>{link.label}<ArrowUpRight size={15} /></a>)}</div>
      </article>
      <a className="dossier-record" href="/resume.html" target="_blank" rel="noopener noreferrer">Full engineering record <ArrowUpRight size={15} /></a>
      <button className="next-transmission" onClick={() => { useSignalStore.getState().jumpToStation(next.id); if (window.innerWidth <= 760) document.querySelector('.dossier')?.scrollIntoView({ behavior: useSignalStore.getState().reducedMotion ? 'instant' : 'smooth', block: 'start' }); }}><span>Next transmission<small>{next.title.split(' — ')[0]}</small></span><ChevronRight size={18} /></button>
      <span className="sr-only" role="status">{station ? 'Selected ' + current.title : 'Scanning near ' + current.title}</span>
    </aside>
  );
}
