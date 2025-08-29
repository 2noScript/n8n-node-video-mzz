// bun test tests/cut-count.test.ts

import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import ffmpegHandler from '../nodes/VideoMzz/src/handlers/ffmpegHandler';

describe('FfmpegHandler.cutAdvanced - Split by Count Mode', () => {
  const sampleVideo = readFileSync(path.join(__dirname, 'fixtures', 'sample.mp4'));

  it('should split by count', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'count',
      count: 4
    });
    
    expect(Array.isArray(result)).toBe(true);
    expect((result as Buffer[]).length).toBe(4);
    
    (result as Buffer[]).forEach((buffer, index) => {
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(1000);
      writeFileSync(path.join(__dirname, 'output', `cut_count_${index + 1}.mp4`), buffer);
    });
  }, 25000);

});