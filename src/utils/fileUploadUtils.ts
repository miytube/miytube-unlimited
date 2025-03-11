
/**
 * Creates a FileList from an array of Files
 * This is useful for programmatically setting the files property of an input element
 */
export const createFileList = (files: File[]): FileList => {
  const dataTransfer = new DataTransfer();
  files.forEach(file => dataTransfer.items.add(file));
  return dataTransfer.files;
};

/**
 * Triggers the file input change event with the provided files
 */
export const triggerFileInputChangeEvent = (
  fileInputRef: React.RefObject<HTMLInputElement>,
  files: File[]
): void => {
  if (fileInputRef.current) {
    fileInputRef.current.files = createFileList(files);
    const event = new Event('change', { bubbles: true });
    fileInputRef.current.dispatchEvent(event);
  }
};
