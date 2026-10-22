import { useCallback, useEffect, useRef, useState } from 'react';

const SOUND_PREFERENCE_KEY = 'animal-word-explorer-muted';

const readSoundPreference = () => {
  try {
    return window.localStorage.getItem(SOUND_PREFERENCE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const useAudio = () => {
  const [muted, setMuted] = useState(readSoundPreference);
  const [narrationState, setNarrationState] = useState({
    status: 'idle',
    text: '',
  });
  const audioContextRef = useRef(null);
  const narrationRef = useRef(null);

  const stopNarration = useCallback(() => {
    if (narrationRef.current) {
      narrationRef.current.pause();
      narrationRef.current.currentTime = 0;
      narrationRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speakFallback = useCallback((text) => {
    if (!('speechSynthesis' in window)) {
      setNarrationState({ status: 'error', text });
      return false;
    }

    const utterance = new window.SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices?.() ?? [];
    utterance.voice =
      voices.find((voice) => voice.name === 'Samantha') ??
      voices.find((voice) => voice.lang === 'en-US' && voice.localService) ??
      voices.find((voice) => voice.lang.startsWith('en')) ??
      null;
    utterance.lang = 'en-US';
    utterance.rate = 0.82;
    utterance.pitch = 1.08;
    utterance.volume = 1;
    utterance.onstart = () =>
      setNarrationState({ status: 'playing', text });
    utterance.onend = () => setNarrationState({ status: 'idle', text: '' });
    utterance.onerror = () =>
      setNarrationState({ status: 'error', text });
    window.speechSynthesis.speak(utterance);
    return true;
  }, []);

  const playNarration = useCallback(
    ({ src, text }) => {
      if (muted) {
        setNarrationState({ status: 'muted', text });
        return false;
      }

      stopNarration();

      if (!src) {
        return speakFallback(text);
      }

      const audio = new window.Audio(src);
      narrationRef.current = audio;
      audio.preload = 'auto';
      setNarrationState({ status: 'loading', text });
      audio.onplaying = () =>
        setNarrationState({ status: 'playing', text });
      audio.onended = () => {
        narrationRef.current = null;
        setNarrationState({ status: 'idle', text: '' });
      };

      let fallbackStarted = false;
      const fallBackToSpeech = () => {
        if (fallbackStarted) {
          return;
        }
        fallbackStarted = true;
        narrationRef.current = null;
        speakFallback(text);
      };

      audio.onerror = fallBackToSpeech;
      const playback = audio.play();
      playback?.catch(fallBackToSpeech);
      return true;
    },
    [muted, speakFallback, stopNarration],
  );

  const speak = useCallback(
    (text, src) => playNarration({ src, text }),
    [playNarration],
  );

  const tone = useCallback(
    (kind = 'success') => {
      if (muted) {
        return false;
      }

      const AudioContext = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioContext) {
        return false;
      }

      try {
        audioContextRef.current ??= new AudioContext();
        const context = audioContextRef.current;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const now = context.currentTime;

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(
          kind === 'success' ? 523.25 : 220,
          now,
        );
        if (kind === 'success') {
          oscillator.frequency.linearRampToValueAtTime(659.25, now + 0.18);
        }

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.32);
        return true;
      } catch {
        return false;
      }
    },
    [muted],
  );

  const toggleMute = useCallback(() => {
    setMuted((current) => {
      const next = !current;

      try {
        window.localStorage.setItem(SOUND_PREFERENCE_KEY, String(next));
      } catch {
        // The game still works when storage is unavailable.
      }

      if (next && 'speechSynthesis' in window) {
        stopNarration();
      }

      setNarrationState({
        status: next ? 'muted' : 'idle',
        text: '',
      });
      return next;
    });
  }, [stopNarration]);

  useEffect(
    () => () => {
      stopNarration();
      audioContextRef.current?.close();
    },
    [stopNarration],
  );

  return {
    narrationState,
    muted,
    playNarration,
    speak,
    stopNarration,
    tone,
    toggleMute,
  };
};
