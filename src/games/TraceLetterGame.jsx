import { useRef, useState } from 'react';

const letterPaths = {
  C: 'M170 57 C138 22 64 30 52 102 C40 174 119 205 169 158',
  D: 'M60 30 L60 190 M60 30 C170 30 190 80 180 116 C170 160 132 190 60 190',
  F: 'M70 30 L70 190 M70 35 L175 35 M70 105 L150 105',
  G: 'M170 60 C137 22 64 31 52 103 C41 174 119 204 174 157 L174 121 L132 121',
  H: 'M58 30 L58 190 M180 30 L180 190 M58 107 L180 107',
  L: 'M70 30 L70 185 L176 185',
  P: 'M65 190 L65 30 L124 30 C187 30 187 112 124 112 L65 112',
};

const toSvgPoint = (event, svg) => {
  const rect = svg.getBoundingClientRect();
  const width = rect.width || 240;
  const height = rect.height || 220;

  return {
    x: ((event.clientX - rect.left) / width) * 240,
    y: ((event.clientY - rect.top) / height) * 220,
  };
};

const distanceBetween = (first, second) =>
  Math.hypot(second.x - first.x, second.y - first.y);

export const TraceLetterGame = ({
  round,
  solved,
  onComplete,
  onEdit,
  onListen,
}) => {
  const svgRef = useRef(null);
  const completedRef = useRef(false);
  const distanceRef = useRef(0);
  const lastPointRef = useRef(null);
  const visitedZonesRef = useRef([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const [distance, setDistance] = useState(0);
  const [tapMode, setTapMode] = useState(false);
  const [tapStep, setTapStep] = useState(0);
  const progress = Math.min(100, Math.round((distance / 180) * 100));

  const finishIfReady = (nextDistance, nextZones) => {
    if (
      !completedRef.current &&
      nextDistance >= 150 &&
      nextZones.length >= 3
    ) {
      completedRef.current = true;
      onComplete();
    }
  };

  const beginTrace = (event) => {
    if (solved) {
      return;
    }

    event.currentTarget.setPointerCapture?.(event.pointerId);
    const point = toSvgPoint(event, svgRef.current);
    lastPointRef.current = point;
    setIsDrawing(true);
    setPoints((current) => [...current, point]);
    onEdit();
  };

  const continueTrace = (event) => {
    if (!isDrawing || solved) {
      return;
    }

    const point = toSvgPoint(event, svgRef.current);
    const previous = lastPointRef.current ?? point;
    const nextDistance = distanceRef.current + distanceBetween(previous, point);
    const zone = `${Math.floor(point.x / 80)}-${Math.floor(point.y / 74)}`;
    const nextZones = visitedZonesRef.current.includes(zone)
      ? visitedZonesRef.current
      : [...visitedZonesRef.current, zone];

    lastPointRef.current = point;
    distanceRef.current = nextDistance;
    visitedZonesRef.current = nextZones;
    setPoints((current) => [...current, point]);
    setDistance(nextDistance);
    finishIfReady(nextDistance, nextZones);
  };

  const clearTrace = () => {
    if (solved) {
      return;
    }

    completedRef.current = false;
    distanceRef.current = 0;
    lastPointRef.current = null;
    visitedZonesRef.current = [];
    setPoints([]);
    setDistance(0);
    setTapStep(0);
    onEdit();
  };

  const handleTapStep = (step) => {
    if (step !== tapStep + 1 || solved) {
      return;
    }

    const nextStep = tapStep + 1;
    setTapStep(nextStep);
    onEdit();

    if (nextStep === 3) {
      completedRef.current = true;
      onComplete();
    }
  };

  const trail = points.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <div className="trace-game">
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
          aria-label={`Hear ${round.target.firstLetter} and its sound`}
        >
          <span aria-hidden="true">♪</span>
        </button>
        <p className="trace-instruction">{round.target.trace.hint}</p>
      </div>

      {!tapMode ? (
        <>
          <svg
            ref={svgRef}
            className="trace-board"
            viewBox="0 0 240 220"
            role="img"
            aria-label={`Trace the letter ${round.target.trace.letter}`}
            onPointerDown={beginTrace}
            onPointerMove={continueTrace}
            onPointerUp={() => setIsDrawing(false)}
            onPointerCancel={() => setIsDrawing(false)}
          >
            <path
              className="trace-guide"
              d={letterPaths[round.target.trace.letter]}
            />
            {points.length > 1 && (
              <polyline className="trace-trail" points={trail} />
            )}
          </svg>
          <div className="trace-progress" aria-label={`${progress}% traced`}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="trace-actions">
            <button
              className="text-button"
              type="button"
              onClick={clearTrace}
              disabled={solved || points.length === 0}
            >
              Clear
            </button>
            <button
              className="text-button"
              type="button"
              onClick={() => {
                clearTrace();
                setTapMode(true);
              }}
              disabled={solved}
            >
              Use tap mode
            </button>
          </div>
        </>
      ) : (
        <div className="tap-trace" aria-label="Tap tracing alternative">
          <div className="tap-letter" aria-hidden="true">
            {round.target.trace.letter}
          </div>
          <p>Tap the dots in order while you say the sound.</p>
          <div className="tap-step-row">
            {[1, 2, 3].map((step) => (
              <button
                className={`tap-step ${step <= tapStep ? 'tap-step--done' : ''}`}
                type="button"
                key={step}
                onClick={() => handleTapStep(step)}
                disabled={solved || step !== tapStep + 1}
                aria-label={`Tap step ${step}`}
              >
                {step}
              </button>
            ))}
          </div>
          <button
            className="text-button"
            type="button"
            onClick={() => {
              clearTrace();
              setTapMode(false);
            }}
            disabled={solved}
          >
            Back to tracing
          </button>
        </div>
      )}
    </div>
  );
};
