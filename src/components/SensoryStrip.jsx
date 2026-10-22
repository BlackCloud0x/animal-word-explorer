const modalityDetails = {
  sight: { symbol: '◉', label: 'Look' },
  listen: { symbol: '♪', label: 'Listen' },
  touch: { symbol: '✦', label: 'Touch' },
  move: { symbol: '↟', label: 'Move' },
};

export const SensoryStrip = ({ activeModalities, compact = false }) => (
  <div
    className={`sensory-strip ${compact ? 'sensory-strip--compact' : ''}`}
    aria-label={`Senses in this activity: ${activeModalities
      .map((modality) => modalityDetails[modality].label)
      .join(', ')}`}
  >
    {Object.entries(modalityDetails).map(([id, detail]) => {
      const active = activeModalities.includes(id);
      return (
        <span
          className={`sensory-chip ${active ? 'sensory-chip--active' : ''}`}
          key={id}
          aria-hidden="true"
        >
          <span>{detail.symbol}</span>
          {detail.label}
        </span>
      );
    })}
  </div>
);
