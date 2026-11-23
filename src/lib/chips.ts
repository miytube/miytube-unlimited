/** Casino chip denominations used to draw bet stacks, largest first. */
export const CHIP_DENOMINATIONS = [500, 250, 100, 50, 25, 10, 5, 1] as const;
export type ChipDenomination = (typeof CHIP_DENOMINATIONS)[number];

/** Break a coin amount into the fewest chips, largest at the bottom of the stack. */
export function chipBreakdown(amount: number): ChipDenomination[] {
  const chips: ChipDenomination[] = [];
  let left = Math.max(0, Math.floor(amount));
  for (const d of CHIP_DENOMINATIONS) {
    while (left >= d) {
      chips.push(d);
      left -= d;
    }
  }
  return chips;
}

/** The chip color for a value: exact denomination, else the largest one it covers. */
export function chipDenomination(value: number): ChipDenomination {
  return CHIP_DENOMINATIONS.find((d) => value >= d) ?? 1;
}
