import { useVideoViewCounts } from '@/hooks/useVideoViewCounts';

export function VideoViewCount({ id }: { id: string }) {
  const { viewsFor } = useVideoViewCounts([id]);
  return <>{viewsFor(id)} views</>;
}