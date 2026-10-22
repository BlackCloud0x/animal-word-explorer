import { AnimalIllustration } from './AnimalIllustration';
import { SensoryStrip } from './SensoryStrip';

export const CompletionScreen = ({ animal, stars, onReplay, onHome }) => (
  <main className="screen">
    <section className="completion" aria-labelledby="completion-title">
      <p className="eyebrow">Trail complete</p>
      <h1 id="completion-title">Wild reading!</h1>
      <AnimalIllustration
        animal={animal}
        className="completion-art"
        labelled
      />
      <div className="star-row" aria-label={`${stars} stars earned`}>
        {Array.from({ length: stars }, (_, index) => (
          <span key={index} aria-hidden="true">
            ★
          </span>
        ))}
      </div>
      <p className="completion-copy">
        You looked, listened, touched, and moved through every word. Four ways
        to practise, one wild reading trail.
      </p>
      <SensoryStrip
        activeModalities={['sight', 'listen', 'touch', 'move']}
      />
      <div className="completion-actions">
        <button className="primary-button" type="button" onClick={onReplay}>
          Play new words
        </button>
        <button className="secondary-button" type="button" onClick={onHome}>
          Back to home
        </button>
      </div>
    </section>
  </main>
);
