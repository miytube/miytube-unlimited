import { useMemo } from 'react';
import { getCurrentSite, getCurrentSiteId, isMiyTube, SiteConfig, SiteId } from '@/config/sites';

export interface UseSiteResult {
  siteId: SiteId;
  site: SiteConfig;
  isMiyTube: boolean;
}

/** Active site for the current hostname. */
export const useSite = (): UseSiteResult => {
  return useMemo(
    () => ({
      siteId: getCurrentSiteId(),
      site: getCurrentSite(),
      isMiyTube: isMiyTube(),
    }),
    []
  );
};
