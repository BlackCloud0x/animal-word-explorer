import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
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

for (const category of [
  'words',
  'phonics',
  'clues',
  'movements',
  'sounds',
  'examples',
]) {
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

const generateLionRoar = () => {
  const sampleRate = 22050;
  const duration = 2.2;
  const sampleCount = Math.floor(sampleRate * duration);
  const samples = Buffer.alloc(sampleCount * 2);
  let phase = 0;
  let noise = 0;
  let seed = 1977;

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / sampleRate;
    const progress = time / duration;
    const attack = Math.min(1, time / 0.12);
    const release = Math.min(1, (duration - time) / 0.55);
    const envelope = attack * release * (0.82 + Math.sin(progress * Math.PI) * 0.18);
    const frequency = 92 - progress * 34 + Math.sin(time * 11) * 7;
    phase += (Math.PI * 2 * frequency) / sampleRate;

    seed = (seed * 16807) % 2147483647;
    const whiteNoise = (seed / 2147483647) * 2 - 1;
    noise += (whiteNoise - noise) * 0.065;

    const growl =
      Math.sin(phase) * 0.48 +
      Math.sin(phase * 1.97) * 0.2 +
      Math.sin(phase * 0.51) * 0.16 +
      noise * 0.72;
    const sample = Math.max(-1, Math.min(1, growl * envelope));
    samples.writeInt16LE(Math.round(sample * 32767 * 0.82), index * 2);
  }

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + samples.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(samples.length, 40);

  writeFileSync(
    join(outputRoot, 'examples', 'lion-roar.wav'),
    Buffer.concat([header, samples]),
  );
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

generateLionRoar();
rmSync(temporaryRoot, { recursive: true, force: true });
const soundCount = animals.reduce(
  (total, animal) => total + animal.phonemes.length,
  0,
);
console.log(
  `Generated ${animals.length * 4 + soundCount} narration clips and 1 sound effect.`,
);
