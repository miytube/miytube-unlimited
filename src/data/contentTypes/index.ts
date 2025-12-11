
import { videoContentTypes } from './videoTypes';
import { musicContentTypes } from './musicTypes';
import { podcastContentTypes } from './podcastTypes';
import { bookContentTypes } from './bookTypes';
import { relaxationContentTypes } from './relaxationTypes';
import { entertainmentContentTypes } from './entertainmentTypes';
import { environmentContentTypes } from './environmentTypes';
import { mediaContentTypes } from './mediaTypes';
import { speechContentTypes } from './speechTypes';
import { ContentType } from '@/types/upload';

// Merge all content types into a single object
export const contentTypes: Record<string, ContentType> = {
  ...videoContentTypes,
  ...musicContentTypes,
  ...podcastContentTypes,
  ...bookContentTypes,
  ...relaxationContentTypes,
  ...entertainmentContentTypes,
  ...environmentContentTypes,
  ...mediaContentTypes,
  ...speechContentTypes,
};

// Re-export individual type categories for selective imports
export { 
  videoContentTypes,
  musicContentTypes,
  podcastContentTypes,
  bookContentTypes,
  relaxationContentTypes,
  entertainmentContentTypes,
  environmentContentTypes,
  mediaContentTypes,
  speechContentTypes
};
