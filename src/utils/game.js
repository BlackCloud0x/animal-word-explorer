export const shuffle = (items, random = Math.random) => {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
};

const createChoices = (target, animalList, random) => {
  const distractors = shuffle(
    animalList.filter((animal) => animal.id !== target.id),
    random,
  ).slice(0, 2);

  return shuffle([target, ...distractors], random);
};

export const createLetterTiles = (word, random = Math.random) =>
  shuffle(
    word.toUpperCase().split('').map((letter, index) => ({
      id: `${letter}-${index}`,
      letter,
    })),
    random,
  );

export const sensoryModalities = ['sight', 'listen', 'touch', 'move'];

export const activityDetails = {
  word: {
    eyebrow: 'Eyes & ears',
    title: 'Find the word',
    modalities: ['sight', 'listen', 'touch'],
  },
  trace: {
    eyebrow: 'Finger writing',
    title: 'Trace & say',
    modalities: ['sight', 'listen', 'touch'],
  },
  blend: {
    eyebrow: 'Sound steps',
    title: 'Tap & blend',
    modalities: ['sight', 'listen', 'touch'],
  },
  build: {
    eyebrow: 'Letters in action',
    title: 'Build the word',
    modalities: ['sight', 'listen', 'touch'],
  },
  movement: {
    eyebrow: 'Whole body word',
    title: 'Move & say',
    modalities: ['sight', 'listen', 'move'],
  },
  sentence: {
    eyebrow: 'Reading detective',
    title: 'Read the clue',
    modalities: ['sight', 'listen', 'touch'],
  },
};

export const generateSession = (animalList, random = Math.random) => {
  const targets = shuffle(animalList, random).slice(0, 6);
  const types = ['word', 'trace', 'blend', 'build', 'movement', 'sentence'];

  return targets.map((target, index) => ({
    id: `${types[index]}-${target.id}`,
    type: types[index],
    target,
    modalities: activityDetails[types[index]].modalities,
    choices:
      !['word', 'sentence'].includes(types[index])
        ? []
        : createChoices(target, animalList, random),
    letters:
      types[index] === 'build'
        ? createLetterTiles(target.word, random)
        : [],
  }));
};

export const getSessionModalities = (rounds) => [
  ...new Set(rounds.flatMap((round) => round.modalities)),
];

export const sessionHasAllModalities = (rounds) =>
  sensoryModalities.every((modality) =>
    getSessionModalities(rounds).includes(modality),
  );

export const stageDetails = activityDetails;
