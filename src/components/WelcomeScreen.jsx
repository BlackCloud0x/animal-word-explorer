import { AnimalIllustration } from './AnimalIllustration';
import { SensoryStrip } from './SensoryStrip';

export const WelcomeScreen = ({ animals, onStart }) => (
  <main className="screen">
    <section className="welcome" aria-labelledby="welcome-title">
      <div className="welcome-copy">
        <p className="eyebrow">A calm reading adventure</p>
        <h1 id="welcome-title">
          Read, listen &amp; <span>roar!</span>
        </h1>
        <p className="intro">
          See it, hear it, trace it, build it, and move with it. Each animal
          word becomes a calm four-sense reading adventure.
        </p>
        <SensoryStrip
          activeModalities={['sight', 'listen', 'touch', 'move']}
        />
        <ul className="feature-list" aria-label="Game features">
          <li>6 quick activities</li>
          <li>Seated choices</li>
          <li>Ages 5–7</li>
        </ul>
        <button
          className="primary-button primary-button--wide"
          type="button"
          onClick={onStart}
        >
          Start exploring
        </button>
      </div>

      <div className="welcome-art" aria-hidden="true">
        <div className="art-card art-card--main">
          <AnimalIllustration
            animal={animals.find((animal) => animal.id === 'lion')}
            className="animal-illustration"
          />
        </div>
        <div className="art-card art-card--small">
          <AnimalIllustration
            animal={animals.find((animal) => animal.id === 'fox')}
            className="animal-illustration"
          />
        </div>
        <div className="art-badge">Words are wild!</div>
      </div>
    </section>
  </main>
);
