import { useState } from 'react';
import { AnimalIllustration } from '../components/AnimalIllustration';

export const WordBuilderGame = ({
  round,
  solved,
  onAttempt,
  onEdit,
  onListen,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const selectedTiles = selectedIds.map((id) =>
    round.letters.find((tile) => tile.id === id),
  );

  const addLetter = (tileId) => {
    if (solved || selectedIds.includes(tileId)) {
      return;
    }

    const nextIds = [...selectedIds, tileId];
    setSelectedIds(nextIds);
    onEdit();

    if (nextIds.length === round.target.word.length) {
      const answer = nextIds
        .map((id) => round.letters.find((tile) => tile.id === id).letter)
        .join('')
        .toLowerCase();
      onAttempt(answer === round.target.word);
    }
  };

  const removeLetter = (tileId) => {
    if (solved) {
      return;
    }

    setSelectedIds((current) => current.filter((id) => id !== tileId));
    onEdit();
  };

  return (
    <div className="builder">
      <div className="prompt-row">
        <button
          className="listen-button"
          type="button"
          onClick={() =>
            onListen({
              src: round.target.audio.phonics,
              text: `${round.target.word}. ${round.target.firstLetter} says ${round.target.phoneme}.`,
            })
          }
          aria-label={`Hear ${round.target.word} and its first sound`}
        >
          <span aria-hidden="true">♪</span>
        </button>
      </div>
      <AnimalIllustration
        animal={round.target}
        className="target-animal"
        labelled
      />
      <p className="phonics-hint">
        <strong>{round.target.firstLetter}</strong> says{' '}
        <strong>/{round.target.sound}/</strong>
      </p>
      <p className="builder-instruction" id="builder-instruction">
        Tap or drag each letter into the word.
      </p>

      <div
        className="letter-slots"
        aria-label="Your word"
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';
        }}
        onDrop={(event) => {
          event.preventDefault();
          addLetter(event.dataTransfer.getData('text/plain'));
        }}
      >
        {Array.from(
          { length: round.target.word.length },
          (_, index) => selectedTiles[index],
        ).map((tile, index) =>
          tile ? (
            <button
              className="letter-slot"
              type="button"
              key={tile.id}
              onClick={() => removeLetter(tile.id)}
              aria-label={`Remove ${tile.letter} from position ${index + 1}`}
            >
              {tile.letter}
            </button>
          ) : (
            <span
              className="letter-slot"
              key={`empty-${index}`}
              aria-hidden="true"
            />
          ),
        )}
      </div>

      <div className="letter-bank" aria-label="Letter choices">
        {round.letters.map((tile) => {
          const isUsed = selectedIds.includes(tile.id);
          return (
            <button
              className={`letter-tile ${isUsed ? 'letter-tile--hidden' : ''}`}
              type="button"
              key={tile.id}
              onClick={() => addLetter(tile.id)}
              disabled={isUsed || solved}
              aria-label={`Add letter ${tile.letter}`}
              aria-describedby="builder-instruction"
              draggable={!isUsed && !solved}
              onDragStart={(event) => {
                event.dataTransfer.setData('text/plain', tile.id);
                event.dataTransfer.effectAllowed = 'move';
              }}
            >
              {tile.letter}
            </button>
          );
        })}
      </div>
    </div>
  );
};
