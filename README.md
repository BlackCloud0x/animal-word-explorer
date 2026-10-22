# Animal Word Explorer

A calm, multisensory English reading game for children ages 5–7. Every
six-activity session combines sight, listening, touch, and guided body movement
through word recognition, tracing, phoneme blending, letter building, movement,
and reading clues.

## Run locally

```bash
npm install
npm run dev
```

Narration is bundled for reliable offline playback. To regenerate the voice
clips on macOS:

```bash
npm run audio:generate
```

## Quality checks

```bash
npm run lint
npm test
npm run build
```

The app uses bundled narration with browser speech synthesis as a fallback, plus
Web Audio feedback tones. Movement is guided without a camera and always offers
a seated or skip option. All learning content and illustrations are original,
and no account or data collection is required.
