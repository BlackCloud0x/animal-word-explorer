import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useAudio } from './useAudio';

const AudioHarness = () => {
  const { muted, narrationState, playNarration, toggleMute } = useAudio();

  return (
    <div>
      <span data-testid="status">{narrationState.status}</span>
      <button
        type="button"
        onClick={() =>
          playNarration({
            src: '/missing.wav',
            text: 'cat',
          })
        }
      >
        Play
      </button>
      <button type="button" onClick={toggleMute}>
        {muted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
};

describe('useAudio', () => {
  it('falls back to browser speech when bundled audio cannot play', async () => {
    const originalAudio = window.Audio;
    window.Audio = class FailingAudio {
      play() {
        return Promise.reject(new Error('audio unavailable'));
      }

      pause() {}
    };
    const user = userEvent.setup();
    const speakSpy = vi.spyOn(window.speechSynthesis, 'speak');

    render(<AudioHarness />);
    await user.click(screen.getByRole('button', { name: 'Play' }));

    await waitFor(() => expect(speakSpy).toHaveBeenCalledOnce());
    expect(speakSpy.mock.calls[0][0].text).toBe('cat');

    await user.click(screen.getByRole('button', { name: 'Mute' }));
    await user.click(screen.getByRole('button', { name: 'Play' }));
    expect(screen.getByTestId('status')).toHaveTextContent('muted');
    expect(speakSpy).toHaveBeenCalledOnce();

    window.Audio = originalAudio;
  });
});
