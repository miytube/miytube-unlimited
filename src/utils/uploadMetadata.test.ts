/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getPerFileTags } from './uploadMetadata';

test('batch upload does not copy tags auto-filled from the first file onto other files', () => {
  const a = new File([''], "They Shouldn't Have Been Flying.mp4");
  const b = new File([''], 'Learjet 60 NTSB Breakup.mp4');
  const tags = getPerFileTags(b, 'Learjet 60 NTSB Breakup', ['They', 'Shouldn', 'Have', 'miytube'], 2, [a, b]);
  assert.ok(!tags.includes('They'));
  assert.ok(tags.includes('miytube'));
  assert.ok(tags.includes('learjet'));
});
