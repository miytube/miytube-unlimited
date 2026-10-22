import { MessagesSquare } from 'lucide-react';
import type { SubcategoryMapping } from './types';

export const debateWatchSlug = 'politics-governors-attorney-generals-others';
export const debateWatchTitle = 'Debate (politics, governors, attorney generals, others)';
export const debateWatchRoute = `/debate/${debateWatchSlug}`;

export const debateSubcategories: SubcategoryMapping = {
  [debateWatchRoute]: {
    title: debateWatchTitle,
    description: 'Political debates featuring governors, attorney generals and other participants.',
    icon: MessagesSquare,
    parent: { route: '/debate', name: 'Debate' },
  },
};