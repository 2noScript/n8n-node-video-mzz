// bun test tests/cut-edge-cases.test.ts

import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import ffmpegHandler from '../nodes/VideoMzz/src/handlers/ffmpegHandler';

describe('FfmpegHandler.cutAdvanced - Edge Cases', () => {
  const sampleVideo = readFileSync(path.join(__dirname, 'fixtures', 'sample.mp4'));

  it('should throw error for invalid mode', async () => {
    await expect(ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'invalid' as any
    })).rejects.toThrow('Invalid cut mode');
  });

  it('should handle zero duration', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'duration',
      start: 0,
      duration: 0
    });
    
    expect(result).toBeInstanceOf(Buffer);
  }, 10000);

  it('should handle empty segments array for keep mode', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'keep',
      segments: []
    });
    
    expect(Array.isArray(result)).toBe(true);
    expect((result as Buffer[]).length).toBe(0);
  }, 10000);

  it('should handle empty segments array for remove mode', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'remove',
      segments: []
    });
    
    expect(Array.isArray(result)).toBe(true);
    expect((result as Buffer[]).length).toBe(1); // Should return the whole video
  }, 15000);

  it('should handle overlapping segments', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'keep',
      segments: [
        { start: 5, end: 15 },
        { start: 10, end: 20 } // Overlapping with previous
      ]
    });
    
    expect(Array.isArray(result)).toBe(true);
    expect((result as Buffer[]).length).toBe(2);
    
    (result as Buffer[]).forEach((buffer, index) => {
      expect(buffer).toBeInstanceOf(Buffer);
      writeFileSync(path.join(__dirname, 'output', `cut_overlapping_${index + 1}.mp4`), buffer);
    });
  }, 20000);

  it('should handle very large interval', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'interval',
      interval: 1000 // Larger than video duration
    });
    
    expect(Array.isArray(result)).toBe(true);
    expect((result as Buffer[]).length).toBe(1); // Should return one segment (whole video)
  }, 15000);
});