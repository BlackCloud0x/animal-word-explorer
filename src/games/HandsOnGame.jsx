import { useState } from 'react';
import { AnimalIllustration } from '../components/AnimalIllustration';

const materials = [
  {
    id: 'paper',
    icon: '✎',
    label: 'Paper',
    instruction: (word) =>
      `Write ${word.toUpperCase()} in big letters. Trace each letter with your finger and say the word.`,
  },
  {
    id: 'clay',
    icon: '●',
    label: 'Clay',
    instruction: (word) =>
      `Roll clay into lines and curves. Shape the letters in ${word.toUpperCase()}, then touch and say each letter.`,
  },
  {
    id: 'sand',
    icon: '〰',
    label: 'Sand',
    instruction: (word) =>
      `Spread a little sand, salt, or flour on a tray. Draw ${word.toUpperCase()} with one finger and say the word.`,
  },
  {
    id: 'letters',
    icon: 'A',
    label: 'Letter tiles',
    instruction: (word) =>
      `Find magnetic, foam, or paper letters. Build ${word.toUpperCase()}, tap each letter, and say the word.`,
  },
];

export const HandsOnGame = ({ round, solved, onComplete, onEdit }) => {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const material = materials.find(({ id }) => id === selectedMaterial);

  const chooseMaterial = (materialId) => {
    if (solved) {
      return;
    }

    setSelectedMaterial(materialId);
    onEdit();
  };

  return (
    <div className="hands-on-game">
      <AnimalIllustration
        animal={round.target}
        className="hands-on-animal"
        labelled
      />
      <p className="hands-on-prompt">
        Choose something you have nearby and make{' '}
        <strong>{round.target.word.toUpperCase()}</strong>.
      </p>

      <div className="material-grid" aria-label="Choose a hands-on material">
        {materials.map(({ id, icon, label }) => (
          <button
            className={`material-card ${
              selectedMaterial === id ? 'material-card--selected' : ''
            }`}
            type="button"
            key={id}
            onClick={() => chooseMaterial(id)}
            disabled={solved}
            aria-pressed={selectedMaterial === id}
          >
            <span className="material-card__icon" aria-hidden="true">
              {icon}
            </span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {material && (
        <div className="hands-on-instruction" aria-live="polite">
          <p>{material.instruction(round.target.word)}</p>
          <p className="safety-note">
            Ask a grown-up for help. Keep materials out of your mouth.
          </p>
          <button
            className="primary-button"
            type="button"
            onClick={onComplete}
            disabled={solved}
          >
            I made {round.target.word.toUpperCase()}
          </button>
        </div>
      )}

      {!material && (
        <p className="material-hint">
          No special supplies are required. Paper or homemade letter cards work.
        </p>
      )}
    </div>
  );
};
