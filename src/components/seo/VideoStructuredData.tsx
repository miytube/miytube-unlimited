import { Helmet } from 'react-helmet-async';
import { buildVideoSchema, serializeJsonLd, type VideoSchemaInput } from '@/lib/seo';

export function VideoStructuredData(props: VideoSchemaInput) {
  const data = buildVideoSchema(props);
  if (!data) return null;
  return (
    <Helmet>
      <script id="video-jsonld" type="application/ld+json">{serializeJsonLd(data)}</script>
    </Helmet>
  );
}
