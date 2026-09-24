/**
 * Procedural Web Audio API sound synthesizer for "The Signal".
 * 
 * Warm analog radio tones:
 * 1. Continuous heterodyne hum: lower pitch, warmer triangle/sine mix
 * 2. Musical chime on lock: gentle 3-note ascending phrase
 * 3. Acknowledgment blip: soft click rather than aggressive chirp
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = true;

  // Continuous tuning hum nodes
  private humOsc1: OscillatorNode | null = null;
  private humOsc2: OscillatorNode | null = null;
  private humGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;

  private activeTimeouts: number[] = [];

  constructor() {}

  private initContext(): boolean {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return false;
      this.ctx = new AudioCtxClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupContinuousHum();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    return true;
  }

  private setupContinuousHum() {
    if (!this.ctx || !this.masterGain) return;

    try {
      // Oscillator 1: Warm triangle wave — lower pitch for AM radio feel
      this.humOsc1 = this.ctx.createOscillator();
      this.humOsc1.type = 'triangle';
      this.humOsc1.frequency.setValueAtTime(160, this.ctx.currentTime);

      // Oscillator 2: Slightly detuned sine for warm beating
      this.humOsc2 = this.ctx.createOscillator();
      this.humOsc2.type = 'sine';
      this.humOsc2.frequency.setValueAtTime(162.5, this.ctx.currentTime);

      this.humGain = this.ctx.createGain();
      this.humGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      this.humOsc1.connect(this.humGain);
      this.humOsc2.connect(this.humGain);

      // Gentle radio static noise
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      // Warmer bandpass — lower center frequency for AM-style crackle
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(600, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      this.noiseNode.connect(noiseFilter);
      noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);

      this.humGain.connect(this.masterGain);

      this.humOsc1.start();
      this.humOsc2.start();
      this.noiseNode.start();
    } catch {
      // Safe fallback
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.4, now + 0.05);
    }
  }

  /**
   * Updates continuous heterodyne tone as visitor turns the dial.
   */
  public updateTuningTone(proximity: number, frequency: number) {
    if (this.isMuted) return;
    if (!this.initContext()) return;
    if (!this.ctx || !this.humGain || !this.humOsc1 || !this.humOsc2 || !this.noiseGain) return;

    const now = this.ctx.currentTime;
    const clampedProximity = Math.max(0, Math.min(1, proximity));

    // Lower pitch range for warm AM radio feel: 140Hz - 280Hz
    const baseFreq = 140 + (frequency - 88) * 5 + clampedProximity * 40;
    this.humOsc1.frequency.setTargetAtTime(baseFreq, now, 0.05);
    this.humOsc2.frequency.setTargetAtTime(baseFreq + 2.5 + clampedProximity * 2.0, now, 0.05);

    const targetGain = clampedProximity > 0.05 ? Math.pow(clampedProximity, 1.8) * 0.12 : 0.0001;
    this.humGain.gain.setTargetAtTime(targetGain, now, 0.04);

    // Static crackle — fades as you tune in
    const noiseTarget = clampedProximity > 0.05 && clampedProximity < 0.95 ? 0.025 * (1 - clampedProximity) : 0.0001;
    this.noiseGain.gain.setTargetAtTime(noiseTarget, now, 0.06);
  }

  /**
   * Warm 3-note chime + soft acknowledgment click on station lock.
   */
  public playLockSequence(stationFrequency: number, onFlare?: () => void) {
    if (this.isMuted) {
      if (onFlare) onFlare();
      return;
    }
    if (!this.initContext()) return;
    if (!this.ctx || !this.masterGain) return;

    this.cancelScheduledSounds();
    this.playMusicalTransmissionClip(stationFrequency);

    const timeoutId = window.setTimeout(() => {
      this.playAcknowledgmentBlip();
      if (onFlare) onFlare();
    }, 320);

    this.activeTimeouts.push(timeoutId);
  }

  private playMusicalTransmissionClip(stationFreq: number) {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    
    // Warmer, gentler chord — lower base pitch
    const basePitch = 330 + ((stationFreq * 11) % 120);
    const intervals = [1, 1.25, 1.5]; // Major triad
    const noteDuration = 0.1;

    intervals.forEach((ratio, idx) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(basePitch * ratio, now + idx * noteDuration);

      const startTime = now + idx * noteDuration;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration + 0.1);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + noteDuration + 0.12);
    });
  }

  private playAcknowledgmentBlip() {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    // Soft click — triangle wave, lower pitch
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.05);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public cancelScheduledSounds() {
    this.activeTimeouts.forEach((id) => clearTimeout(id));
    this.activeTimeouts = [];
  }
}

export const soundManager = new SoundManager();
