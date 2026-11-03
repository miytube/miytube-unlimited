import { describe, it, expect } from 'vitest';
import { getPerFileTags } from './uploadMetadata';

describe('getPerFileTags batch', () => {
  it('does not copy tags auto-filled from the first file onto other files', () => {
    const a = new File([''], "They Shouldn't Have Been Flying.mp4");
    const b = new File([''], 'Learjet 60 NTSB Breakup.mp4');
    const tags = getPerFileTags(b, 'Learjet 60 NTSB Breakup', ['They', 'Shouldn', 'Have', 'miytube'], 2, [a, b]);
    expect(tags).not.toContain('They');
    expect(tags).toContain('miytube');
    expect(tags).toContain('learjet');
  });
});
