export const Header = ({ muted, onToggleMute }) => (
  <header className="topbar">
    <div className="brand" aria-label="Animal Word Explorer">
      <span className="brand-mark" aria-hidden="true">
        <span>AW</span>
      </span>
      <span>Animal Word Explorer</span>
    </div>
    <button
      className="icon-button"
      type="button"
      onClick={onToggleMute}
      aria-pressed={muted}
      aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
    >
      <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
      <span>{muted ? 'Sound off' : 'Sound on'}</span>
    </button>
  </header>
);
