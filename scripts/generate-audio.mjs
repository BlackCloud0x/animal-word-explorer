import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { animals } from '../src/data/animals.js';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const outputRoot = join(projectRoot, 'public', 'audio');
const temporaryRoot = join(projectRoot, '.audio-temp');

const narrationFor = (animal) => ({
  words: animal.word,
  phonics: `${animal.word}. ${animal.firstLetter} says ${animal.phoneme}. ${animal.phonemes
    .map((phoneme) => phoneme.sound)
    .join(', ')}. ${animal.word}.`,
  clues: animal.speechClue,
  movements: `${animal.movement.prompt} Sitting choice. ${animal.movement.seated}`,
});

mkdirSync(temporaryRoot, { recursive: true });

for (const category of ['words', 'phonics', 'clues', 'movements', 'sounds']) {
  mkdirSync(join(outputRoot, category), { recursive: true });
}

const generateClip = (category, fileName, text) => {
  const temporaryFile = join(temporaryRoot, `${category}-${fileName}.aiff`);
  const outputFile = join(outputRoot, category, `${fileName}.wav`);

  execFileSync('say', [
    '-v',
    'Samantha',
    '-r',
    '155',
    '-o',
    temporaryFile,
    text,
  ]);
  execFileSync('afconvert', [
    temporaryFile,
    '-f',
    'WAVE',
    '-d',
    'LEI16@22050',
    outputFile,
  ]);
};

for (const animal of animals) {
  const narration = narrationFor(animal);

  for (const [category, text] of Object.entries(narration)) {
    generateClip(category, animal.id, text);
  }

  animal.phonemes.forEach((phoneme, index) => {
    generateClip('sounds', `${animal.id}-${index}`, phoneme.sound);
  });
}

rmSync(temporaryRoot, { recursive: true, force: true });
const soundCount = animals.reduce(
  (total, animal) => total + animal.phonemes.length,
  0,
);
console.log(`Generated ${animals.length * 4 + soundCount} narration clips.`);
