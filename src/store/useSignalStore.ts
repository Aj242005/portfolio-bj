import { create } from 'zustand';
import { Station } from '../types/station';
import { STATIONS, MIN_FREQUENCY, MAX_FREQUENCY, LOCK_TOLERANCE } from '../data/stations';
import { soundManager } from '../audio/soundManager';

interface SignalState {
  frequency: number;
  nearestStation: Station;
  proximity: number;
  lockedStation: Station | null;
  isLocked: boolean;
  isMuted: boolean;
  showCredits: boolean;
  viewMode: '3d' | '2d';
  reducedMotion: boolean;
  motionPaused: boolean;
  setFrequency: (frequency: number) => void;
  jumpToStation: (id: string) => void;
  toggleMute: () => void;
  toggleCredits: (show?: boolean) => void;
  setViewMode: (mode: '3d' | '2d') => void;
  setReducedMotion: (reduced: boolean) => void;
  toggleMotion: () => void;
}

// Navigation is independent of WebGL, including when rendering is unavailable.
export const useSignalStore = create<SignalState>((set, get) => ({
  frequency: STATIONS[0].frequency,
  nearestStation: STATIONS[0],
  proximity: 1,
  lockedStation: STATIONS[0],
  isLocked: true,
  isMuted: true,
  showCredits: false,
  viewMode: '3d',
  reducedMotion: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  motionPaused: false,
  setFrequency: (frequency) => {
    if (!Number.isFinite(frequency)) return;
    const clamped = Math.max(MIN_FREQUENCY, Math.min(MAX_FREQUENCY, frequency));
    const nearest = STATIONS.reduce((best, station) =>
      Math.abs(station.frequency - clamped) < Math.abs(best.frequency - clamped) ? station : best);
    const difference = Math.abs(nearest.frequency - clamped);
    const locked = difference <= LOCK_TOLERANCE;
    const changed = locked && get().lockedStation?.id !== nearest.id;
    set({ frequency: clamped, nearestStation: nearest, proximity: Math.max(0, 1 - difference / 1.5),
      isLocked: locked, lockedStation: locked ? nearest : null });
    if (changed) soundManager.playLockSequence(nearest.frequency);
  },
  jumpToStation: (id) => {
    const station = STATIONS.find((item) => item.id === id);
    if (station) get().setFrequency(station.frequency);
  },
  toggleMute: () => {
    const muted = !get().isMuted;
    soundManager.setMuted(muted);
    set({ isMuted: muted });
  },
  toggleCredits: (show) => set((state) => ({ showCredits: show ?? !state.showCredits })),
  setViewMode: (viewMode) => set({ viewMode }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  toggleMotion: () => set((state) => ({ motionPaused: !state.motionPaused })),
}));
