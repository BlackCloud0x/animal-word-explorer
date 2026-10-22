import { AnimalIllustration } from '../components/AnimalIllustration';

export const SentenceGame = ({
  round,
  selectedId,
  solved,
  onAnswer,
  onListen,
}) => {
  const choiceClass = (animal) => {
    if (solved && animal.id === round.target.id) {
      return 'animal-choice choice--correct';
    }

    if (!solved && selectedId === animal.id) {
      return 'animal-choice choice--try';
    }

    return 'animal-choice';
  };

  return (
    <div className="sentence-game">
      <div className="clue-card">
        <span>{round.target.clue}</span>
        <button
          className="listen-button"
          type="button"
          onClick={() =>
            onListen({
              src: round.target.audio.clue,
              text: round.target.speechClue,
            })
          }
          aria-label="Hear the clue"
        >
          <span aria-hidden="true">♪</span>
        </button>
      </div>

      <div className="choice-grid" aria-label="Animal choices">
        {round.choices.map((animal) => (
          <button
            className={choiceClass(animal)}
            type="button"
            key={animal.id}
            onClick={() => onAnswer(animal.id)}
            disabled={solved}
            aria-label={animal.word}
          >
            <AnimalIllustration
              animal={animal}
              className="animal-illustration"
            />
            <span>{animal.word}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
