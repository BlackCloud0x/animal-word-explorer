import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { animals } from '../data/animals';
import { HandsOnGame } from './HandsOnGame';
import { ListenAndRepeatGame } from './ListenAndRepeatGame';
import { MovementGame } from './MovementGame';
import { SoundBlendGame } from './SoundBlendGame';
import { TraceLetterGame } from './TraceLetterGame';
import { WordBuilderGame } from './WordBuilderGame';

const createRound = (type, animal = animals[0]) => ({
  id: `${type}-${animal.id}`,
  type,
  target: animal,
  modalities: [],
  choices: [],
  letters: animal.word.toUpperCase().split('').map((letter, index) => ({
    id: `${letter}-${index}`,
    letter,
  })),
});

describe('multisensory activities', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('offers an ordered tap alternative for letter tracing', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();

    render(
      <TraceLetterGame
        round={createRound('trace')}
        solved={false}
        onComplete={onComplete}
        onEdit={vi.fn()}
        onListen={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Use tap mode' }));
    await user.click(screen.getByRole('button', { name: 'Tap step 1' }));
    await user.click(screen.getByRole('button', { name: 'Tap step 2' }));
    await user.click(screen.getByRole('button', { name: 'Tap step 3' }));

    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('accepts a broad pointer trace without demanding perfect handwriting', () => {
    const onComplete = vi.fn();

    render(
      <TraceLetterGame
        round={createRound('trace')}
        solved={false}
        onComplete={onComplete}
        onEdit={vi.fn()}
        onListen={vi.fn()}
      />,
    );

    const board = screen.getByRole('img', { name: 'Trace the letter C' });
    fireEvent.pointerDown(board, { clientX: 10, clientY: 20, pointerId: 1 });
    fireEvent.pointerMove(board, { clientX: 90, clientY: 70, pointerId: 1 });
    fireEvent.pointerMove(board, { clientX: 170, clientY: 130, pointerId: 1 });
    fireEvent.pointerMove(board, { clientX: 225, clientY: 190, pointerId: 1 });
    fireEvent.pointerUp(board, { pointerId: 1 });

    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('plays phonemes in order before blending the word', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const onListen = vi.fn();
    const target = animals[0];

    render(
      <SoundBlendGame
        round={createRound('blend', target)}
        solved={false}
        onComplete={onComplete}
        onEdit={vi.fn()}
        onListen={onListen}
      />,
    );

    for (let index = 0; index < target.phonemes.length; index += 1) {
      await user.click(
        screen.getByRole('button', {
          name: `Sound ${index + 1}: ${target.phonemes[index].sound}`,
        }),
      );
    }
    await user.click(
      screen.getByRole('button', { name: 'Tap to blend instead' }),
    );

    expect(onListen).toHaveBeenCalledTimes(target.phonemes.length + 1);
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('supports drag-and-drop letter building as well as tapping', () => {
    const onAttempt = vi.fn();
    const round = createRound('build');

    render(
      <WordBuilderGame
        round={round}
        solved={false}
        onAttempt={onAttempt}
        onEdit={vi.fn()}
        onListen={vi.fn()}
      />,
    );

    const slots = screen.getByLabelText('Your word');
    round.letters.forEach((tile) => {
      fireEvent.drop(slots, {
        dataTransfer: {
          getData: () => tile.id,
        },
      });
    });

    expect(onAttempt).toHaveBeenLastCalledWith(true);
  });

  it('records, plays back, and completes listen-and-repeat practice', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();

    render(
      <ListenAndRepeatGame
        round={createRound('repeat')}
        solved={false}
        onComplete={onComplete}
        onEdit={vi.fn()}
        onListen={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Record my voice' }),
    );
    await user.click(screen.getByRole('button', { name: 'Stop recording' }));

    expect(screen.getByLabelText('Play your recording')).toHaveAttribute(
      'src',
      'blob:voice-recording',
    );
    await user.click(screen.getByRole('button', { name: 'I said cat' }));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('turns common materials into a physical word-making activity', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();

    render(
      <HandsOnGame
        round={createRound('handsOn')}
        solved={false}
        onComplete={onComplete}
        onEdit={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Clay' }));
    expect(screen.getByText(/Roll clay into lines and curves/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'I made CAT' }));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('guides a seated movement, countdown, replay, and completion', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();

    render(
      <MovementGame
        round={createRound('movement')}
        solved={false}
        onComplete={onComplete}
        onSkip={vi.fn()}
        onEdit={vi.fn()}
        onListen={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Use seated choice' }));
    expect(screen.getByText(/Reach both hands up/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Get ready' }));

    for (let tick = 0; tick < 3; tick += 1) {
      act(() => {
        vi.advanceTimersByTime(700);
      });
    }

    fireEvent.click(screen.getByRole('button', { name: 'Show me again' }));
    for (let tick = 0; tick < 3; tick += 1) {
      act(() => {
        vi.advanceTimersByTime(700);
      });
    }
    fireEvent.click(screen.getByRole('button', { name: 'I did it' }));

    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('plays a dedicated roar example for the lion movement', async () => {
    const user = userEvent.setup();
    const onListen = vi.fn();
    const lion = animals.find(({ id }) => id === 'lion');

    render(
      <MovementGame
        round={createRound('movement', lion)}
        solved={false}
        onComplete={vi.fn()}
        onSkip={vi.fn()}
        onEdit={vi.fn()}
        onListen={onListen}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Hear a lion roar' }),
    );
    expect(onListen).toHaveBeenCalledWith({
      src: expect.stringContaining('/audio/examples/lion-roar.wav'),
      text: 'Rooooar!',
    });
  });
});
