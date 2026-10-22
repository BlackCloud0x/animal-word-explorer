import { useEffect, useState } from 'react';
import { AnimalIllustration } from '../components/AnimalIllustration';

export const MovementGame = ({
  round,
  solved,
  onComplete,
  onSkip,
  onEdit,
  onListen,
}) => {
  const [phase, setPhase] = useState('ready');
  const [countdown, setCountdown] = useState(3);
  const [seated, setSeated] = useState(false);
  const instruction = seated
    ? round.target.movement.seated
    : round.target.movement.prompt;

  useEffect(() => {
    if (phase !== 'countdown') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      if (countdown === 1) {
        setPhase('moving');
        return;
      }

      setCountdown((current) => current - 1);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [countdown, phase]);

  const playInstruction = () =>
    onListen({
      src: round.target.audio.movement,
      text: instruction,
    });

  const playExample = () => {
    const { exampleAudio, exampleText } = round.target.movement;

    onListen({
      src: exampleAudio ?? round.target.audio.movement,
      text: exampleText ?? instruction,
    });
  };

  const startMoving = () => {
    setCountdown(3);
    setPhase('countdown');
    playInstruction();
    onEdit();
  };

  return (
    <div className="movement-game">
      <div className={`movement-visual movement-visual--${round.target.movement.action}`}>
        <AnimalIllustration
          animal={round.target}
          className="movement-animal"
          labelled
        />
        {phase === 'countdown' && (
          <span className="movement-countdown" aria-live="assertive">
            {countdown}
          </span>
        )}
      </div>

      <p className="movement-prompt">{instruction}</p>

      <div className="movement-options">
        <button
          className="text-button"
          type="button"
          onClick={() => {
            setSeated((current) => !current);
            setPhase('ready');
            onEdit();
          }}
          disabled={solved || phase === 'countdown'}
        >
          {seated ? 'Use standing choice' : 'Use seated choice'}
        </button>
        <button
          className="listen-inline"
          type="button"
          onClick={playExample}
          disabled={solved}
        >
          <span aria-hidden="true">♪</span>{' '}
          {round.target.movement.exampleAudio
            ? 'Hear a lion roar'
            : 'Hear it again'}
        </button>
      </div>

      {phase === 'ready' && (
        <button
          className="primary-button"
          type="button"
          onClick={startMoving}
          disabled={solved}
        >
          Get ready
        </button>
      )}

      {phase === 'countdown' && (
        <p className="movement-status" aria-live="polite">
          Make a little space…
        </p>
      )}

      {phase === 'moving' && !solved && (
        <div className="movement-finish">
          <p className="movement-status">Move, say the word, then check in.</p>
          <button
            className="primary-button"
            type="button"
            onClick={onComplete}
          >
            I did it
          </button>
          <button
            className="secondary-button movement-replay"
            type="button"
            onClick={startMoving}
          >
            Show me again
          </button>
        </div>
      )}

      {!solved && (
        <button className="skip-button" type="button" onClick={onSkip}>
          Skip this movement
        </button>
      )}
    </div>
  );
};
