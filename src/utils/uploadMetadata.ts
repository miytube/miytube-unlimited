export const getFileBaseName = (file: File): string =>
  file.name.split('.').slice(0, -1).join('.').trim() || file.name;

export const getPerFileUploadMetadata = (
  file: File,
  enteredTitle: string,
  enteredDescription: string,
  totalFiles: number,
) => {
  const fileBaseName = getFileBaseName(file);
  const isBatch = totalFiles > 1;

  return {
    title: isBatch ? fileBaseName : (enteredTitle.trim() || fileBaseName),
    description: isBatch ? '' : enteredDescription.trim(),
  };
};

const STOPWORDS = new Set([
  'the','and','for','with','from','this','that','your','you','are','was','were','have','has','will',
  'into','out','about','over','under','then','than','their','them','they','our','its','it\'s','a','an',
  'of','to','in','on','at','by','or','as','is','be','vs','via','mp4','mov','mkv','webm','avi','flv',
  'video','videos','clip','clips','final','draft','copy','official','part','pt','full','hd','hq','4k','1080p','720p',
]);

export const deriveTagsFromTitle = (title: string, max = 6): string[] => {
  if (!title) return [];
  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w) && !/^\d+$/.test(w));
  const unique: string[] = [];
  for (const w of words) {
    if (!unique.includes(w)) unique.push(w);
    if (unique.length >= max) break;
  }
  return unique;
};

export const getPerFileTags = (
  file: File,
  perFileTitle: string,
  commonTags: string[] | undefined,
  totalFiles: number,
): string[] => {
  if (totalFiles <= 1) return commonTags ?? [];
  const derived = deriveTagsFromTitle(perFileTitle || getFileBaseName(file));
  const base = commonTags ?? [];
  const merged: string[] = [];
  for (const t of [...derived, ...base]) {
    const v = t.trim();
    if (v && !merged.includes(v)) merged.push(v);
  }
  return merged;
};