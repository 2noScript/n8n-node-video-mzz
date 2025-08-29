// bun test tests/cut-remove.test.ts

import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import ffmpegHandler from '../nodes/VideoMzz/src/handlers/ffmpegHandler';

describe('FfmpegHandler.cutAdvanced - Remove Segments Mode', () => {
  const sampleVideo = readFileSync(path.join(__dirname, 'fixtures', 'sample.mp4'));

  it('should remove segments and return leftovers', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'remove',
      segments: [
        { start: 10, end: 15 },
        { start: 25, end: 30 }
      ]
    });
    
    expect(Array.isArray(result)).toBe(true);
    expect((result as Buffer[]).length).toBeGreaterThan(0);
    
    (result as Buffer[]).forEach((buffer, index) => {
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(1000);
      writeFileSync(path.join(__dirname, 'output', `cut_remove_leftover_${index + 1}.mp4`), buffer);
    });
  }, 20000);

  it('should remove middle segment', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'remove',
      segments: [
        { start: 15, end: 20 }
      ]
    });
    
    expect(Array.isArray(result)).toBe(true);
    expect((result as Buffer[]).length).toBe(2); // Before and after the removed segment
    
    (result as Buffer[]).forEach((buffer, index) => {
      expect(buffer).toBeInstanceOf(Buffer);
      writeFileSync(path.join(__dirname, 'output', `cut_remove_middle_${index + 1}.mp4`), buffer);
    });
  }, 20000);
});