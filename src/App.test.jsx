import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';
import { animals } from './data/animals';

const completeCurrentRound = async (user) => {
  const heading = screen.getByRole('heading', { level: 1 });

  if (heading.textContent === 'Find, listen & repeat') {
    const label = screen.getByRole('img').getAttribute('aria-label');
    const word = label.replace(' illustration', '');
    await user.click(screen.getByRole('button', { name: word }));
    expect(screen.getByTestId('feedback')).toHaveTextContent(
      `That word is ${word}`,
    );
    await user.click(
      screen.getByRole('button', { name: /Try listen & repeat/i }),
    );
    await user.click(
      screen.getByRole('button', { name: 'Record my voice' }),
    );
    await user.click(screen.getByRole('button', { name: 'Stop recording' }));
    await user.click(
      screen.getByRole('button', { name: 'Done practising' }),
    );
    expect(screen.getByText('✓ Voice practice complete')).toBeInTheDocument();
    return;
  }

  if (heading.textContent === 'Trace & say') {
    await user.click(screen.getByRole('button', { name: 'Use tap mode' }));
    for (let step = 1; step <= 3; step += 1) {
      await user.click(
        screen.getByRole('button', { name: `Tap step ${step}` }),
      );
    }
    expect(screen.getByTestId('feedback')).toHaveTextContent('You traced');
    return;
  }

  if (heading.textContent === 'Tap & blend') {
    const label = screen.getByRole('img').getAttribute('aria-label');
    const word = label.replace(' illustration', '');
    const target = animals.find((animal) => animal.word === word);

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
    expect(screen.getByTestId('feedback')).toHaveTextContent('You blended');
    return;
  }

  if (heading.textContent === 'Build & make') {
    const label = screen.getByRole('img').getAttribute('aria-label');
    const word = label.replace(' illustration', '');

    for (const letter of word.toUpperCase()) {
      await user.click(
        screen.getByRole('button', { name: `Add letter ${letter}` }),
      );
    }

    expect(screen.getByTestId('feedback')).toHaveTextContent(
      `You built ${word.toUpperCase()}`,
    );
    await user.click(
      screen.getByRole('button', { name: /Try real materials/i }),
    );
    await user.click(screen.getByRole('button', { name: 'Paper' }));
    await user.click(
      screen.getByRole('button', {
        name: `I made ${word.toUpperCase()}`,
      }),
    );
    expect(
      screen.getByText('✓ Hands-on practice complete'),
    ).toBeInTheDocument();
    return;
  }

  if (heading.textContent === 'Move & say') {
    await user.click(
      screen.getByRole('button', { name: 'Skip this movement' }),
    );
    expect(screen.getByTestId('feedback')).toHaveTextContent(
      'Movement skipped',
    );
    return;
  }

  const target = animals.find((animal) =>
    screen.queryByText(animal.clue, { exact: true }),
  );
  await user.click(screen.getByRole('button', { name: target.word }));
  expect(screen.getByTestId('feedback')).toHaveTextContent('You solved it');
};

describe('Animal Word Explorer', () => {
  it('starts a game and saves the mute preference', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /read, listen/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Turn sound off' }));
    expect(
      screen.getByRole('button', { name: 'Turn sound on' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(window.localStorage.getItem('animal-word-explorer-muted')).toBe(
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Start exploring' }));
    expect(
      screen.getByRole('heading', { name: 'Find, listen & repeat' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Activity 1 of 6')).toBeInTheDocument();
  });

  it('completes all activities and starts a new session', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Start exploring' }));

    for (let round = 0; round < 6; round += 1) {
      await completeCurrentRound(user);
      expect(
        screen.getByLabelText(`${round + 1} stars earned`),
      ).toBeInTheDocument();
      const nextName = round === 5 ? 'See my stars' : 'Next';
      await user.click(screen.getByRole('button', { name: nextName }));
    }

    expect(
      screen.getByRole('heading', { name: 'Wild reading!' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('6 stars earned')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Play new words' }));
    expect(screen.getByText('Activity 1 of 6')).toBeInTheDocument();
  });
});
