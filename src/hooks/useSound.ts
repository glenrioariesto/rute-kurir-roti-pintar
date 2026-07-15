import { useState, useCallback, useEffect, useRef } from 'react';

const SOUND_KEY = 'rute-kurir-sound-enabled';
const BASE_URL = import.meta.env?.BASE_URL || '/';
const BGM_SRC = `${BASE_URL}bgm-silly-fun.mp3`;
const CLICK_SRC = `${BASE_URL}click.mp3`;
const MOTOR_SRC = `${BASE_URL}motor.mp3`;
const WIN_SRC = `${BASE_URL}win.mp3`;

function getInitialState(): boolean {
  try {
    const stored = localStorage.getItem(SOUND_KEY);
    return stored === null ? true : stored === 'true';
  } catch {
    return true;
  }
}

let audioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function useSound() {
  const [isSoundOn, setIsSoundOn] = useState(getInitialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const motorAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickTimeoutRef = useRef<any>(null);
  const hasInteractedRef = useRef(false);

  // Create audio elements once
  useEffect(() => {
    const audio = new Audio(BGM_SRC);
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'auto';
    audioRef.current = audio;

    const clickAudio = new Audio(CLICK_SRC);
    clickAudio.volume = 0.85;
    clickAudio.preload = 'auto';
    clickAudioRef.current = clickAudio;

    const motorAudio = new Audio(MOTOR_SRC);
    motorAudio.volume = 0.45;
    motorAudio.preload = 'auto';
    motorAudioRef.current = motorAudio;

    const winAudio = new Audio(WIN_SRC);
    winAudio.volume = 0.65;
    winAudio.preload = 'auto';
    winAudioRef.current = winAudio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;

      clickAudio.pause();
      clickAudio.src = '';
      clickAudioRef.current = null;

      motorAudio.pause();
      motorAudio.src = '';
      motorAudioRef.current = null;

      winAudio.pause();
      winAudio.src = '';
      winAudioRef.current = null;

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  // Handle play/pause based on isSoundOn
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isSoundOn && hasInteractedRef.current) {
      audio.play().catch(() => {
        // Autoplay blocked — will retry on next user interaction
      });
    } else {
      audio.pause();
    }
  }, [isSoundOn]);

  // Persist preference
  useEffect(() => {
    try {
      localStorage.setItem(SOUND_KEY, String(isSoundOn));
    } catch {
      // Ignore storage errors
    }
  }, [isSoundOn]);

  // Start BGM on first user interaction (to satisfy browser autoplay policy)
  useEffect(() => {
    const startOnInteraction = () => {
      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
        if (isSoundOn && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener('click', startOnInteraction, { once: true });
    document.addEventListener('touchstart', startOnInteraction, { once: true });
    document.addEventListener('keydown', startOnInteraction, { once: true });

    return () => {
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
      document.removeEventListener('keydown', startOnInteraction);
    };
  }, [isSoundOn]);

  const toggleSound = useCallback(() => {
    // Mark as interacted when user explicitly toggles
    hasInteractedRef.current = true;
    setIsSoundOn(prev => !prev);
  }, []);

  const playClick = useCallback(() => {
    if (clickAudioRef.current) {
      const clickAudio = clickAudioRef.current;

      // Clear any existing stop timer
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      // Start at 1150ms (1.15 seconds)
      clickAudio.currentTime = 1.15;
      clickAudio.play().catch(() => {});

      // Stop after 850ms (at 2000ms / 2.0 seconds)
      clickTimeoutRef.current = setTimeout(() => {
        clickAudio.pause();
      }, 850);
    }
  }, []);

  const playHouseClick = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(261.63, ctx.currentTime + 0.1); // C4
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.error('Failed to play house click sound:', e);
    }
  }, []);

  const playWaypointClick = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      
      const playBeep = (freq: number, startDelay: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + startDelay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + startDelay);
        osc.stop(ctx.currentTime + startDelay + dur);
      };

      // Play two notes (E5, then A5)
      playBeep(659.25, 0, 0.08);
      playBeep(880.00, 0.07, 0.12);
    } catch (e) {
      console.error('Failed to play waypoint click sound:', e);
    }
  }, []);

  const playDeliverSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.5);
      
      // Subtle vibrato to sound like engine vroom
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 25;
      lfoGain.gain.value = 15;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      lfo.start();
      osc.start();
      
      lfo.stop(ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error('Failed to play deliver sound:', e);
    }
  }, []);

  const playResetSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(330, ctx.currentTime); // E4
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.25); // A2
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.error('Failed to play reset sound:', e);
    }
  }, []);

  const playUndoSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(392, ctx.currentTime); // G4
      osc.frequency.exponentialRampToValueAtTime(196, ctx.currentTime + 0.12); // G3
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      console.error('Failed to play undo sound:', e);
    }
  }, []);

  const stopWin = useCallback(() => {
    if (winAudioRef.current) {
      try {
        winAudioRef.current.pause();
        winAudioRef.current.currentTime = 0;
      } catch (e) {
        console.warn('Failed to stop win audio:', e);
      }
    }
  }, []);

  const playMotor = useCallback(() => {
    stopWin(); // Stop victory sound if playing
    const motorAudio = motorAudioRef.current;
    if (motorAudio) {
      const setStartOffset = () => {
        try {
          motorAudio.currentTime = 7.0;
        } catch (e) {
          console.warn('Failed to set currentTime on motor audio:', e);
        }
      };

      if (motorAudio.readyState >= 1) {
        setStartOffset();
      } else {
        motorAudio.onloadedmetadata = () => {
          setStartOffset();
          motorAudio.onloadedmetadata = null;
        };
      }

      // Loop between 7s and 12s (stable cruising sound)
      motorAudio.ontimeupdate = () => {
        try {
          if (motorAudio.currentTime >= 12.0) {
            motorAudio.currentTime = 7.0;
          }
        } catch (e) {
          // ignore
        }
      };

      motorAudio.play().catch((err) => {
        console.error('Failed to play motor sound:', err);
      });
    }
  }, [stopWin]);

  const stopMotor = useCallback(() => {
    const motorAudio = motorAudioRef.current;
    if (motorAudio) {
      try {
        motorAudio.pause();
        motorAudio.ontimeupdate = null;
        motorAudio.onloadedmetadata = null;
        if (motorAudio.readyState >= 1) {
          motorAudio.currentTime = 7.0;
        }
      } catch (e) {
        console.warn('Failed to pause or reset motor audio:', e);
      }
    }
  }, []);

  const playWin = useCallback(() => {
    if (winAudioRef.current) {
      winAudioRef.current.currentTime = 0;
      winAudioRef.current.play().catch(() => {});
    }
  }, []);

  return {
    isSoundOn,
    toggleSound,
    playClick,
    playHouseClick,
    playWaypointClick,
    playDeliverSound,
    playResetSound,
    playUndoSound,
    playMotor,
    stopMotor,
    playWin,
    stopWin,
  };
}
