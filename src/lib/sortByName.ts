/**
 * Alphabetical sort helpers used across category lists.
 * Returns a NEW array; never mutates the input.
 */
const collator = new Intl.Collator(undefined, {
  sensitivity: 'base',
  numeric: true,
});

type WithName = { name?: string; label?: string; title?: string };
type Sortable = string | WithName;

const getKey = (item: Sortable): string => {
  if (typeof item === 'string') return item;
  return String(item.name ?? item.label ?? item.title ?? '');
};

export function sortByName<T extends Sortable>(items: T[]): T[] {
  return [...items].sort((a, b) => collator.compare(getKey(a), getKey(b)));
}

/**
 * Sort alphabetically but keep certain items pinned at the top
 * (matched by name/label, case-insensitive).
 */
export function sortByNamePinned<T extends Sortable>(
  items: T[],
  pinned: string[] = []
): T[] {
  const pinnedLower = pinned.map((p) => p.toLowerCase());
  const isPinned = (item: T) => pinnedLower.includes(getKey(item).toLowerCase());
  const head = pinned
    .map((p) => items.find((i) => getKey(i).toLowerCase() === p.toLowerCase()))
    .filter((v): v is T => Boolean(v));
  const tail = [...items]
    .filter((i) => !isPinned(i))
    .sort((a, b) => collator.compare(getKey(a), getKey(b)));
  return [...head, ...tail];
}
