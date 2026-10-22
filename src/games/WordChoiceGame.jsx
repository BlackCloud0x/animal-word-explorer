import { useState } from 'react';
import { AnimalIllustration } from '../components/AnimalIllustration';
import { ListenAndRepeatGame } from './ListenAndRepeatGame';

export const WordChoiceGame = ({
  round,
  selectedId,
  solved,
  onAnswer,
  onListen,
}) => {
  const [showVoicePractice, setShowVoicePractice] = useState(false);
  const [voicePractised, setVoicePractised] = useState(false);

  const choiceClass = (animal) => {
    if (solved && animal.id === round.target.id) {
      return 'word-choice choice--correct';
    }

    if (!solved && selectedId === animal.id) {
      return 'word-choice choice--try';
    }

    return 'word-choice';
  };

  return (
    <>
      <div className="prompt-row">
        <span className="sr-only">
          Listen to the animal word, then choose the matching written word.
        </span>
        <button
          className="listen-button"
          type="button"
          onClick={() =>
            onListen({
              src: round.target.audio.word,
              text: round.target.word,
            })
          }
          aria-label={`Hear the word ${round.target.word}`}
        >
          <span aria-hidden="true">♪</span>
        </button>
      </div>
      <AnimalIllustration
        animal={round.target}
        className="target-animal"
        labelled
      />
      <div className="choice-grid" aria-label="Word choices">
        {round.choices.map((animal) => (
          <button
            className={choiceClass(animal)}
            type="button"
            key={animal.id}
            onClick={() => onAnswer(animal.id)}
            disabled={solved}
          >
            {animal.word}
          </button>
        ))}
      </div>

      {solved && (
        <div className="compact-extension">
          {!showVoicePractice && !voicePractised && (
            <button
              className="secondary-button"
              type="button"
              onClick={() => setShowVoicePractice(true)}
            >
              Try listen &amp; repeat <span>(optional)</span>
            </button>
          )}
          {showVoicePractice && !voicePractised && (
            <ListenAndRepeatGame
              round={round}
              solved={false}
              onComplete={() => {
                setVoicePractised(true);
                setShowVoicePractice(false);
              }}
              onEdit={() => undefined}
              onListen={onListen}
              compact
            />
          )}
          {voicePractised && (
            <p className="compact-extension__done" role="status">
              ✓ Voice practice complete
            </p>
          )}
        </div>
      )}
    </>
  );
};
