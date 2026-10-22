import { AnimalIllustration } from '../components/AnimalIllustration';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';

export const ListenAndRepeatGame = ({
  round,
  solved,
  onComplete,
  onEdit,
  onListen,
  compact = false,
}) => {
  const {
    audioUrl,
    error,
    resetRecording,
    startRecording,
    status,
    stopRecording,
  } = useVoiceRecorder();
  const isBusy = ['requesting', 'processing'].includes(status);

  const beginRecording = async () => {
    onEdit();
    await startRecording();
  };

  return (
    <div className={`repeat-game ${compact ? 'repeat-game--compact' : ''}`}>
      {!compact && (
        <AnimalIllustration
          animal={round.target}
          className="repeat-animal"
          labelled
        />
      )}
      <p className="repeat-word">{round.target.word}</p>
      <p className="repeat-instruction">
        {compact
          ? 'Listen, then record yourself saying the word.'
          : 'Listen carefully. Then record yourself saying the word.'}
      </p>

      <div className="repeat-actions">
        <button
          className="listen-button repeat-listen"
          type="button"
          onClick={() =>
            onListen({
              src: round.target.audio.word,
              text: round.target.word,
            })
          }
          disabled={solved || status === 'recording'}
          aria-label={`Listen to ${round.target.word}`}
        >
          <span aria-hidden="true">♪</span>
          <span>Listen</span>
        </button>

        {status !== 'recording' && status !== 'recorded' && (
          <button
            className="primary-button record-button"
            type="button"
            onClick={beginRecording}
            disabled={solved || isBusy}
          >
            <span aria-hidden="true">●</span>{' '}
            {status === 'requesting' ? 'Opening microphone…' : 'Record my voice'}
          </button>
        )}

        {status === 'recording' && (
          <button
            className="primary-button record-button record-button--active"
            type="button"
            onClick={stopRecording}
            disabled={solved}
          >
            <span className="recording-dot" aria-hidden="true" /> Stop recording
          </button>
        )}
      </div>

      {isBusy && status === 'processing' && (
        <p className="voice-status" role="status">
          Getting your voice ready…
        </p>
      )}

      {audioUrl && (
        <div className="voice-review">
          <p>Now listen to your voice.</p>
          <audio controls src={audioUrl} aria-label="Play your recording">
            Your browser cannot play this recording.
          </audio>
          <div className="voice-review__actions">
            <button
              className="secondary-button"
              type="button"
              onClick={resetRecording}
              disabled={solved}
            >
              Try again
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={onComplete}
              disabled={solved}
            >
              {compact ? 'Done practising' : `I said ${round.target.word}`}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="voice-error" role="alert">
          <p>{error}</p>
          <button
            className="secondary-button"
            type="button"
            onClick={onComplete}
            disabled={solved}
          >
            I practised aloud
          </button>
        </div>
      )}

      {!audioUrl && !error && status === 'idle' && (
        <p className="privacy-note">
          Your recording stays on this device. It is never uploaded or saved.
        </p>
      )}
    </div>
  );
};
