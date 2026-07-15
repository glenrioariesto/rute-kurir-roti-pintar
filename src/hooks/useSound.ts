import { useState, useCallback, useEffect, useRef } from 'react';

const SOUND_KEY = 'rute-kurir-sound-enabled';
const BASE_URL = import.meta.env?.BASE_URL || '/';
const BGM_SRC = `${BASE_URL}bgm-silly-fun.mp3`;
const CLICK_SRC = `${BASE_URL}click.mp3`;

function getInitialState(): boolean {
  try {
    const stored = localStorage.getItem(SOUND_KEY);
    return stored === null ? true : stored === 'true';
  } catch {
    return true;
  }
}

export function useSound() {
  const [isSoundOn, setIsSoundOn] = useState(getInitialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
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

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;

      clickAudio.pause();
      clickAudio.src = '';
      clickAudioRef.current = null;

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
    if (isSoundOn && clickAudioRef.current) {
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
  }, [isSoundOn]);

  return { isSoundOn, toggleSound, playClick };
}
