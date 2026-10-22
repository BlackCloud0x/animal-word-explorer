const statusCopy = {
  loading: 'Getting the voice ready…',
  muted: 'Sound is off. Use the sound button above to listen.',
  error: 'Voice is unavailable. The words are still here to read.',
};

export const AudioStatus = ({ narrationState }) => {
  if (narrationState.status === 'idle') {
    return null;
  }

  const message =
    narrationState.status === 'playing'
      ? `Listening: ${narrationState.text}`
      : statusCopy[narrationState.status];

  return (
    <div
      className={`audio-status audio-status--${narrationState.status}`}
      role="status"
      aria-live="polite"
    >
      <span className="audio-status__pulse" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
};
