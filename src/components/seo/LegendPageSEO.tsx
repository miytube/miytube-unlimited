import { Helmet } from 'react-helmet-async';
import { type SportsLegend } from '@/data/sportsBeginEndLegends';
import { usePageSEO } from '@/hooks/usePageSEO';
import { buildLegendSchema, legendPageMetadata, type LegendSEOItem } from '@/lib/legendSEO';
import { serializeJsonLd } from '@/lib/seo';

interface Props {
  legend?: SportsLegend;
  visibleVideos: LegendSEOItem[];
  totalVideos: number;
  offset?: number;
}

export function LegendPageSEO({ legend, visibleVideos, totalVideos, offset = 0 }: Props) {
  usePageSEO(legendPageMetadata(legend));
  return (
    <Helmet>
      <script id="legend-jsonld" type="application/ld+json">
        {serializeJsonLd(buildLegendSchema(legend, visibleVideos, totalVideos, offset))}
      </script>
    </Helmet>
  );
}