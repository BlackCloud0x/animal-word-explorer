import { useRef, useState } from 'react';
import { AnimalIllustration } from '../components/AnimalIllustration';

export const SoundBlendGame = ({
  round,
  solved,
  onComplete,
  onEdit,
  onListen,
}) => {
  const startXRef = useRef(null);
  const completedRef = useRef(false);
  const [nextSound, setNextSound] = useState(0);
  const [sweepProgress, setSweepProgress] = useState(0);
  const allSoundsTapped = nextSound === round.target.phonemes.length;

  const tapSound = (index) => {
    if (solved || index !== nextSound) {
      return;
    }

    const phoneme = round.target.phonemes[index];
    onListen({ src: phoneme.audio, text: phoneme.sound });
    setNextSound(index + 1);
    onEdit();
  };

  const completeBlend = () => {
    if (completedRef.current || solved || !allSoundsTapped) {
      return;
    }

    completedRef.current = true;
    setSweepProgress(100);
    onListen({
      src: round.target.audio.word,
      text: round.target.word,
    });
    onComplete();
  };

  const beginSweep = (event) => {
    if (!allSoundsTapped || solved) {
      return;
    }

    startXRef.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    onEdit();
  };

  const continueSweep = (event) => {
    if (startXRef.current === null || solved) {
      return;
    }

    const distance = Math.max(0, event.clientX - startXRef.current);
    const nextProgress = Math.min(100, Math.round((distance / 170) * 100));
    setSweepProgress(nextProgress);

    if (nextProgress >= 90) {
      completeBlend();
    }
  };

  return (
    <div className="blend-game">
      <AnimalIllustration
        animal={round.target}
        className="blend-animal"
        labelled
      />
      <p className="blend-instruction">
        Tap each sound from left to right. Then sweep across to blend.
      </p>

      <div className="phoneme-row" aria-label="Word sounds">
        {round.target.phonemes.map((phoneme, index) => (
          <button
            className={`phoneme-tile ${
              index < nextSound ? 'phoneme-tile--done' : ''
            }`}
            type="button"
            key={`${phoneme.label}-${index}`}
            onClick={() => tapSound(index)}
            disabled={solved || index !== nextSound}
            aria-label={`Sound ${index + 1}: ${phoneme.sound}`}
          >
            {phoneme.label}
          </button>
        ))}
      </div>

      <div
        className={`blend-sweep ${allSoundsTapped ? 'blend-sweep--ready' : ''}`}
        role="slider"
        aria-label={`Blend the sounds into ${round.target.word}`}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={sweepProgress}
        aria-disabled={!allSoundsTapped || solved}
        tabIndex={allSoundsTapped && !solved ? 0 : -1}
        onPointerDown={beginSweep}
        onPointerMove={continueSweep}
        onPointerUp={() => {
          startXRef.current = null;
        }}
        onPointerCancel={() => {
          startXRef.current = null;
        }}
        onKeyDown={(event) => {
          if (['Enter', ' '].includes(event.key)) {
            event.preventDefault();
            completeBlend();
          }
        }}
      >
        <span className="blend-sweep__fill" style={{ width: `${sweepProgress}%` }} />
        <span className="blend-sweep__text">
          {allSoundsTapped ? 'Sweep →' : 'Tap every sound first'}
        </span>
      </div>

      <button
        className="text-button"
        type="button"
        onClick={completeBlend}
        disabled={!allSoundsTapped || solved}
      >
        Tap to blend instead
      </button>
    </div>
  );
};
