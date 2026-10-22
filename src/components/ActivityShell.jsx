import { stageDetails } from '../utils/game';
import { AudioStatus } from './AudioStatus';
import { SensoryStrip } from './SensoryStrip';

export const ActivityShell = ({
  round,
  roundIndex,
  totalRounds,
  feedback,
  solved,
  onNext,
  narrationState,
  children,
}) => {
  const details = stageDetails[round.type];
  const earnedStars = roundIndex + (solved ? 1 : 0);
  const progress = (earnedStars / totalRounds) * 100;

  return (
    <main className="screen game-screen">
      <div className="progress-wrap" aria-label="Game progress">
        <div className="progress-copy">
          <span>
            Activity {roundIndex + 1} of {totalRounds}
          </span>
          <span aria-label={`${earnedStars} stars earned`}>
            {earnedStars} {earnedStars === 1 ? 'star' : 'stars'} ★
          </span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax={totalRounds}
          aria-valuenow={earnedStars}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <section className="activity-card" aria-labelledby="activity-title">
        <header className="activity-heading">
          <p className="eyebrow">{details.eyebrow}</p>
          <h1 id="activity-title">{details.title}</h1>
          <p>Take your time. You can try as many times as you need.</p>
          <SensoryStrip activeModalities={round.modalities} compact />
        </header>

        <AudioStatus narrationState={narrationState} />
        <div className="game-content">{children}</div>

        <div className="feedback-area" aria-live="polite">
          {feedback && (
            <div
              className={`feedback ${solved ? 'feedback--success' : ''}`}
              data-testid="feedback"
            >
              {solved && (
                <span className="feedback-icon" aria-hidden="true">
                  ✓
                </span>
              )}
              <span>{feedback}</span>
              {solved && (
                <button
                  className="primary-button next-button"
                  type="button"
                  onClick={onNext}
                >
                  {roundIndex === totalRounds - 1 ? 'See my stars' : 'Next'}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
