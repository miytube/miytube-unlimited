/**
 * Alphabetical sort helpers used across category lists.
 * Returns a NEW array; never mutates the input.
 */
const collator = new Intl.Collator(undefined, {
  sensitivity: 'base',
  numeric: true,
});

type WithName = { name?: string; label?: string; title?: string };

const getKey = (item: WithName): string =>
  String(item.name ?? item.label ?? item.title ?? '');

export function sortByName<T extends WithName>(items: T[]): T[] {
  return [...items].sort((a, b) => collator.compare(getKey(a), getKey(b)));
}

/**
 * Sort alphabetically but keep certain items pinned at the top
 * (matched by name/label, case-insensitive).
 */
export function sortByNamePinned<T extends WithName>(
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
