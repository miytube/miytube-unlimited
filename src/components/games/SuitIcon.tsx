import React from 'react';
import type { Suit } from '@/lib/blackjack';

/** Crisp vector suit shapes (no emoji fallback on any device). */
type SuitIconProps = React.SVGProps<SVGSVGElement> & { suit: Suit };

export const SuitIcon: React.FC<SuitIconProps> = ({ suit, ...rest }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" {...rest}>
    {suit === 'hearts' && (
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    )}
    {suit === 'diamonds' && <path d="M12 1.5C14.5 5.5 17.2 9 20.5 12 17.2 15 14.5 18.5 12 22.5 9.5 18.5 6.8 15 3.5 12 6.8 9 9.5 5.5 12 1.5z" />}
    {suit === 'spades' && (
      <path d="M12 1.8C9 6.4 3 9.4 3 14c0 2.8 2.2 4.8 4.8 4.8 1.5 0 2.7-.6 3.4-1.5-.3 1.9-1.1 3.5-2.7 4.9h7c-1.6-1.4-2.4-3-2.7-4.9.7.9 1.9 1.5 3.4 1.5 2.6 0 4.8-2 4.8-4.8 0-4.6-6-7.6-9-12.2z" />
    )}
    {suit === 'clubs' && (
      <>
        <circle cx="12" cy="6.8" r="4.4" />
        <circle cx="6.6" cy="13.6" r="4.4" />
        <circle cx="17.4" cy="13.6" r="4.4" />
        <path d="M10.9 12.5h2.2c0 3.9.9 6.6 3.2 9.4H7.7c2.3-2.8 3.2-5.5 3.2-9.4z" />
      </>
    )}
  </svg>
);
