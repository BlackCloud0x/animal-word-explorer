import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

Object.defineProperty(window, 'speechSynthesis', {
  configurable: true,
  value: {
    cancel: vi.fn(),
    getVoices: vi.fn(() => []),
    speak: vi.fn(),
  },
});

window.SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
  constructor(text) {
    this.text = text;
  }
};

class MockAudio {
  constructor(src) {
    this.src = src;
    this.currentTime = 0;
    this.preload = '';
  }

  play() {
    this.onplaying?.();
    return Promise.resolve();
  }

  pause() {}
}

window.Audio = MockAudio;
