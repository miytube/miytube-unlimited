// Booksem audiobooks that can be bought at half price with a MiyTube pass.
// Prices mirror the full prices on booksem.com (cents). Keep in sync with Booksem's catalog.
export const BOOKSEM_PASS_DISCOUNT_PERCENT = 50;

export const BOOKSEM_BOOKS: Record<string, { title: string; priceCents: number }> = {
  "1": { title: "The Art of War", priceCents: 399 },
  "2": { title: "Think and Grow Rich", priceCents: 499 },
  "3": { title: "Meditations", priceCents: 399 },
  "4": { title: "The Republic", priceCents: 399 },
  "5": { title: "The Prince", priceCents: 399 },
  "6": { title: "The Science of Getting Rich", priceCents: 399 },
  "7": { title: "Dracula", priceCents: 299 },
  "8": { title: "Frankenstein", priceCents: 299 },
  "9": { title: "The Great Gatsby", priceCents: 399 },
  "10": { title: "The Picture of Dorian Gray", priceCents: 299 },
  "11": { title: "A Tale of Two Cities", priceCents: 399 },
  "12": { title: "The Prophet", priceCents: 299 },
};

/** Half price, rounded down to the cent so the member never pays more than half. */
export function passPriceCents(fullPriceCents: number): number {
  return Math.floor((fullPriceCents * (100 - BOOKSEM_PASS_DISCOUNT_PERCENT)) / 100);
}
