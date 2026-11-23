import React, { useId } from 'react';
import {
  AvatarConfig,
  AvatarItem,
  AvatarSlot,
  BACKDROPS,
  EYE_COLORS,
  HAIR_COLORS,
  SHIRT_COLORS,
  SKIN_TONES,
  optionColor,
} from '@/lib/avatar';

/**
 * Layered 2D avatar drawn as a human, athletic bust: shaped skull and jaw,
 * almond eyes with lids, nose with nostrils, full lips, neck muscles,
 * collarbones and lean athletic shoulders. Look colors and gear colors are artwork
 * data (skin tones, team colors), so they come straight from the avatar
 * palettes and item metadata rather than from the site theme.
 */
interface AvatarFigureProps {
  config: AvatarConfig;
  items?: Partial<Record<AvatarSlot, AvatarItem>>;
  /** "head" frames the face for small bubbles (comments, header). */
  crop?: 'full' | 'head';
  className?: string;
  title?: string;
}

// ---- Anatomy (200 x 200 canvas, face centred on x = 100) ----
const HEAD =
  'M100 42 C121 42 135 56 136 80 C136.5 90 135 98 132.5 105 L124.5 119.5 C119 127 110 132 100 132.4 C90 132 81 127 75.5 119.5 L67.5 105 C65 98 63.5 90 64 80 C65 56 79 42 100 42 Z';
const NECK = 'M88 112 C89 126 88 138 84 150 L116 150 C112 138 111 126 112 112 Z';
const BODY =
  'M84 143 C77 147 65 149 54 154 C41 160 34 176 32 200 L168 200 C166 176 159 160 146 154 C135 149 123 147 116 143 Z';
const EAR = 'M65 85 C58 81 53.5 87 55.5 95 C57 103 61 108.5 66.5 106 Z';
const EAR_INNER = 'M63 89.5 C59.5 88.5 58.5 93 60 98.5 C61 101 62.5 102 63.5 101';

// ---- Clothing ----
const TEE =
  'M84 144 C76 148 64 149 53 154 C40 160 33 176 31 200 L169 200 C167 176 160 160 147 154 C136 149 124 148 116 144 C110 154 90 154 84 144 Z';
const JERSEY =
  'M84 145 L72 149 C73 166 68 180 56 188 L55 200 L145 200 L144 188 C132 180 127 166 128 149 L116 145 C112 159 88 159 84 145 Z';

export const AvatarFigure: React.FC<AvatarFigureProps> = ({ config, items = {}, crop = 'full', className, title }) => {
  const uid = useId().replace(/:/g, '');
  const skin = optionColor(SKIN_TONES, config.skin);
  const hair = optionColor(HAIR_COLORS, config.hairColor);
  const eye = optionColor(EYE_COLORS, config.eyes);
  const shirt = optionColor(SHIRT_COLORS, config.shirtColor);
  const backdrop = BACKDROPS.find((b) => b.id === config.backdrop) ?? BACKDROPS[0];

  const tone: SkinTone = {
    base: skin,
    light: shift(skin, 24),
    shadow: shift(skin, -26),
    deep: shift(skin, -58),
    lip: shift(mix(skin, '#A8443F', 0.42), -14),
    blush: mix(skin, '#E2574C', 0.5),
  };

  const top = items.top?.metadata;
  const gloves = items.gloves?.metadata;
  const headwear = items.headwear?.metadata;
  const accessory = items.accessory?.metadata;
  const bgItem = items.background?.metadata;
  const id = (name: string) => `${name}-${uid}`;
  const url = (name: string) => `url(#${id(name)})`;

  const viewBox = crop === 'head' ? '44 30 112 112' : '0 0 200 200';
  const hairDark = shift(hair, -45);

  return (
    <svg viewBox={viewBox} className={className} role="img" aria-label={title ?? 'Avatar'} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id('bg')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={bgItem?.primary ? lighten(bgItem.primary) : backdrop.from} />
          <stop offset="1" stopColor={bgItem?.primary ?? backdrop.to} />
        </linearGradient>
        <radialGradient id={id('spot')} cx="0.5" cy="0.4" r="0.5">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        {/* Rounded volume on the skull and face: light from upper left. */}
        <radialGradient id={id('head')} cx="0.42" cy="0.36" r="0.68">
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.26" />
        </radialGradient>
        <linearGradient id={id('neck')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.38" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        {/* Side-to-side volume for chest, shoulders and clothing. */}
        <linearGradient id={id('round')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.3" />
          <stop offset="0.22" stopColor="#000" stopOpacity="0.04" />
          <stop offset="0.45" stopColor="#FFF" stopOpacity="0.1" />
          <stop offset="0.75" stopColor="#000" stopOpacity="0.04" />
          <stop offset="1" stopColor="#000" stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id={id('sheen')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF" stopOpacity="0.22" />
          <stop offset="0.45" stopColor="#FFF" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id={id('blush')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={tone.blush} stopOpacity="0.4" />
          <stop offset="1" stopColor={tone.blush} stopOpacity="0" />
        </radialGradient>
        <pattern id={id('coil')} width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M0.8 3.2 a1.6 1.6 0 1 1 3.2 0" stroke={hairDark} strokeWidth="0.8" fill="none" />
          <path d="M2.6 0.9 a1 1 0 1 1 2 0" stroke={lighten(hair)} strokeOpacity="0.35" strokeWidth="0.5" fill="none" />
        </pattern>
        <pattern id={id('stipple')} width="2.4" height="2.4" patternUnits="userSpaceOnUse">
          <circle cx="0.6" cy="0.6" r="0.45" fill={hairDark} />
          <circle cx="1.8" cy="1.7" r="0.4" fill={hairDark} />
        </pattern>
        <clipPath id={id('eyeL')}>
          <path d={eyePath(86, 1)} />
        </clipPath>
        <clipPath id={id('eyeR')}>
          <path d={eyePath(114, -1)} />
        </clipPath>
      </defs>

      {/* Backdrop */}
      <rect x="0" y="0" width="200" height="200" fill={url('bg')} />
      {bgItem?.style === 'arena' && <ArenaLights trim={bgItem.trim ?? '#F2C14E'} />}
      {bgItem?.style === 'ring' && <RingRopes trim={bgItem.trim ?? '#D7263D'} />}
      {!bgItem && backdrop.id === 'court' && (
        <g opacity="0.18" stroke="#000" strokeWidth="1">
          {[20, 50, 80, 110, 140, 170].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="200" />
          ))}
        </g>
      )}
      <rect x="0" y="0" width="200" height="200" fill={url('spot')} />

      {/* Hair behind the head */}
      <BackHair style={config.hair} color={hair} coil={url('coil')} sheen={url('sheen')} />

      {/* Shoulders, chest, neck */}
      <Body tone={tone} round={url('round')} neckShade={url('neck')} />

      {top ? (
        <Top meta={top} round={url('round')} />
      ) : (
        <Top meta={{ style: 'tee', primary: shirt, trim: darken(shirt) }} round={url('round')} />
      )}

      {/* Long hair falls forward over the shoulders */}
      {config.hair === 'long' && <LongLocks color={hair} sheen={url('sheen')} />}

      {/* Ears and head */}
      <Ear tone={tone} />
      <g transform="translate(200 0) scale(-1 1)">
        <Ear tone={tone} />
      </g>
      <path d={HEAD} fill={skin} />
      <Contours tone={tone} blush={url('blush')} />
      <path d={HEAD} fill={url('head')} />

      <Face expression={config.expression} eye={eye} tone={tone} brow={mix(hair, '#1B1B1F', 0.4)} clipL={url('eyeL')} clipR={url('eyeR')} />

      {/* Hair in front */}
      <FrontHair
        style={config.hair}
        color={hair}
        dark={hairDark}
        coil={url('coil')}
        stipple={url('stipple')}
        sheen={url('sheen')}
        tone={tone}
      />

      {headwear && <Headwear meta={headwear} sheen={url('sheen')} />}
      {accessory && <Accessory meta={accessory} />}
      {gloves && <Gloves meta={gloves} tone={tone} sheen={url('sheen')} />}
    </svg>
  );
};

interface SkinTone {
  base: string;
  light: string;
  shadow: string;
  deep: string;
  lip: string;
  blush: string;
}

const Body: React.FC<{ tone: SkinTone; round: string; neckShade: string }> = ({ tone, round, neckShade }) => (
  <g>
    <path d={BODY} fill={tone.base} />
    <path d={BODY} fill={round} />
    {/* Deltoids and the line between arm and chest (seen with sleeveless tops) */}
    <g stroke={tone.deep} strokeOpacity="0.4" strokeWidth="1.4" fill="none" strokeLinecap="round">
      <path d="M55 156 C62 161 67 172 68 186" />
      <path d="M145 156 C138 161 133 172 132 186" />
      <path d="M58 184 C56 190 56 195 57 200" />
      <path d="M142 184 C144 190 144 195 143 200" />
    </g>
    <g fill="#FFF" opacity="0.07">
      <ellipse cx="51" cy="165" rx="7" ry="4.5" transform="rotate(-35 51 165)" />
      <ellipse cx="149" cy="165" rx="7" ry="4.5" transform="rotate(35 149 165)" />
    </g>
    {/* Neck with jaw shadow and the two neck muscles */}
    <path d={NECK} fill={tone.base} />
    <path d={NECK} fill={neckShade} />
    <g stroke={tone.deep} strokeOpacity="0.28" strokeWidth="1.3" fill="none" strokeLinecap="round">
      <path d="M91 122 C93 134 96 142 98 149" />
      <path d="M109 122 C107 134 104 142 102 149" />
    </g>
    <ellipse cx="100" cy="146" rx="3.4" ry="2.4" fill={tone.deep} opacity="0.22" />
    {/* Collarbones */}
    <g fill="none" strokeLinecap="round">
      <path d="M96 151.5 C88 149.5 79 149 70 152" stroke={tone.deep} strokeOpacity="0.45" strokeWidth="1.5" />
      <path d="M104 151.5 C112 149.5 121 149 130 152" stroke={tone.deep} strokeOpacity="0.45" strokeWidth="1.5" />
      <path d="M95 149.5 C88 147.5 80 147 72 149.5" stroke={tone.light} strokeOpacity="0.5" strokeWidth="1" />
      <path d="M105 149.5 C112 147.5 120 147 128 149.5" stroke={tone.light} strokeOpacity="0.5" strokeWidth="1" />
    </g>
  </g>
);

const Ear: React.FC<{ tone: SkinTone }> = ({ tone }) => (
  <g>
    <path d={EAR} fill={tone.base} />
    <path d={EAR} fill="#000" opacity="0.08" />
    <path d={EAR_INNER} stroke={tone.deep} strokeOpacity="0.55" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    <ellipse cx="61.5" cy="96" rx="1.8" ry="2.6" fill={tone.deep} opacity="0.3" />
  </g>
);

/** Cheekbones, temples, forehead and chin light so the face reads as 3D. */
const Contours: React.FC<{ tone: SkinTone; blush: string }> = ({ tone, blush }) => (
  <g>
    <ellipse cx="100" cy="64" rx="18" ry="9" fill="#FFF" opacity="0.1" />
    <ellipse cx="80" cy="106" rx="7" ry="4" fill={blush} />
    <ellipse cx="120" cy="106" rx="7" ry="4" fill={blush} />
    <ellipse cx="80" cy="102" rx="7" ry="2.6" fill="#FFF" opacity="0.13" transform="rotate(-12 80 102)" />
    <ellipse cx="120" cy="102" rx="7" ry="2.6" fill="#FFF" opacity="0.13" transform="rotate(12 120 102)" />
    {/* Jaw contour */}
    <path d="M69 106 L76.5 119 C81 125.5 88 129.5 95 131" stroke={tone.deep} strokeOpacity="0.22" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M131 106 L123.5 119 C119 125.5 112 129.5 105 131" stroke={tone.deep} strokeOpacity="0.22" strokeWidth="2" fill="none" strokeLinecap="round" />
    <ellipse cx="100" cy="127.5" rx="5" ry="2.4" fill="#FFF" opacity="0.13" />
    {/* Hollow under the cheekbones for a lean face */}
    <path d="M74 104 C77 111 81 116 86 119" stroke={tone.deep} strokeOpacity="0.14" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M126 104 C123 111 119 116 114 119" stroke={tone.deep} strokeOpacity="0.14" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M94 129.5 C97 131 103 131 106 129.5" stroke={tone.deep} strokeOpacity="0.18" strokeWidth="1" fill="none" />
  </g>
);

function eyePath(cx: number, s: 1 | -1) {
  return `M${cx - 9 * s} 94.5 C${cx - 6 * s} 89.5 ${cx + 5 * s} 88.6 ${cx + 9 * s} 93.6 C${cx + 5 * s} 97.6 ${cx - 5 * s} 98.2 ${cx - 9 * s} 94.5 Z`;
}

function browPath(s: 1 | -1, inner: number, outer: number) {
  const x = (d: number) => 100 - d * s;
  return `M${x(25)} ${86.4 + outer} C${x(20)} ${81.6 + outer} ${x(12)} ${80.6 + inner} ${x(5)} ${83 + inner} L${x(5)} ${86 + inner} C${x(12)} ${84.4 + inner} ${x(19)} ${84.4 + outer} ${x(25)} ${86.4 + outer} Z`;
}

const Eye: React.FC<{ cx: number; s: 1 | -1; iris: string; tone: SkinTone; clip: string; lid: number; squint: boolean }> = ({
  cx,
  s,
  iris,
  tone,
  clip,
  lid,
  squint,
}) => {
  const lash = `M${cx - 9 * s} 94.5 C${cx - 6 * s} 89.5 ${cx + 5 * s} 88.6 ${cx + 9 * s} 93.6`;
  return (
    <g>
      {/* Socket shadow and lid crease */}
      <ellipse cx={cx} cy="91" rx="12" ry="6" fill={tone.deep} opacity="0.12" />
      <path
        d={`M${cx - 8 * s} 90 C${cx - 4 * s} 86.6 ${cx + 4 * s} 86.4 ${cx + 8.5 * s} 89.6`}
        stroke={tone.deep}
        strokeOpacity="0.45"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      <path d={eyePath(cx, s)} fill="#F7F2EC" />
      <g clipPath={clip}>
        <circle cx={cx + 0.3 * s} cy="93.6" r="3.9" fill={iris} />
        <circle cx={cx + 0.3 * s} cy="93.6" r="3.9" fill="none" stroke="#000" strokeOpacity="0.45" strokeWidth="0.7" />
        <circle cx={cx + 0.3 * s} cy="94.4" r="2.2" fill={lighten(iris)} opacity="0.35" />
        <circle cx={cx + 0.3 * s} cy="93.6" r="1.8" fill="#0D0B0A" />
        <circle cx={cx + 1.5} cy="92.3" r="1.05" fill="#FFF" />
        <circle cx={cx - 1.1} cy="95" r="0.45" fill="#FFF" opacity="0.8" />
        {/* Upper lid shadow on the eyeball */}
        <rect x={cx - 10} y="86" width="20" height="4.6" fill="#000" opacity="0.12" />
        {lid > 0 && <rect x={cx - 10} y="86" width="20" height={3 + lid} fill={tone.base} />}
        {squint && <rect x={cx - 10} y="96" width="20" height="4" fill={tone.base} />}
      </g>
      {lid > 0 ? (
        <path
          d={`M${cx - 9 * s} ${94.5} C${cx - 5 * s} ${89 + lid} ${cx + 5 * s} ${89 + lid} ${cx + 9 * s} 93.6`}
          stroke="#22160F"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <path d={lash} stroke="#22160F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      )}
      <path d={`M${cx - 9 * s} 94.5 L${cx - 11 * s} 93`} stroke="#22160F" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d={`M${cx - 8 * s} 95.6 C${cx - 4 * s} ${squint ? 96.6 : 98.2} ${cx + 4 * s} ${squint ? 96.4 : 97.8} ${cx + 8.5 * s} 94.4`}
        stroke={tone.deep}
        strokeOpacity="0.4"
        strokeWidth="0.9"
        fill="none"
      />
    </g>
  );
};

const Face: React.FC<{ expression: string; eye: string; tone: SkinTone; brow: string; clipL: string; clipR: string }> = ({
  expression,
  eye,
  tone,
  brow,
  clipL,
  clipR,
}) => {
  const focused = expression === 'focused';
  const chill = expression === 'chill';
  const grin = expression === 'grin';
  const browInner = focused ? 2.6 : grin ? -1.2 : 0;
  const browOuter = focused ? -1 : grin ? -0.8 : chill ? 0.6 : 0;
  const lid = chill ? 3.4 : focused ? 1.6 : 0;
  const lipDark = shift(tone.lip, -55);
  return (
    <g>
      {/* Brows */}
      <path d={browPath(1, browInner, browOuter)} fill={brow} />
      <path d={browPath(-1, browInner, chill ? browOuter - 1.2 : browOuter)} fill={brow} />
      {focused && (
        <path d="M97 84 L97.5 88 M103 84 L102.5 88" stroke={tone.deep} strokeOpacity="0.35" strokeWidth="0.9" strokeLinecap="round" />
      )}

      <Eye cx={86} s={1} iris={eye} tone={tone} clip={clipL} lid={lid} squint={grin} />
      <Eye cx={114} s={-1} iris={eye} tone={tone} clip={clipR} lid={lid} squint={grin} />

      {/* Nose: bridge, tip, wings and nostrils */}
      <path d="M95.5 92 C94.5 99 94 104 92.6 107.5" stroke={tone.deep} strokeOpacity="0.32" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M104.5 95 C105 100 105.6 104 106.4 107" stroke={tone.light} strokeOpacity="0.5" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <ellipse cx="100" cy="108.6" rx="3" ry="2.4" fill="#FFF" opacity="0.18" />
      <g stroke={tone.deep} strokeOpacity="0.75" strokeWidth="1.3" fill="none" strokeLinecap="round">
        <path d="M93 107.5 C90.6 110.5 92.6 113.6 96 112.6" />
        <path d="M107 107.5 C109.4 110.5 107.4 113.6 104 112.6" />
      </g>
      <ellipse cx="96.8" cy="112.4" rx="1.7" ry="0.95" fill={tone.deep} opacity="0.85" />
      <ellipse cx="103.2" cy="112.4" rx="1.7" ry="0.95" fill={tone.deep} opacity="0.85" />
      <path d="M95.5 114.4 Q100 116 104.5 114.4" stroke={tone.shadow} strokeOpacity="0.6" strokeWidth="1.2" fill="none" />
      {/* Philtrum */}
      <path d="M98.4 115.4 L98.7 118 M101.6 115.4 L101.3 118" stroke={tone.deep} strokeOpacity="0.18" strokeWidth="0.9" />

      {grin && (
        <g>
          <path d="M88 108 C84.5 113 84.5 117.5 86.5 121" stroke={tone.deep} strokeOpacity="0.35" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M112 108 C115.5 113 115.5 117.5 113.5 121" stroke={tone.deep} strokeOpacity="0.35" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M87 118.4 C93 121.4 107 121.4 113 118.4 C110 127.6 90 127.6 87 118.4 Z" fill="#3B1513" />
          <path d="M89.6 119.4 C95 121.6 105 121.6 110.4 119.4 L109.6 122.3 C104 123.6 96 123.6 90.4 122.3 Z" fill="#F5F0E8" />
          <path d="M100 120.8 L100 123 M95.5 120.6 L95.7 122.9 M104.5 120.6 L104.3 122.9" stroke="#D8CFC3" strokeWidth="0.5" />
          <ellipse cx="100" cy="125.2" rx="6" ry="1.6" fill="#B34E55" opacity="0.7" />
          <path d="M86.4 118.4 C92 115.8 97 115.6 100 116.8 C103 115.6 108 115.8 113.6 118.4 C107 120 93 120 86.4 118.4 Z" fill={tone.lip} />
          <path d="M88.6 122.4 C92.6 128 107.4 128 111.4 122.4 C108.6 129.8 91.4 129.8 88.6 122.4 Z" fill={tone.lip} />
          <ellipse cx="100" cy="127.6" rx="3.6" ry="0.9" fill="#FFF" opacity="0.22" />
        </g>
      )}
      {expression === 'smile' && (
        <g>
          <path d="M89 119.4 C93 117.8 97 117.4 100 118.6 C103 117.4 107 117.8 111 119.4 C107 120.6 93 120.6 89 119.4 Z" fill={tone.lip} />
          <path d="M90.4 120.4 C94 125.6 106 125.6 109.6 120.4 C106 122 94 122 90.4 120.4 Z" fill={tone.lip} />
          <path d="M87.8 118.2 C93 121.6 107 121.6 112.2 118.2" stroke={lipDark} strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <path d="M87 117.4 Q86.2 119 87.4 120.4 M113 117.4 Q113.8 119 112.6 120.4" stroke={tone.deep} strokeOpacity="0.4" strokeWidth="0.9" fill="none" strokeLinecap="round" />
          <ellipse cx="100" cy="123" rx="3.4" ry="0.9" fill="#FFF" opacity="0.24" />
        </g>
      )}
      {focused && (
        <g>
          <path d="M90 120.2 C94 119 97 118.8 100 119.5 C103 118.8 106 119 110 120.2 C106 120.8 94 120.8 90 120.2 Z" fill={tone.lip} />
          <path d="M91 120.8 C95 124 105 124 109 120.8 C105 121.6 95 121.6 91 120.8 Z" fill={tone.lip} />
          <path d="M89.2 120.4 C95 121 105 121 110.8 120.4" stroke={lipDark} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <ellipse cx="100" cy="122.6" rx="3" ry="0.7" fill="#FFF" opacity="0.2" />
        </g>
      )}
      {chill && (
        <g>
          <path d="M89.5 120.6 C93.5 119.4 97 118.8 100 119.6 C103 118.6 107 117.8 111.5 118 C107 120.4 94 121.4 89.5 120.6 Z" fill={tone.lip} />
          <path d="M91 121.2 C95 125 105.5 124.6 110 119.6 C106 121.6 95 122 91 121.2 Z" fill={tone.lip} />
          <path d="M89 120.8 C95 121.8 104 121.2 112 117.6" stroke={lipDark} strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <path d="M112.6 116.6 Q113.6 118 112.8 119.6" stroke={tone.deep} strokeOpacity="0.4" strokeWidth="0.9" fill="none" strokeLinecap="round" />
          <ellipse cx="100.5" cy="122.6" rx="3" ry="0.8" fill="#FFF" opacity="0.22" />
        </g>
      )}
    </g>
  );
};

/** Bumpy outline for an afro or bun, so it reads as hair, not a ball. */
function scallop(cx: number, cy: number, r: number, bumps: number, depth: number) {
  const pt = (a: number, rad: number) => `${(cx + Math.cos(a) * rad).toFixed(1)} ${(cy + Math.sin(a) * rad).toFixed(1)}`;
  const step = (Math.PI * 2) / bumps;
  let d = `M${pt(0, r)}`;
  for (let i = 0; i < bumps; i += 1) {
    d += ` Q${pt(step * (i + 0.5), r + depth)} ${pt(step * (i + 1), r)}`;
  }
  return `${d} Z`;
}

const HairLayer: React.FC<{ d: string; color: string; texture?: string; textureOpacity?: number; sheen: string; opacity?: number }> = ({
  d,
  color,
  texture,
  textureOpacity = 0.7,
  sheen,
  opacity = 1,
}) => (
  <g opacity={opacity}>
    <path d={d} fill={color} />
    {texture && <path d={d} fill={texture} opacity={textureOpacity} />}
    <path d={d} fill={sheen} />
  </g>
);

const BackHair: React.FC<{ style: string; color: string; coil: string; sheen: string }> = ({ style, color, coil, sheen }) => {
  if (style === 'afro') return <HairLayer d={scallop(100, 74, 49, 22, 4)} color={color} texture={coil} sheen={sheen} />;
  if (style === 'long') {
    return (
      <HairLayer
        d="M61 88 C54 38 146 38 139 88 C141 112 144 132 148 150 C134 156 124 152 118 146 L82 146 C76 152 66 156 52 150 C56 132 59 112 61 88 Z"
        color={color}
        sheen={sheen}
      />
    );
  }
  if (style === 'bun') {
    return (
      <g>
        <HairLayer d={scallop(100, 36, 14, 12, 1.6)} color={color} sheen={sheen} />
        <g stroke={shift(color, -45)} strokeWidth="1" fill="none" opacity="0.7">
          <path d="M92 34 C96 28 106 28 108 35" />
          <path d="M93 40 C98 44 105 43 108 38" />
          <path d="M96 35 C99 32 103 33 104 36" />
        </g>
      </g>
    );
  }
  return null;
};

const LongLocks: React.FC<{ color: string; sheen: string }> = ({ color, sheen }) => (
  <g>
    <HairLayer d="M64 96 C62 120 64 142 72 164 C77 162 80 157 80 150 C76 134 73 116 71 100 Z" color={color} sheen={sheen} />
    <HairLayer d="M136 96 C138 120 136 142 128 164 C123 162 120 157 120 150 C124 134 127 116 129 100 Z" color={color} sheen={sheen} />
    <g stroke={shift(color, -45)} strokeWidth="0.9" fill="none" opacity="0.6">
      <path d="M68 108 C68 126 70 144 74 158" />
      <path d="M132 108 C132 126 130 144 126 158" />
    </g>
  </g>
);

const FrontHair: React.FC<{
  style: string;
  color: string;
  dark: string;
  coil: string;
  stipple: string;
  sheen: string;
  tone: SkinTone;
}> = ({ style, color, dark, coil, stipple, sheen, tone }) => {
  const strands = (paths: string[], light = false) => (
    <g stroke={light ? lighten(color) : dark} strokeOpacity={light ? 0.35 : 0.7} strokeWidth="1" fill="none" strokeLinecap="round">
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
  switch (style) {
    case 'bald':
      return (
        <g>
          <ellipse cx="88" cy="56" rx="12" ry="6" fill="#FFF" opacity="0.2" transform="rotate(-20 88 56)" />
          <path d="M64 84 C63 74 66 66 70 62" stroke={tone.deep} strokeOpacity="0.15" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M136 84 C137 74 134 66 130 62" stroke={tone.deep} strokeOpacity="0.15" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'buzz':
      return (
        <g>
          <HairLayer
            d="M63 85 C62 56 78 42 100 42 C122 42 138 56 137 85 C135 76 132 71 128.5 68.5 C119 64.6 110 64 100 64.4 C90 64 81 64.6 71.5 68.5 C68 71 65 76 63 85 Z"
            color={color}
            texture={stipple}
            textureOpacity={0.8}
            sheen={sheen}
            opacity={0.78}
          />
          <path d="M63.4 84 L66.6 84 L67.4 95 L64.4 94 Z M136.6 84 L133.4 84 L132.6 95 L135.6 94 Z" fill={color} opacity="0.55" />
        </g>
      );
    case 'short':
      return (
        <g>
          {/* Faded sides */}
          <path d="M63 88 C62 72 64 62 70 56 L74 70 C69 74 66 80 65.5 96 Z" fill={color} opacity="0.55" />
          <path d="M137 88 C138 72 136 62 130 56 L126 70 C131 74 134 80 134.5 96 Z" fill={color} opacity="0.55" />
          <HairLayer
            d="M66 74 C62 52 76 37 92 36 C96 33 104 33 108 36 C124 37 138 52 134 74 C131 70 128 67.6 124 66.4 C121 61 116 63 112 62.6 C108 60 104 62 100 61.4 C95 60.6 91 62 87 62.4 C82 61.6 78 63 76 66.4 C72 67.4 68.6 70 66 74 Z"
            color={color}
            texture={coil}
            textureOpacity={0.45}
            sheen={sheen}
          />
          {strands(['M76 52 C82 46 90 44 98 45', 'M104 44 C112 44 120 47 126 54', 'M82 60 C86 55 92 53 98 54'], true)}
        </g>
      );
    case 'hightop':
      return (
        <g>
          <path d="M63.5 88 C63 74 64 66 66 60 L72 68 C68 72 66 80 65.5 96 Z" fill={color} opacity="0.5" />
          <path d="M136.5 88 C137 74 136 66 134 60 L128 68 C132 72 134 80 134.5 96 Z" fill={color} opacity="0.5" />
          <HairLayer
            d="M66 72 C65 62 66 54 67 48 L67.6 24 C68 20 72 18.6 78 18.2 C92 17.4 108 17.4 122 18.2 C128 18.6 132 20 132.4 24 L133 48 C134 54 135 62 134 72 C130 68 126 66.6 122 66 C114 63.6 86 63.6 78 66 C74 66.6 70 68 66 72 Z"
            color={color}
            texture={coil}
            textureOpacity={0.75}
            sheen={sheen}
          />
          <path d="M68 24 C80 21 120 21 132 24" stroke={lighten(color)} strokeOpacity="0.3" strokeWidth="1.2" fill="none" />
        </g>
      );
    case 'afro':
      return (
        <HairLayer
          d="M62 90 C56 46 76 32 100 32 C124 32 144 46 138 90 C135 78 131 71 125 67.6 C119 63 112 64 106 62.6 C102 61.6 98 61.6 94 62.6 C88 64 81 63 75 67.6 C69 71 65 78 62 90 Z"
          color={color}
          texture={coil}
          textureOpacity={0.8}
          sheen={sheen}
        />
      );
    case 'bun':
      return (
        <g>
          <HairLayer
            d="M63 88 C60 58 74 42 100 41 C126 42 140 58 137 88 C135 78 132 72 127 68.4 C118 64 108 63.4 100 63.6 C92 63.4 82 64 73 68.4 C68 72 65 78 63 88 Z"
            color={color}
            sheen={sheen}
          />
          {strands(['M76 66 C80 56 88 48 98 44', 'M88 64 C92 56 96 50 101 45', 'M112 64 C108 56 104 50 99 45', 'M124 66 C120 56 112 48 102 44'])}
          <path d="M92 47 C96 45.6 104 45.6 108 47" stroke={shift(color, -70)} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'long':
      return (
        <g>
          <HairLayer
            d="M61 100 C52 46 76 36 100 37 C126 38 146 50 139 100 C138 84 135 74 129 67 C121 59 108 58 96 61 C86 64 76 70 70 80 C66 86 63 92 61 100 Z"
            color={color}
            sheen={sheen}
          />
          {strands(['M96 40 C88 46 80 58 76 72', 'M104 40 C116 44 128 54 132 72', 'M100 40 C96 50 92 56 84 64'])}
          {strands(['M110 44 C120 48 128 58 131 70'], true)}
        </g>
      );
    default:
      return null;
  }
};

const Top: React.FC<{ meta: AvatarItem['metadata']; round: string }> = ({ meta, round }) => {
  const primary = meta.primary ?? '#333';
  const trim = meta.trim ?? '#111';
  const text = meta.text ?? '#FFF';
  if (meta.style === 'polo') return <Polo primary={primary} trim={trim} round={round} />;
  if (meta.style === 'jacket') return <Jacket primary={primary} trim={trim} round={round} />;
  const isJersey = meta.style === 'jersey';
  const label = meta.label ?? '';
  const labelSize = label.length > 9 ? 6.5 : label.length > 6 ? 8 : 9.5;
  return (
    <g>
      {isJersey ? (
        <>
          <path d={JERSEY} fill={primary} />
          <path d={JERSEY} fill={round} />
          <path d="M84 145 C88 159 112 159 116 145" stroke={trim} strokeWidth="4" fill="none" />
          <path d="M72 149 C73 166 68 180 56 188" stroke={trim} strokeWidth="3" fill="none" />
          <path d="M128 149 C127 166 132 180 144 188" stroke={trim} strokeWidth="3" fill="none" />
          <path d="M84 170 C90 176 110 176 116 170" stroke="#000" strokeOpacity="0.1" strokeWidth="1.2" fill="none" />
        </>
      ) : (
        <>
          <path d={TEE} fill={primary} />
          <path d={TEE} fill={round} />
          <path d="M84 144 C90 154.5 110 154.5 116 144" stroke={trim} strokeWidth="3.5" fill="none" />
          <g stroke="#000" strokeOpacity="0.16" strokeWidth="1.2" fill="none" strokeLinecap="round">
            <path d="M64 153 C59 166 56 182 56 200" />
            <path d="M136 153 C141 166 144 182 144 200" />
            <path d="M74 182 C80 186 87 184 92 190" />
            <path d="M126 182 C120 186 113 184 108 190" />
          </g>
        </>
      )}
      {label && (
        <text x="100" y="177" textAnchor="middle" fontSize={labelSize} fontWeight="800" fill={text} fontFamily="Arial Black, Arial, sans-serif" letterSpacing="0.5">
          {label}
        </text>
      )}
      {meta.number && (
        <text x="100" y="199" textAnchor="middle" fontSize="24" fontWeight="900" fill={text} stroke={trim} strokeWidth="1" fontFamily="Arial Black, Arial, sans-serif">
          {meta.number}
        </text>
      )}
    </g>
  );
};

const Polo: React.FC<{ primary: string; trim: string; round: string }> = ({ primary, trim, round }) => (
  <g>
    <path d={TEE} fill={primary} />
    <path d={TEE} fill={round} />
    <path d="M100 152 L100 184" stroke={darken(primary)} strokeWidth="2" />
    <circle cx="100" cy="162" r="1.7" fill="#FFFFFF" opacity="0.85" />
    <circle cx="100" cy="172" r="1.7" fill="#FFFFFF" opacity="0.85" />
    <path d="M85 142 L100 156 L93 166 L79 147 Z" fill={trim} />
    <path d="M115 142 L100 156 L107 166 L121 147 Z" fill={trim} />
    <path d="M85 142 L100 156 L115 142" stroke="#000" strokeOpacity="0.2" strokeWidth="1" fill="none" />
    <g stroke="#000" strokeOpacity="0.16" strokeWidth="1.2" fill="none">
      <path d="M64 153 C59 166 56 182 56 200" />
      <path d="M136 153 C141 166 144 182 144 200" />
    </g>
  </g>
);

const Jacket: React.FC<{ primary: string; trim: string; round: string }> = ({ primary, trim, round }) => (
  <g>
    <path d={TEE} fill={primary} />
    <path d={TEE} fill={round} />
    <path d="M88 146 L100 200 L112 146 Q100 154 88 146 Z" fill="#F2F2F2" />
    <path d="M87 140 L100 184 L94 188 L77 147 Z" fill={darken(primary)} stroke={trim} strokeWidth="1.5" />
    <path d="M113 140 L100 184 L106 188 L123 147 Z" fill={darken(primary)} stroke={trim} strokeWidth="1.5" />
    <rect x="122" y="170" width="14" height="3" rx="1.5" fill={trim} />
    <g stroke="#000" strokeOpacity="0.18" strokeWidth="1.2" fill="none">
      <path d="M64 153 C59 166 56 182 56 200" />
      <path d="M136 153 C141 166 144 182 144 200" />
    </g>
  </g>
);

const Headwear: React.FC<{ meta: AvatarItem['metadata']; sheen: string }> = ({ meta, sheen }) => {
  const primary = meta.primary ?? '#111';
  const trim = meta.trim ?? '#1F6FEB';
  if (meta.style === 'headband') {
    const band = 'M63.6 66 C80 61.6 120 61.6 136.4 66 L137.2 77 C120 72.6 80 72.6 62.8 77 Z';
    return (
      <g>
        <path d={band} fill={primary} />
        <path d={band} fill={sheen} />
        <path d="M63.2 71.4 C80 67 120 67 136.8 71.4" stroke={trim} strokeWidth="2.6" fill="none" />
      </g>
    );
  }
  const crown = 'M61 82 C59 50 76 35 100 35 C124 35 141 50 139 82 C126 77.6 74 77.6 61 82 Z';
  return (
    <g>
      <path d={crown} fill={primary} />
      <path d={crown} fill={sheen} />
      <g stroke="#000" strokeOpacity="0.18" strokeWidth="1" fill="none">
        <path d="M100 36 C92 50 90 64 90 79" />
        <path d="M100 36 C108 50 110 64 110 79" />
      </g>
      <circle cx="100" cy="36.5" r="3" fill={trim} />
      <path d="M60 82 C74 77 126 77 140 82 C151 83 160 86 162 90 C150 92.4 120 89.6 100 89.6 C82 89.6 68 88.6 60 86.4 Z" fill={trim} />
      <path d="M62 86.6 C74 88.6 86 89.6 100 89.6 C120 89.6 150 92.4 162 90" stroke="#000" strokeOpacity="0.3" strokeWidth="1.2" fill="none" />
      <text x="100" y="70" textAnchor="middle" fontSize="15" fontWeight="900" fill={trim} fontFamily="Arial Black, Arial, sans-serif">
        M
      </text>
    </g>
  );
};

const Accessory: React.FC<{ meta: AvatarItem['metadata'] }> = ({ meta }) => {
  const primary = meta.primary ?? '#111';
  if (meta.style === 'shades') {
    const lens = (s: 1 | -1) => {
      const x = (d: number) => 100 - d * s;
      return `M${x(25)} 87.6 L${x(3)} 87.6 C${x(3)} 95.6 ${x(5)} 100.4 ${x(12)} 100.4 L${x(18)} 100.4 C${x(23)} 100.4 ${x(25)} 95.6 ${x(25)} 87.6 Z`;
    };
    return (
      <g>
        <path d="M75 88.6 L63.6 87.4 M125 88.6 L136.4 87.4" stroke={primary} strokeWidth="2" strokeLinecap="round" />
        <path d={lens(1)} fill={primary} />
        <path d={lens(-1)} fill={primary} />
        <path d="M97 89 Q100 87 103 89" stroke={primary} strokeWidth="2.6" fill="none" />
        <path d="M79 91 L86 98 M107 91 L114 98" stroke="#FFF" strokeOpacity="0.28" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    );
  }
  if (meta.style === 'chain') {
    return (
      <g>
        <path d="M82 147 Q100 179 118 147" stroke={darken(primary)} strokeWidth="4.4" fill="none" strokeDasharray="3 1.6" />
        <path d="M82 147 Q100 178 118 147" stroke={primary} strokeWidth="3" fill="none" strokeDasharray="3 1.6" />
        <path d="M86 152 Q100 172 114 152" stroke="#FFF" strokeOpacity="0.35" strokeWidth="0.8" fill="none" />
      </g>
    );
  }
  return null;
};

/** Forearms come up into a fighter's guard when gloves or wraps are worn. */
const Forearm: React.FC<{ cx: number; tone: SkinTone }> = ({ cx, tone }) => {
  const s = cx < 100 ? 1 : -1;
  const d = `M${cx - 18 * s} 200 C${cx - 16 * s} 190 ${cx - 12 * s} 181 ${cx - 9 * s} 176 L${cx + 9 * s} 178 C${cx + 8 * s} 186 ${cx + 7 * s} 193 ${cx + 7 * s} 200 Z`;
  return (
    <g>
      <path d={d} fill={tone.base} />
      <path d={d} fill="#000" opacity="0.1" />
      {/* Forearm muscle and the ulna ridge */}
      <path d={`M${cx - 4 * s} 182 C${cx - 6 * s} 188 ${cx - 7 * s} 194 ${cx - 7 * s} 200`} stroke={tone.light} strokeOpacity="0.5" strokeWidth="1.6" fill="none" />
      <path d={`M${cx + 6 * s} 182 C${cx + 5 * s} 189 ${cx + 5 * s} 195 ${cx + 5 * s} 200`} stroke={tone.deep} strokeOpacity="0.35" strokeWidth="1" fill="none" />
    </g>
  );
};

/**
 * A closed fist seen from the front: four fingers curled with knuckle crests
 * and the nail tips, the thumb folded across the middle fingers.
 */
const Fist: React.FC<{ cx: number; tone: SkinTone }> = ({ cx, tone }) => {
  const s = cx < 100 ? 1 : -1;
  const fingers = [-7.5, -2.5, 2.5, 7.5];
  return (
    <g>
      <path
        d={`M${cx - 11} 162 C${cx - 12} 155 ${cx - 8} 152 ${cx} 152 C${cx + 8} 152 ${cx + 12} 155 ${cx + 11} 162 L${cx + 10} 176 C${cx + 4} 179 ${cx - 4} 179 ${cx - 10} 176 Z`}
        fill={tone.base}
      />
      {fingers.map((dx, i) => (
        <g key={dx}>
          <rect x={cx + dx - 2.5} y={154 + Math.abs(dx) * 0.15} width="5" height={13 - (i === 3 || i === 0 ? 1.5 : 0)} rx="2.4" fill={tone.base} stroke={tone.deep} strokeOpacity="0.45" strokeWidth="0.7" />
          {/* knuckle crest highlight */}
          <ellipse cx={cx + dx} cy={155.6 + Math.abs(dx) * 0.15} rx="1.7" ry="1" fill={tone.light} opacity="0.7" />
          {/* middle finger joint crease */}
          <path d={`M${cx + dx - 1.8} 161 Q${cx + dx} 162 ${cx + dx + 1.8} 161`} stroke={tone.deep} strokeOpacity="0.45" strokeWidth="0.6" fill="none" />
          {/* nail tip curled into the palm */}
          <path d={`M${cx + dx - 1.6} 166 Q${cx + dx} 164.6 ${cx + dx + 1.6} 166`} stroke={tone.lip} strokeOpacity="0.6" strokeWidth="0.8" fill="none" />
        </g>
      ))}
      {/* Thumb folded across the index and middle fingers */}
      <path
        d={`M${cx - 12 * s} 165 C${cx - 10 * s} 172 ${cx - 2 * s} 172 ${cx + 4 * s} 168.5 C${cx + 6 * s} 167.5 ${cx + 5.5 * s} 165 ${cx + 3 * s} 165 C${cx - 2 * s} 165.5 ${cx - 6 * s} 164 ${cx - 12 * s} 160 Z`}
        fill={tone.base}
        stroke={tone.deep}
        strokeOpacity="0.5"
        strokeWidth="0.7"
      />
      <path d={`M${cx + 1 * s} 166 Q${cx + 3.5 * s} 165.6 ${cx + 4 * s} 167.6`} stroke={tone.lip} strokeOpacity="0.6" strokeWidth="0.8" fill="none" />
      <path d={`M${cx - 10} 174 C${cx - 4} 176.5 ${cx + 4} 176.5 ${cx + 10} 174`} stroke={tone.deep} strokeOpacity="0.3" strokeWidth="1" fill="none" />
    </g>
  );
};

const Gloves: React.FC<{ meta: AvatarItem['metadata']; tone: SkinTone; sheen: string }> = ({ meta, tone, sheen }) => {
  const primary = meta.primary ?? '#D7263D';
  const trim = meta.trim ?? '#FFF';
  if (meta.style === 'wraps') {
    // Calisthenics / hand wraps: real fingers stay bare, the tape covers
    // the palm, knuckles' base and wrist in overlapping diagonal turns.
    const wrap = (cx: number) => (
      <g key={cx}>
        <Forearm cx={cx} tone={tone} />
        <Fist cx={cx} tone={tone} />
        <path d={`M${cx - 10.5} 163 L${cx + 10.5} 163 L${cx + 10} 186 C${cx + 4} 188 ${cx - 4} 188 ${cx - 10} 186 Z`} fill={primary} opacity="0.94" />
        {[166, 171, 176, 181].map((y, i) => (
          <path key={y} d={`M${cx - 10.5} ${y + (i % 2 ? 3 : 0)} L${cx + 10.5} ${y + (i % 2 ? 0 : 3)}`} stroke={trim} strokeOpacity="0.55" strokeWidth="1" />
        ))}
        {/* tape between the fingers */}
        {[-5, 0, 5].map((dx) => (
          <path key={dx} d={`M${cx + dx} 163 L${cx + dx} 158`} stroke={primary} strokeWidth="1.4" />
        ))}
        <path d={`M${cx - 10.5} 163 L${cx + 10.5} 163 L${cx + 10} 186 C${cx + 4} 188 ${cx - 4} 188 ${cx - 10} 186 Z`} fill={sheen} />
      </g>
    );
    return <g>{[64, 136].map(wrap)}</g>;
  }
  const glove = (cx: number) => {
    const s = cx < 100 ? 1 : -1;
    const fist = `M${cx - 16 * s} 154 C${cx - 17 * s} 140 ${cx + 15 * s} 138 ${cx + 17 * s} 152 C${cx + 19 * s} 165 ${cx + 14 * s} 175 ${cx} 175 C${cx - 12 * s} 175 ${cx - 18 * s} 166 ${cx - 16 * s} 154 Z`;
    const thumb = `M${cx - 16 * s} 157 C${cx - 22 * s} 161 ${cx - 20 * s} 171 ${cx - 9 * s} 171 C${cx - 12 * s} 166 ${cx - 13 * s} 161 ${cx - 16 * s} 157 Z`;
    return (
      <g key={cx}>
        <Forearm cx={cx} tone={tone} />
        {/* Wrist cuff with velcro strap */}
        <path d={`M${cx - 11} 171 L${cx + 11} 171 L${cx + 10} 193 L${cx - 10} 193 Z`} fill={primary} />
        <path d={`M${cx - 11} 177 L${cx + 11} 177 L${cx + 10.6} 187 L${cx - 10.6} 187 Z`} fill={trim} />
        <path d={`M${cx - 10.6} 182 L${cx + 10.6} 182`} stroke="#000" strokeOpacity="0.15" strokeWidth="0.8" strokeDasharray="1.4 1" />
        <path d={fist} fill={primary} />
        <path d={fist} fill={sheen} />
        {/* Padded knuckle bulge with the four finger seams under the leather */}
        <path d={`M${cx - 13 * s} 150 C${cx - 4 * s} 144 ${cx + 7 * s} 144 ${cx + 15 * s} 151`} stroke="#000" strokeOpacity="0.22" strokeWidth="1.2" fill="none" />
        {[-6, -1, 4, 9].map((dx) => (
          <path key={dx} d={`M${cx + dx * s} 145 C${cx + (dx + 0.6) * s} 150 ${cx + (dx + 0.6) * s} 155 ${cx + dx * s} 159`} stroke="#000" strokeOpacity="0.12" strokeWidth="0.9" fill="none" />
        ))}
        <path d={thumb} fill={primary} />
        <path d={thumb} fill="#000" opacity="0.14" />
        {/* Thumb-lock seam joining thumb to the fist */}
        <path d={`M${cx - 15 * s} 158 C${cx - 14 * s} 164 ${cx - 12 * s} 168 ${cx - 9 * s} 171`} stroke="#000" strokeOpacity="0.3" strokeWidth="0.9" fill="none" />
        <path d={`M${cx - 9 * s} 144 Q${cx} 140 ${cx + 10 * s} 145`} stroke="#FFF" strokeOpacity="0.5" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <ellipse cx={cx + 2 * s} cy="162" rx="7" ry="5" fill="#FFF" opacity="0.06" />
      </g>
    );
  };
  return (
    <g>
      {glove(64)}
      {glove(136)}
    </g>
  );
};

const ArenaLights: React.FC<{ trim: string }> = ({ trim }) => (
  <g>
    <polygon points="20,0 40,0 90,140 60,140" fill={trim} opacity="0.16" />
    <polygon points="160,0 180,0 140,140 110,140" fill={trim} opacity="0.16" />
    <g fill={trim} opacity="0.5">
      {Array.from({ length: 24 }).map((_, i) => (
        <circle key={i} cx={6 + i * 8.3} cy={128 + (i % 3) * 6} r="2.2" />
      ))}
    </g>
    <circle cx="30" cy="10" r="6" fill={trim} opacity="0.9" />
    <circle cx="170" cy="10" r="6" fill={trim} opacity="0.9" />
  </g>
);

const RingRopes: React.FC<{ trim: string }> = ({ trim }) => (
  <g>
    <circle cx="100" cy="-10" r="90" fill="#FFFFFF" opacity="0.08" />
    {[118, 138, 158].map((y) => (
      <line key={y} x1="0" y1={y} x2="200" y2={y} stroke={trim} strokeWidth="3.5" opacity="0.9" />
    ))}
    <rect x="4" y="104" width="10" height="96" fill="#D9D9D9" opacity="0.7" />
    <rect x="186" y="104" width="10" height="96" fill="#D9D9D9" opacity="0.7" />
  </g>
);

function parse(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  return Number.isNaN(n) ? null : [n >> 16, (n >> 8) & 0xff, n & 0xff];
}
const toHex = (rgb: number[]) =>
  `#${rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`;

function shift(hex: string, amount: number) {
  const rgb = parse(hex);
  return rgb ? toHex(rgb.map((v) => v + amount)) : hex;
}
function mix(a: string, b: string, t: number) {
  const x = parse(a);
  const y = parse(b);
  if (!x || !y) return a;
  return toHex(x.map((v, i) => v + (y[i] - v) * t));
}
const lighten = (hex: string) => shift(hex, 40);
const darken = (hex: string) => shift(hex, -40);
