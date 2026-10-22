import { theme } from '../theme';

const paletteColors = {
  coral: theme.colors.coral,
  sunshine: theme.colors.sunshine,
  pink: theme.colors.pink,
  orange: theme.colors.orange,
  green: theme.colors.green,
  sky: theme.colors.sky,
  lavender: theme.colors.lavender,
};

const PointyEars = ({ color }) => (
  <>
    <path d="M68 79 79 29l36 42Z" fill={color} />
    <path d="m125 70 36-41 11 52Z" fill={color} />
    <path d="m80 62 4-18 15 24Z" fill={theme.colors.coralSoft} />
    <path d="m142 66 15-22 4 20Z" fill={theme.colors.coralSoft} />
  </>
);

const RoundEars = ({ color }) => (
  <>
    <circle cx="76" cy="73" r="24" fill={color} />
    <circle cx="164" cy="73" r="24" fill={color} />
    <circle cx="76" cy="73" r="10" fill={theme.colors.coralSoft} />
    <circle cx="164" cy="73" r="10" fill={theme.colors.coralSoft} />
  </>
);

const Face = ({ color }) => (
  <>
    <ellipse cx="120" cy="112" rx="62" ry="58" fill={color} />
    <circle cx="99" cy="104" r="6" fill={theme.colors.ink} />
    <circle cx="141" cy="104" r="6" fill={theme.colors.ink} />
    <circle cx="101" cy="102" r="2" fill={theme.colors.surface} />
    <circle cx="143" cy="102" r="2" fill={theme.colors.surface} />
  </>
);

export const AnimalIllustration = ({
  animal,
  className = '',
  labelled = false,
}) => {
  const color = paletteColors[animal.palette] ?? theme.colors.sunshine;
  const isPointy = ['cat', 'fox'].includes(animal.id);

  return (
    <svg
      className={className}
      viewBox="0 0 240 200"
      role={labelled ? 'img' : undefined}
      aria-label={labelled ? `${animal.word} illustration` : undefined}
      aria-hidden={labelled ? undefined : 'true'}
      focusable="false"
    >
      <circle cx="120" cy="105" r="91" fill={theme.colors.skySoft} />
      <ellipse
        cx="120"
        cy="180"
        rx="78"
        ry="9"
        fill={theme.colors.surfaceSoft}
      />

      {animal.id === 'lion' && (
        <circle cx="120" cy="108" r="76" fill={theme.colors.orange} />
      )}

      {isPointy && <PointyEars color={color} />}
      {['pig', 'lion'].includes(animal.id) && <RoundEars color={color} />}

      {animal.id === 'dog' && (
        <>
          <ellipse cx="71" cy="91" rx="21" ry="39" fill={color} />
          <ellipse cx="169" cy="91" rx="21" ry="39" fill={color} />
        </>
      )}

      {animal.id === 'hen' && (
        <>
          <circle cx="104" cy="52" r="15" fill={theme.colors.coral} />
          <circle cx="124" cy="44" r="16" fill={theme.colors.coral} />
          <circle cx="143" cy="53" r="14" fill={theme.colors.coral} />
        </>
      )}

      {['cow', 'goat'].includes(animal.id) && (
        <>
          <path
            d="M83 72C62 65 58 47 69 37c1 16 12 20 27 24Z"
            fill={theme.colors.sunshine}
          />
          <path
            d="M157 72c21-7 25-25 14-35-1 16-12 20-27 24Z"
            fill={theme.colors.sunshine}
          />
          <RoundEars color={color} />
        </>
      )}

      {animal.id === 'frog' && (
        <>
          <circle cx="84" cy="71" r="26" fill={color} />
          <circle cx="156" cy="71" r="26" fill={color} />
        </>
      )}

      {animal.id === 'duck' && (
        <>
          <ellipse cx="75" cy="83" rx="20" ry="29" fill={color} />
          <ellipse cx="165" cy="83" rx="20" ry="29" fill={color} />
        </>
      )}

      <Face color={color} />

      {animal.id === 'cow' && (
        <>
          <path
            d="M84 75c20-13 34-7 38 8-22 9-35 6-38-8Z"
            fill={theme.colors.surface}
          />
          <path
            d="M139 126c18-4 30 2 34 18-17 13-32 11-44-3Z"
            fill={theme.colors.surface}
          />
        </>
      )}

      {['cat', 'fox'].includes(animal.id) && (
        <>
          <path
            d="M120 117c-13 0-27 11-27 24 17 14 37 14 54 0 0-13-14-24-27-24Z"
            fill={animal.id === 'fox' ? theme.colors.surface : theme.colors.coralSoft}
          />
          <path d="m114 120 6 5 6-5Z" fill={theme.colors.ink} />
          <path
            d="M112 135c5 5 11 5 16 0M91 128l-25-6m25 15-27 2m85-11 25-6m-25 15 27 2"
            fill="none"
            stroke={theme.colors.ink}
            strokeLinecap="round"
            strokeWidth="3"
          />
        </>
      )}

      {animal.id === 'dog' && (
        <>
          <ellipse
            cx="120"
            cy="133"
            rx="29"
            ry="23"
            fill={theme.colors.surface}
          />
          <ellipse cx="120" cy="120" rx="11" ry="8" fill={theme.colors.ink} />
          <path
            d="M110 137c7 8 13 8 20 0"
            fill="none"
            stroke={theme.colors.ink}
            strokeLinecap="round"
            strokeWidth="4"
          />
        </>
      )}

      {animal.id === 'pig' && (
        <>
          <ellipse
            cx="120"
            cy="133"
            rx="29"
            ry="21"
            fill={theme.colors.coralSoft}
          />
          <circle cx="110" cy="133" r="5" fill={theme.colors.coral} />
          <circle cx="130" cy="133" r="5" fill={theme.colors.coral} />
          <path
            d="M111 151c6 4 12 4 18 0"
            fill="none"
            stroke={theme.colors.ink}
            strokeLinecap="round"
            strokeWidth="3"
          />
        </>
      )}

      {['hen', 'duck'].includes(animal.id) && (
        <>
          <path
            d="m91 125 29-15 29 15-29 17Z"
            fill={theme.colors.sunshine}
          />
          <path
            d="M105 146c9 5 21 5 30 0"
            fill="none"
            stroke={theme.colors.ink}
            strokeLinecap="round"
            strokeWidth="3"
          />
        </>
      )}

      {animal.id === 'frog' && (
        <path
          d="M91 127c17 24 41 24 58 0"
          fill="none"
          stroke={theme.colors.ink}
          strokeLinecap="round"
          strokeWidth="5"
        />
      )}

      {animal.id === 'lion' && (
        <>
          <ellipse
            cx="120"
            cy="133"
            rx="27"
            ry="21"
            fill={theme.colors.surfaceSoft}
          />
          <path d="m111 122 9 7 9-7Z" fill={theme.colors.ink} />
          <path
            d="M109 140c7 6 15 6 22 0"
            fill="none"
            stroke={theme.colors.ink}
            strokeLinecap="round"
            strokeWidth="3"
          />
        </>
      )}

      {animal.id === 'goat' && (
        <>
          <ellipse
            cx="120"
            cy="132"
            rx="26"
            ry="20"
            fill={theme.colors.surfaceSoft}
          />
          <path d="m111 122 9 6 9-6Z" fill={theme.colors.ink} />
          <path
            d="m108 151 12 28 12-28Z"
            fill={theme.colors.lavender}
          />
        </>
      )}
    </svg>
  );
};
