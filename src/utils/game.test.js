import { describe, expect, it } from 'vitest';
import { animals } from '../data/animals';
import {
  createLetterTiles,
  generateSession,
  getSessionModalities,
  sessionHasAllModalities,
  shuffle,
} from './game';

describe('game helpers', () => {
  it('shuffles without changing the source array', () => {
    const source = ['a', 'b', 'c', 'd'];
    const result = shuffle(source, () => 0);

    expect(source).toEqual(['a', 'b', 'c', 'd']);
    expect(result).toHaveLength(source.length);
    expect(result).toEqual(expect.arrayContaining(source));
  });

  it('creates stable letter tile identities', () => {
    const tiles = createLetterTiles('cat', () => 0.5);

    expect(tiles.map((tile) => tile.letter).sort()).toEqual(['A', 'C', 'T']);
    expect(new Set(tiles.map((tile) => tile.id)).size).toBe(3);
  });

  it('builds a six-round progressive session', () => {
    const rounds = generateSession(animals, () => 0.42);

    expect(rounds.map((round) => round.type)).toEqual([
      'word',
      'trace',
      'blend',
      'build',
      'movement',
      'sentence',
    ]);
    expect(rounds).toHaveLength(6);
    expect(new Set(rounds.map((round) => round.target.id)).size).toBe(6);

    rounds
      .filter((round) => ['word', 'sentence'].includes(round.type))
      .forEach((round) => {
        expect(round.choices).toHaveLength(3);
        expect(round.choices).toContainEqual(round.target);
      });

    expect(getSessionModalities(rounds).sort()).toEqual([
      'listen',
      'move',
      'sight',
      'touch',
    ]);
    expect(sessionHasAllModalities(rounds)).toBe(true);
  });
});
