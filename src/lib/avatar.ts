/**
 * Avatar Studio model: the look options, gear slots and the rules for what a
 * saved avatar may contain. Gear items carry a permanent `sku` and an
 * `asset_uri`, so the same records can be minted to a wallet later.
 */

export const AVATAR_SLOTS = ['background', 'top', 'gloves', 'headwear', 'accessory'] as const;
export type AvatarSlot = (typeof AVATAR_SLOTS)[number];

export const SLOT_LABELS: Record<AvatarSlot, string> = {
  background: 'Backdrop',
  top: 'Jerseys & Tops',
  gloves: 'Gloves',
  headwear: 'Headwear',
  accessory: 'Accessories',
};

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface AvatarItemMetadata {
  style?: string;
  primary?: string;
  trim?: string;
  text?: string;
  number?: string;
  label?: string;
}

export interface AvatarItem {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string | null;
  slot: AvatarSlot;
  rarity: Rarity;
  legend_id: number | null;
  is_starter: boolean;
  price_credits: number;
  asset_uri: string;
  metadata: AvatarItemMetadata;
  sort_order: number;
}

/** Look options are fixed palettes; the saved config only stores option ids. */
export const SKIN_TONES = [
  { id: 'porcelain', label: 'Porcelain', color: '#F6D7C3' },
  { id: 'light', label: 'Light', color: '#EBC1A0' },
  { id: 'tan', label: 'Tan', color: '#D29B6C' },
  { id: 'bronze', label: 'Bronze', color: '#B07445' },
  { id: 'brown', label: 'Brown', color: '#8A5530' },
  { id: 'deep', label: 'Deep', color: '#5E3A20' },
] as const;

export const HAIR_STYLES = [
  { id: 'bald', label: 'Clean' },
  { id: 'buzz', label: 'Buzz' },
  { id: 'short', label: 'Short' },
  { id: 'hightop', label: 'High Top' },
  { id: 'afro', label: 'Afro' },
  { id: 'bun', label: 'Bun' },
  { id: 'long', label: 'Long' },
] as const;

export const HAIR_COLORS = [
  { id: 'black', label: 'Black', color: '#1B1B1F' },
  { id: 'brown', label: 'Brown', color: '#5A3825' },
  { id: 'auburn', label: 'Auburn', color: '#8E3B1F' },
  { id: 'blonde', label: 'Blonde', color: '#D9B36C' },
  { id: 'silver', label: 'Silver', color: '#BFC3C9' },
  { id: 'electric', label: 'Electric', color: '#2F7CF6' },
] as const;

export const EYE_COLORS = [
  { id: 'brown', label: 'Brown', color: '#5B3A1E' },
  { id: 'hazel', label: 'Hazel', color: '#8A6A2F' },
  { id: 'green', label: 'Green', color: '#3E7B4F' },
  { id: 'blue', label: 'Blue', color: '#3C6FB6' },
  { id: 'gray', label: 'Gray', color: '#6B7480' },
] as const;

export const EXPRESSIONS = [
  { id: 'smile', label: 'Smile' },
  { id: 'grin', label: 'Big Grin' },
  { id: 'focused', label: 'Game Face' },
  { id: 'chill', label: 'Chill' },
] as const;

export const SHIRT_COLORS = [
  { id: 'graphite', label: 'Graphite', color: '#2B2F36' },
  { id: 'white', label: 'White', color: '#F2F2F2' },
  { id: 'royal', label: 'Royal', color: '#1F4FD1' },
  { id: 'crimson', label: 'Crimson', color: '#B3122E' },
  { id: 'forest', label: 'Forest', color: '#1F6B3A' },
  { id: 'gold', label: 'Gold', color: '#E0A526' },
] as const;

export const BACKDROPS = [
  { id: 'court', label: 'Hardwood', from: '#C98A4B', to: '#7A4A22' },
  { id: 'night', label: 'Night Game', from: '#1A2550', to: '#070B1C' },
  { id: 'turf', label: 'Turf', from: '#2E8B4A', to: '#0F3D20' },
  { id: 'ice', label: 'Ice', from: '#DDEFFC', to: '#8DB9DC' },
  { id: 'sunset', label: 'Sunset', from: '#F7A44A', to: '#B83A5E' },
] as const;

export interface AvatarConfig {
  skin: string;
  hair: string;
  hairColor: string;
  eyes: string;
  expression: string;
  shirtColor: string;
  backdrop: string;
}

export type AvatarEquipped = Partial<Record<AvatarSlot, string>>;

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  skin: 'tan',
  hair: 'short',
  hairColor: 'black',
  eyes: 'brown',
  expression: 'smile',
  shirtColor: 'graphite',
  backdrop: 'night',
};

const OPTION_SETS: Record<keyof AvatarConfig, readonly { id: string }[]> = {
  skin: SKIN_TONES,
  hair: HAIR_STYLES,
  hairColor: HAIR_COLORS,
  eyes: EYE_COLORS,
  expression: EXPRESSIONS,
  shirtColor: SHIRT_COLORS,
  backdrop: BACKDROPS,
};

/** Keep only known option ids; anything else falls back to the default look. */
export function sanitizeAvatarConfig(raw: unknown): AvatarConfig {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const result = { ...DEFAULT_AVATAR_CONFIG };
  (Object.keys(OPTION_SETS) as (keyof AvatarConfig)[]).forEach((key) => {
    const value = source[key];
    if (typeof value === 'string' && OPTION_SETS[key].some((o) => o.id === value)) {
      result[key] = value;
    }
  });
  return result;
}

const isSlot = (value: string): value is AvatarSlot => (AVATAR_SLOTS as readonly string[]).includes(value);

/** Keep only gear the member owns, worn in the slot it was made for. */
export function sanitizeEquipped(raw: unknown, ownedItems: Pick<AvatarItem, 'sku' | 'slot'>[]): AvatarEquipped {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const slotBySku = new Map(ownedItems.map((item) => [item.sku, item.slot]));
  const result: AvatarEquipped = {};
  Object.entries(source).forEach(([slot, sku]) => {
    if (isSlot(slot) && typeof sku === 'string' && slotBySku.get(sku) === slot) {
      result[slot] = sku;
    }
  });
  return result;
}

/** Wear an item (replacing whatever is in its slot), or take it off if already worn. */
export function toggleEquip(equipped: AvatarEquipped, item: Pick<AvatarItem, 'sku' | 'slot'>): AvatarEquipped {
  const next = { ...equipped };
  if (next[item.slot] === item.sku) {
    delete next[item.slot];
  } else {
    next[item.slot] = item.sku;
  }
  return next;
}

/** Turn the equipped sku map into the item records the renderer draws. */
export function resolveEquippedItems(
  equipped: AvatarEquipped,
  catalog: Map<string, AvatarItem>,
): Partial<Record<AvatarSlot, AvatarItem>> {
  const result: Partial<Record<AvatarSlot, AvatarItem>> = {};
  (Object.entries(equipped) as [AvatarSlot, string][]).forEach(([slot, sku]) => {
    const item = catalog.get(sku);
    if (item && item.slot === slot) result[slot] = item;
  });
  return result;
}

export const optionColor = (options: readonly { id: string; color?: string }[], id: string) =>
  options.find((o) => o.id === id)?.color ?? options[0].color ?? '#888888';

export function toAvatarItem(row: Record<string, unknown>): AvatarItem {
  return {
    id: String(row.id),
    sku: String(row.sku),
    slug: String(row.slug),
    name: String(row.name),
    description: (row.description as string | null) ?? null,
    slot: row.slot as AvatarSlot,
    rarity: row.rarity as Rarity,
    legend_id: (row.legend_id as number | null) ?? null,
    is_starter: Boolean(row.is_starter),
    price_credits: Number(row.price_credits ?? 0),
    asset_uri: String(row.asset_uri),
    metadata: (row.metadata && typeof row.metadata === 'object' ? row.metadata : {}) as AvatarItemMetadata,
    sort_order: Number(row.sort_order ?? 0),
  };
}
