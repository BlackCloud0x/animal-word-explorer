export const theme = {
  colors: {
    background: '#FFF8EB',
    surface: '#FFFFFF',
    surfaceSoft: '#F2ECDD',
    ink: '#24352F',
    inkSoft: '#607068',
    forest: '#2F6B57',
    forestDark: '#234F42',
    leaf: '#75A874',
    sunshine: '#F8C85A',
    coral: '#ED806E',
    coralSoft: '#FADDD5',
    orange: '#E99252',
    pink: '#EFA9AD',
    sky: '#8CCBDD',
    skySoft: '#DDF2F5',
    green: '#7FAF69',
    lavender: '#B9A8DB',
    success: '#3D866A',
    successSoft: '#DCECDF',
    focus: '#173F35',
    shadow: 'rgba(50, 58, 47, 0.14)',
    overlay: 'rgba(255, 255, 255, 0.72)',
  },
  fonts: {
    display: '"Trebuchet MS", "Avenir Next", Avenir, sans-serif',
    body: '"Avenir Next", Avenir, "Trebuchet MS", sans-serif',
  },
  radii: {
    small: '14px',
    medium: '22px',
    large: '32px',
    pill: '999px',
  },
  shadows: {
    card: '0 18px 50px rgba(50, 58, 47, 0.14)',
    button: '0 7px 0 rgba(35, 79, 66, 0.18)',
  },
};

export const applyTheme = (root = document.documentElement) => {
  const entries = {
    ...theme.colors,
    fontDisplay: theme.fonts.display,
    fontBody: theme.fonts.body,
    radiusSmall: theme.radii.small,
    radiusMedium: theme.radii.medium,
    radiusLarge: theme.radii.large,
    radiusPill: theme.radii.pill,
    shadowCard: theme.shadows.card,
    shadowButton: theme.shadows.button,
  };

  Object.entries(entries).forEach(([key, value]) => {
    const variable = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    root.style.setProperty(`--${variable}`, value);
  });
};
