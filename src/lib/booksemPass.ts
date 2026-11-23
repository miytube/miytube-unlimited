/** MiyTube Coins needed for one Booksem 50% Off Pass (enforced by the backend). */
export const BOOKSEM_PASS_PRICE_COINS = 250;
export const BOOKSEM_PASS_DISCOUNT_PERCENT = 50;
export const BOOKSEM_URL = 'https://booksem.com';

export interface BooksemPass {
  id: string;
  code: string;
  status: 'active' | 'reserved' | 'redeemed';
  book_id: string | null;
  redeemed_at: string | null;
  created_at: string;
}
