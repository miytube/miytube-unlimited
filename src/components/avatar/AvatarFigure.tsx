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
 * Layered 2D avatar. Look colors and gear colors are artwork data (skin tones,
 * team colors), so they are drawn straight from the avatar palettes and item
 * metadata rather than from the site theme.
 */
interface AvatarFigureProps {
  config: AvatarConfig;
  items?: Partial<Record<AvatarSlot, AvatarItem>>;
  /** "head" frames the face for small bubbles (comments, header). */
  crop?: 'full' | 'head';
  className?: string;
  title?: string;
}

const TORSO = 'M28 200 C28 162 54 142 100 142 C146 142 172 162 172 200 Z';
const JERSEY = 'M44 200 C44 170 54 150 72 144 L82 141 C88 154 112 154 118 141 L128 144 C146 150 156 170 156 200 Z';
const HEAD_CLIP = 'M64 88 C64 40 136 40 136 88 C136 112 120 128 100 128 C80 128 64 112 64 88 Z';

export const AvatarFigure: React.FC<AvatarFigureProps> = ({ config, items = {}, crop = 'full', className, title }) => {
  const uid = useId().replace(/:/g, '');
  const skin = optionColor(SKIN_TONES, config.skin);
  const hair = optionColor(HAIR_COLORS, config.hairColor);
  const eye = optionColor(EYE_COLORS, config.eyes);
  const shirt = optionColor(SHIRT_COLORS, config.shirtColor);
  const backdrop = BACKDROPS.find((b) => b.id === config.backdrop) ?? BACKDROPS[0];

  const top = items.top?.metadata;
  const gloves = items.gloves?.metadata;
  const headwear = items.headwear?.metadata;
  const accessory = items.accessory?.metadata;
  const bgItem = items.background?.metadata;

  const viewBox = crop === 'head' ? '50 46 100 100' : '0 0 200 200';

  return (
    <svg viewBox={viewBox} className={className} role="img" aria-label={title ?? 'Avatar'} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={bgItem?.primary ? lighten(bgItem.primary) : backdrop.from} />
          <stop offset="1" stopColor={bgItem?.primary ?? backdrop.to} />
        </linearGradient>
        <radialGradient id={`shade-${uid}`} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.18" />
        </radialGradient>
        <clipPath id={`head-${uid}`}>
          <path d={HEAD_CLIP} />
        </clipPath>
      </defs>

      {/* Backdrop */}
      <rect x="0" y="0" width="200" height="200" fill={`url(#bg-${uid})`} />
      {bgItem?.style === 'arena' && <ArenaLights trim={bgItem.trim ?? '#F2C14E'} />}
      {!bgItem && backdrop.id === 'court' && (
        <g opacity="0.18" stroke="#000" strokeWidth="1">
          {[20, 50, 80, 110, 140, 170].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="200" />)}
        </g>
      )}

      {/* Hair behind the head */}
      {config.hair === 'afro' && <circle cx="100" cy="76" r="50" fill={hair} />}
      {config.hair === 'long' && <path d="M58 90 C52 36 148 36 142 90 L148 156 C130 162 70 162 52 156 Z" fill={hair} />}
      {config.hair === 'bun' && <circle cx="100" cy="40" r="15" fill={hair} />}

      {/* Body */}
      <path d={TORSO} fill={skin} />
      <rect x="88" y="118" width="24" height="28" rx="6" fill={skin} />
      <rect x="88" y="118" width="24" height="12" fill="#000" opacity="0.12" />

      {top ? <Top meta={top} /> : <Top meta={{ style: 'tee', primary: shirt, trim: darken(shirt) }} />}

      {/* Head */}
      <circle cx="64" cy="92" r="7" fill={skin} />
      <circle cx="136" cy="92" r="7" fill={skin} />
      <path d={HEAD_CLIP} fill={skin} />
      <path d={HEAD_CLIP} fill={`url(#shade-${uid})`} />

      <Face expression={config.expression} eye={eye} />

      {/* Hair in front */}
      <g clipPath={config.hair === 'hightop' ? undefined : `url(#head-${uid})`}>
        <FrontHair style={config.hair} color={hair} />
      </g>

      {headwear && <Headwear meta={headwear} />}
      {accessory && <Accessory meta={accessory} />}
      {gloves && <Gloves meta={gloves} />}
    </svg>
  );
};

const Face: React.FC<{ expression: string; eye: string }> = ({ expression, eye }) => {
  const focused = expression === 'focused';
  return (
    <g>
      {/* Brows */}
      <g stroke="#1B1B1F" strokeWidth="3" strokeLinecap="round" opacity="0.8">
        <line x1="78" y1={focused ? 80 : 82} x2="92" y2={focused ? 84 : 81} />
        <line x1="108" y1={focused ? 84 : 81} x2="122" y2={focused ? 80 : 82} />
      </g>
      {/* Eyes */}
      {expression === 'chill' ? (
        <g stroke="#1B1B1F" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M80 93 Q86 89 92 93" />
          <path d="M108 93 Q114 89 120 93" />
        </g>
      ) : (
        <g>
          <ellipse cx="86" cy="93" rx="6" ry="5" fill="#FFFFFF" />
          <ellipse cx="114" cy="93" rx="6" ry="5" fill="#FFFFFF" />
          <circle cx="86" cy="93.5" r="3.4" fill={eye} />
          <circle cx="114" cy="93.5" r="3.4" fill={eye} />
          <circle cx="86" cy="93.5" r="1.6" fill="#111" />
          <circle cx="114" cy="93.5" r="1.6" fill="#111" />
          <circle cx="87.3" cy="92.2" r="0.9" fill="#FFF" />
          <circle cx="115.3" cy="92.2" r="0.9" fill="#FFF" />
        </g>
      )}
      {/* Nose */}
      <path d="M100 96 Q96 104 101 106" stroke="#000" strokeOpacity="0.25" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Mouth */}
      {expression === 'grin' && (
        <g>
          <path d="M86 110 Q100 126 114 110 Z" fill="#3A1414" />
          <path d="M88 110.5 L112 110.5 L110 114 L90 114 Z" fill="#FFFFFF" />
        </g>
      )}
      {expression === 'smile' && <path d="M88 111 Q100 121 112 111" stroke="#3A1414" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {expression === 'focused' && <path d="M90 114 L110 113" stroke="#3A1414" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {expression === 'chill' && <path d="M90 112 Q100 116 110 110" stroke="#3A1414" strokeWidth="3" fill="none" strokeLinecap="round" />}
    </g>
  );
};

const FrontHair: React.FC<{ style: string; color: string }> = ({ style, color }) => {
  switch (style) {
    case 'buzz':
      return <path d="M60 84 C60 44 140 44 140 84 C128 66 72 66 60 84 Z" fill={color} opacity="0.85" />;
    case 'short':
    case 'bun':
      return <path d="M60 90 C54 42 146 42 140 90 C134 72 120 64 100 64 C80 64 66 72 60 90 Z" fill={color} />;
    case 'afro':
      return <path d="M60 92 C52 40 148 40 140 92 C134 70 120 62 100 62 C80 62 66 70 60 92 Z" fill={color} />;
    case 'long':
      return <path d="M60 96 C52 40 148 40 140 96 C134 66 104 60 88 64 C76 68 66 78 60 96 Z" fill={color} />;
    case 'hightop':
      return <path d="M64 82 L66 30 Q100 22 134 30 L136 82 C128 70 72 70 64 82 Z" fill={color} />;
    default:
      return null;
  }
};

const Top: React.FC<{ meta: AvatarItem['metadata'] }> = ({ meta }) => {
  const primary = meta.primary ?? '#333';
  const trim = meta.trim ?? '#111';
  const text = meta.text ?? '#FFF';
  const isJersey = meta.style === 'jersey';
  const label = meta.label ?? '';
  const labelSize = label.length > 9 ? 7 : label.length > 6 ? 8.5 : 10;
  return (
    <g>
      {isJersey ? (
        <>
          <path d={JERSEY} fill={primary} />
          <path d="M82 141 C88 154 112 154 118 141" stroke={trim} strokeWidth="4" fill="none" />
          <path d="M72 144 C58 150 48 168 44 200" stroke={trim} strokeWidth="3" fill="none" />
          <path d="M128 144 C142 150 152 168 156 200" stroke={trim} strokeWidth="3" fill="none" />
        </>
      ) : (
        <>
          <path d={TORSO} fill={primary} />
          <path d="M86 142 Q100 154 114 142" stroke={trim} strokeWidth="4" fill="none" />
        </>
      )}
      {label && (
        <text x="100" y="170" textAnchor="middle" fontSize={labelSize} fontWeight="800" fill={text} fontFamily="Arial Black, Arial, sans-serif" letterSpacing="0.5">
          {label}
        </text>
      )}
      {meta.number && (
        <text x="100" y="196" textAnchor="middle" fontSize="26" fontWeight="900" fill={text} stroke={trim} strokeWidth="1" fontFamily="Arial Black, Arial, sans-serif">
          {meta.number}
        </text>
      )}
    </g>
  );
};

const Headwear: React.FC<{ meta: AvatarItem['metadata'] }> = ({ meta }) => {
  const primary = meta.primary ?? '#111';
  const trim = meta.trim ?? '#1F6FEB';
  if (meta.style === 'headband') {
    return (
      <g>
        <rect x="64" y="68" width="72" height="11" rx="4" fill={primary} />
        <rect x="64" y="72.5" width="72" height="2.5" fill={trim} />
      </g>
    );
  }
  return (
    <g>
      <path d="M60 80 C58 38 142 38 140 80 Z" fill={primary} />
      <path d="M60 80 L140 80 C150 80 162 83 164 87 C150 88 128 86 100 86 C80 86 66 85 60 84 Z" fill={trim} />
      <circle cx="100" cy="44" r="3" fill={trim} />
      <text x="100" y="72" textAnchor="middle" fontSize="16" fontWeight="900" fill={trim} fontFamily="Arial Black, Arial, sans-serif">M</text>
    </g>
  );
};

const Accessory: React.FC<{ meta: AvatarItem['metadata'] }> = ({ meta }) => {
  const primary = meta.primary ?? '#111';
  if (meta.style === 'shades') {
    return (
      <g>
        <rect x="76" y="86" width="21" height="13" rx="5" fill={primary} />
        <rect x="103" y="86" width="21" height="13" rx="5" fill={primary} />
        <line x1="97" y1="90" x2="103" y2="90" stroke={primary} strokeWidth="3" />
      </g>
    );
  }
  if (meta.style === 'chain') {
    return <path d="M80 146 Q100 176 120 146" stroke={primary} strokeWidth="4" fill="none" strokeDasharray="3 2" />;
  }
  return null;
};

const Gloves: React.FC<{ meta: AvatarItem['metadata'] }> = ({ meta }) => {
  const primary = meta.primary ?? '#D7263D';
  const trim = meta.trim ?? '#FFF';
  const glove = (cx: number, flip: boolean) => (
    <g transform={flip ? `translate(${cx * 2} 0) scale(-1 1)` : undefined}>
      <rect x={cx - 13} y="172" width="26" height="22" rx="4" fill={trim} />
      <ellipse cx={cx} cy="160" rx="21" ry="19" fill={primary} />
      <ellipse cx={cx - 13} cy="166" rx="8" ry="9" fill={primary} stroke="#000" strokeOpacity="0.15" />
      <path d={`M${cx - 10} 150 Q${cx} 144 ${cx + 12} 152`} stroke="#FFF" strokeOpacity="0.35" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
  return (
    <g>
      {glove(52, false)}
      {glove(148, true)}
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

function shift(hex: string, amount: number) {
  const n = parseInt(hex.replace('#', ''), 16);
  if (Number.isNaN(n)) return hex;
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp((n >> 16) + amount);
  const g = clamp(((n >> 8) & 0xff) + amount);
  const b = clamp((n & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
const lighten = (hex: string) => shift(hex, 40);
const darken = (hex: string) => shift(hex, -40);
