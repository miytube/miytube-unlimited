/**
 * Browser-based video transcoder using <canvas> + MediaRecorder.
 * Downscales a video file to a target vertical resolution (e.g. 720p)
 * before uploading. This significantly reduces file size and upload time.
 *
 * Notes:
 * - Output container is WebM (VP9/VP8 + Opus) — universally supported in
 *   modern browsers and accepted by our cloud storage / playback pipeline.
 * - "Original" quality bypasses transcoding entirely (returns the input file).
 * - Audio is preserved by capturing the video element's audio track.
 */

export type VideoQuality = 'original' | '1080' | '720' | '480' | '360' | '240';

export const QUALITY_LABELS: Record<VideoQuality, string> = {
  original: 'Original (no re-encoding)',
  '1080': '1080p (Full HD)',
  '720': '720p (HD)',
  '480': '480p (SD)',
  '360': '360p (Low)',
  '240': '240p (Lowest, fastest upload)',
};

const QUALITY_HEIGHT: Record<Exclude<VideoQuality, 'original'>, number> = {
  '1080': 1080,
  '720': 720,
  '480': 480,
  '360': 360,
  '240': 240,
};

// Approximate target bitrates (bits per second) per quality.
// Tuned for a good size/quality tradeoff for typical content.
const QUALITY_BITRATE: Record<Exclude<VideoQuality, 'original'>, number> = {
  '1080': 4_500_000,
  '720': 2_500_000,
  '480': 1_200_000,
  '360': 700_000,
  '240': 400_000,
};

const pickMimeType = (): string => {
  const candidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];
  for (const m of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) {
      return m;
    }
  }
  return 'video/webm';
};

export interface TranscodeOptions {
  quality: VideoQuality;
  onProgress?: (progress: number) => void; // 0..1
}

export const transcodeVideoFile = async (
  file: File,
  { quality, onProgress }: TranscodeOptions
): Promise<File> => {
  // No work to do
  if (quality === 'original') return file;
  if (!file.type.startsWith('video/')) return file;

  // Capability check
  if (
    typeof MediaRecorder === 'undefined' ||
    typeof HTMLCanvasElement.prototype.captureStream !== 'function'
  ) {
    console.warn('Browser does not support in-browser transcoding; uploading original.');
    return file;
  }

  const targetHeight = QUALITY_HEIGHT[quality];
  const targetBitrate = QUALITY_BITRATE[quality];

  // Set up the source video element
  const sourceUrl = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.src = sourceUrl;
  video.muted = false;
  video.playsInline = true;
  video.crossOrigin = 'anonymous';
  video.preload = 'auto';

  await new Promise<void>((resolve, reject) => {
    video.onloadedmetadata = () => resolve();
    video.onerror = () => reject(new Error('Failed to load source video for transcoding.'));
  });

  const srcWidth = video.videoWidth;
  const srcHeight = video.videoHeight;
  if (!srcWidth || !srcHeight) {
    URL.revokeObjectURL(sourceUrl);
    throw new Error('Could not read source video dimensions.');
  }

  // If source is already smaller than target, no point re-encoding.
  if (srcHeight <= targetHeight) {
    URL.revokeObjectURL(sourceUrl);
    return file;
  }

  const scale = targetHeight / srcHeight;
  // Keep dimensions even (some encoders require it)
  const outWidth = Math.max(2, Math.floor((srcWidth * scale) / 2) * 2);
  const outHeight = Math.max(2, Math.floor(targetHeight / 2) * 2);

  const canvas = document.createElement('canvas');
  canvas.width = outWidth;
  canvas.height = outHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(sourceUrl);
    throw new Error('Could not create 2D canvas context for transcoding.');
  }

  // Build the output stream: video from canvas + audio from video element
  const fps = 30;
  const canvasStream = (canvas as HTMLCanvasElement).captureStream(fps);

  // Try to capture audio track from the video element.
  let audioTracks: MediaStreamTrack[] = [];
  try {
    // captureStream is non-standard but widely supported on HTMLMediaElement.
    const mediaEl = video as HTMLVideoElement & {
      captureStream?: () => MediaStream;
      mozCaptureStream?: () => MediaStream;
    };
    const elStream =
      mediaEl.captureStream?.() ?? mediaEl.mozCaptureStream?.();
    if (elStream) {
      audioTracks = elStream.getAudioTracks();
      audioTracks.forEach((t) => canvasStream.addTrack(t));
    }
  } catch (err) {
    console.warn('Could not capture audio for transcoded video:', err);
  }

  const mimeType = pickMimeType();
  const recorder = new MediaRecorder(canvasStream, {
    mimeType,
    videoBitsPerSecond: targetBitrate,
    audioBitsPerSecond: 128_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const recorded: Promise<Blob> = new Promise((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
    recorder.onerror = (e) => reject((e as ErrorEvent).error || new Error('Recorder error'));
  });

  // Drive frames onto the canvas while the video plays
  let rafId = 0;
  const drawFrame = () => {
    if (video.paused || video.ended) return;
    ctx.drawImage(video, 0, 0, outWidth, outHeight);
    if (onProgress && video.duration > 0) {
      onProgress(Math.min(1, video.currentTime / video.duration));
    }
    rafId = requestAnimationFrame(drawFrame);
  };

  recorder.start(1000);
  try {
    await video.play();
  } catch (err) {
    recorder.stop();
    URL.revokeObjectURL(sourceUrl);
    throw new Error('Could not start playback for transcoding. Try using the original quality.');
  }
  drawFrame();

  await new Promise<void>((resolve) => {
    video.onended = () => resolve();
  });

  cancelAnimationFrame(rafId);
  // Flush a final frame so the last second isn't dropped
  ctx.drawImage(video, 0, 0, outWidth, outHeight);
  recorder.stop();
  audioTracks.forEach((t) => t.stop());
  canvasStream.getTracks().forEach((t) => t.stop());

  const blob = await recorded;
  URL.revokeObjectURL(sourceUrl);

  if (onProgress) onProgress(1);

  // Build a new File preserving the base name but with .webm extension
  const baseName = file.name.replace(/\.[^.]+$/, '');
  const outName = `${baseName}-${quality}p.webm`;
  return new File([blob], outName, { type: mimeType, lastModified: Date.now() });
};
