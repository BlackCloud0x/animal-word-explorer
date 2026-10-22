# Animal Word Explorer

A calm, multisensory English reading game for children ages 5–7. Every compact
six-activity session combines sight, listening, speaking, hands-on making, and
guided body movement. Voice practice is folded into word recognition, while
off-screen paper, clay, sand, or letter-tile practice is folded into digital word
building.

Play the published version at
[blackcloud0x.github.io/animal-word-explorer](https://blackcloud0x.github.io/animal-word-explorer/).

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
a seated or skip option. Microphone recordings stay in browser memory, are never
uploaded, and are discarded when the activity closes. All learning content and
illustrations are original, and no account or data collection is required.
