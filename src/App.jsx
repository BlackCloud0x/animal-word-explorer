import { useState } from 'react';
import { ActivityShell } from './components/ActivityShell';
import { CompletionScreen } from './components/CompletionScreen';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { animals } from './data/animals';
import { HandsOnGame } from './games/HandsOnGame';
import { ListenAndRepeatGame } from './games/ListenAndRepeatGame';
import { MovementGame } from './games/MovementGame';
import { SentenceGame } from './games/SentenceGame';
import { SoundBlendGame } from './games/SoundBlendGame';
import { TraceLetterGame } from './games/TraceLetterGame';
import { WordBuilderGame } from './games/WordBuilderGame';
import { WordChoiceGame } from './games/WordChoiceGame';
import { useAudio } from './hooks/useAudio';
import { generateSession } from './utils/game';

const getSuccessMessage = (round) => {
  if (round.type === 'build') {
    return `You built ${round.target.word.toUpperCase()}!`;
  }

  if (round.type === 'sentence') {
    return `You solved it! It is the ${round.target.word}.`;
  }

  if (round.type === 'trace') {
    return `You traced ${round.target.firstLetter} and said its sound!`;
  }

  if (round.type === 'blend') {
    return `You blended the sounds into ${round.target.word}!`;
  }

  if (round.type === 'movement') {
    return `Your whole body learned ${round.target.word}!`;
  }

  if (round.type === 'handsOn') {
    return `You made ${round.target.word.toUpperCase()} with your hands!`;
  }

  if (round.type === 'repeat') {
    return `You listened and said ${round.target.word}!`;
  }

  return `Yes! That word is ${round.target.word}.`;
};

const App = () => {
  const [screen, setScreen] = useState('welcome');
  const [rounds, setRounds] = useState(() => generateSession(animals));
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [solved, setSolved] = useState(false);
  const {
    muted,
    narrationState,
    playNarration,
    stopNarration,
    tone,
    toggleMute,
  } = useAudio();

  const round = rounds[roundIndex];

  const resetRoundState = () => {
    setSelectedId(null);
    setFeedback('');
    setSolved(false);
  };

  const startGame = () => {
    setRounds(generateSession(animals));
    setRoundIndex(0);
    resetRoundState();
    stopNarration();
    setScreen('playing');
  };

  const markCorrect = (message) => {
    setSolved(true);
    setFeedback(message ?? getSuccessMessage(round));
    tone('success');
  };

  const handleChoice = (answerId) => {
    if (solved) {
      return;
    }

    setSelectedId(answerId);

    if (answerId === round.target.id) {
      markCorrect();
      return;
    }

    setFeedback('Good try! Look closely and have another go.');
    tone('try');
  };

  const handleBuildAttempt = (isCorrect) => {
    if (isCorrect) {
      markCorrect();
      return;
    }

    setFeedback('Almost! Tap a letter above to move it back.');
    tone('try');
  };

  const handleNext = () => {
    if (roundIndex === rounds.length - 1) {
      stopNarration();
      setScreen('complete');
      return;
    }

    stopNarration();
    setRoundIndex((current) => current + 1);
    resetRoundState();
  };

  const returnHome = () => {
    resetRoundState();
    setRoundIndex(0);
    stopNarration();
    setScreen('welcome');
  };

  const game = {
    word: (
      <WordChoiceGame
        round={round}
        selectedId={selectedId}
        solved={solved}
        onAnswer={handleChoice}
        onListen={playNarration}
      />
    ),
    repeat: (
      <ListenAndRepeatGame
        key={round.id}
        round={round}
        solved={solved}
        onComplete={() => markCorrect()}
        onEdit={() => {
          if (!solved) {
            setFeedback('');
          }
        }}
        onListen={playNarration}
      />
    ),
    trace: (
      <TraceLetterGame
        key={round.id}
        round={round}
        solved={solved}
        onComplete={() => markCorrect()}
        onEdit={() => {
          if (!solved) {
            setFeedback('');
          }
        }}
        onListen={playNarration}
      />
    ),
    blend: (
      <SoundBlendGame
        key={round.id}
        round={round}
        solved={solved}
        onComplete={() => markCorrect()}
        onEdit={() => {
          if (!solved) {
            setFeedback('');
          }
        }}
        onListen={playNarration}
      />
    ),
    build: (
      <WordBuilderGame
        key={round.id}
        round={round}
        solved={solved}
        onAttempt={handleBuildAttempt}
        onEdit={() => {
          if (!solved) {
            setFeedback('');
          }
        }}
        onListen={playNarration}
      />
    ),
    movement: (
      <MovementGame
        key={round.id}
        round={round}
        solved={solved}
        onComplete={() => markCorrect()}
        onSkip={() =>
          markCorrect('Movement skipped. You kept your learning trail going!')
        }
        onEdit={() => {
          if (!solved) {
            setFeedback('');
          }
        }}
        onListen={playNarration}
      />
    ),
    handsOn: (
      <HandsOnGame
        key={round.id}
        round={round}
        solved={solved}
        onComplete={() => markCorrect()}
        onEdit={() => {
          if (!solved) {
            setFeedback('');
          }
        }}
      />
    ),
    sentence: (
      <SentenceGame
        round={round}
        selectedId={selectedId}
        solved={solved}
        onAnswer={handleChoice}
        onListen={playNarration}
      />
    ),
  };

  return (
    <div className="app-shell">
      <Header muted={muted} onToggleMute={toggleMute} />

      {screen === 'welcome' && (
        <WelcomeScreen animals={animals} onStart={startGame} />
      )}

      {screen === 'playing' && (
        <ActivityShell
          round={round}
          roundIndex={roundIndex}
          totalRounds={rounds.length}
          feedback={feedback}
          solved={solved}
          onNext={handleNext}
          narrationState={narrationState}
        >
          {game[round.type]}
        </ActivityShell>
      )}

      {screen === 'complete' && (
        <CompletionScreen
          animal={animals.find((animal) => animal.id === 'lion')}
          stars={rounds.length}
          onReplay={startGame}
          onHome={returnHome}
        />
      )}
    </div>
  );
};

export default App;
