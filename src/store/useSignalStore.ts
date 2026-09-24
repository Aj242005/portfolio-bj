import { create } from 'zustand';
import { Station } from '../types/station';
import { STATIONS, MIN_FREQUENCY, MAX_FREQUENCY, LOCK_TOLERANCE } from '../data/stations';
import { soundManager } from '../audio/soundManager';

interface SignalState {
  frequency: number;
  targetFrequency: number | null;
  nearestStation: Station | null;
  proximity: number; // 0 (far) to 1 (exact match)
  lockedStation: Station | null;
  isLocked: boolean;
  isLocking: boolean;
  isPanelOpen: boolean;
  isMuted: boolean;
  hasInteracted: boolean;
  showCredits: boolean;
  viewMode: '3d' | '2d';
  reducedMotion: boolean;

  // Actions
  setFrequency: (freq: number) => void;
  setTargetFrequency: (freq: number | null) => void;
  jumpToStation: (stationId: string) => void;
  lockStation: (station: Station) => void;
  unlockStation: () => void;
  setLockedStation: (station: Station | null) => void;
  setIsLocked: (locked: boolean) => void;
  setIsLocking: (locking: boolean) => void;
  setPanelOpen: (open: boolean) => void;
  toggleMute: () => void;
  setInteracted: () => void;
  toggleCredits: (show?: boolean) => void;
  setViewMode: (mode: '3d' | '2d') => void;
  setReducedMotion: (reduced: boolean) => void;
}

export const useSignalStore = create<SignalState>((set, get) => ({
  frequency: 88.5,
  targetFrequency: null,
  nearestStation: STATIONS[0],
  proximity: 1.0,
  lockedStation: null,
  isLocked: false,
  isLocking: false,
  isPanelOpen: false,
  isMuted: true, // Muted by default per browser autoplay policies
  hasInteracted: false,
  showCredits: false,
  viewMode: typeof window !== 'undefined' && window.innerWidth < 768 ? '2d' : '3d',
  reducedMotion: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,

  setFrequency: (freq: number) => {
    const clamped = Math.max(MIN_FREQUENCY, Math.min(MAX_FREQUENCY, freq));
    
    // Calculate nearest station and proximity
    let bestStation: Station | null = null;
    let minDiff = Infinity;

    for (const station of STATIONS) {
      const diff = Math.abs(station.frequency - clamped);
      if (diff < minDiff) {
        minDiff = diff;
        bestStation = station;
      }
    }

    // Proximity curve: 1.0 at 0 diff, 0.0 at 1.5 MHz diff
    const proximityBand = 1.5;
    const proximity = Math.max(0, 1 - minDiff / proximityBand);

    const { lockedStation, targetFrequency } = get();

    // Don't auto-unlock if we're animating toward a target frequency
    // (prevents the jumpToStation flash-close bug)
    if (targetFrequency !== null) {
      set({
        frequency: clamped,
        nearestStation: bestStation,
        proximity,
      });
      return;
    }

    let newLocked = lockedStation;
    let isLocked = get().isLocked;
    let isPanelOpen = get().isPanelOpen;

    // If we move too far away from the locked station, gracefully unlock and close panel
    if (lockedStation && Math.abs(lockedStation.frequency - clamped) > LOCK_TOLERANCE * 1.5) {
      newLocked = null;
      isLocked = false;
      isPanelOpen = false;
    }

    set({
      frequency: clamped,
      nearestStation: bestStation,
      proximity,
      lockedStation: newLocked,
      isLocked,
      isPanelOpen
    });
  },

  setTargetFrequency: (freq: number | null) => {
    set({ targetFrequency: freq });
  },

  jumpToStation: (stationId: string) => {
    const station = STATIONS.find((s) => s.id === stationId);
    if (!station) return;

    // Only set target frequency — let the dial animate there.
    // Lock will happen when the animation completes via RadioDial's dwell timer
    // or via the explicit lockStation call after arrival.
    set({
      targetFrequency: station.frequency,
      hasInteracted: true
    });
  },

  lockStation: (station: Station) => {
    set({
      lockedStation: station,
      isLocked: true,
      isPanelOpen: true,
      frequency: station.frequency,
      nearestStation: station,
      proximity: 1.0,
      targetFrequency: null,
    });
    soundManager.playLockSequence(station.frequency);
  },

  unlockStation: () => {
    set({
      lockedStation: null,
      isLocked: false,
      isPanelOpen: false,
    });
  },

  setLockedStation: (station: Station | null) => {
    set({
      lockedStation: station,
      isLocked: station !== null,
      isPanelOpen: station !== null
    });
  },

  setIsLocked: (locked: boolean) => set({ isLocked: locked }),
  setIsLocking: (locking: boolean) => set({ isLocking: locking }),
  setPanelOpen: (open: boolean) => set({ isPanelOpen: open }),
  
  toggleMute: () => {
    const next = !get().isMuted;
    set({ isMuted: next, hasInteracted: true });
  },

  setInteracted: () => {
    if (!get().hasInteracted) {
      set({ hasInteracted: true });
    }
  },

  toggleCredits: (show?: boolean) => {
    set((state) => ({ showCredits: show !== undefined ? show : !state.showCredits }));
  },

  setViewMode: (mode: '3d' | '2d') => set({ viewMode: mode }),
  setReducedMotion: (reduced: boolean) => set({ reducedMotion: reduced })
}));
