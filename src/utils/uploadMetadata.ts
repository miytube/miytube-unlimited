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