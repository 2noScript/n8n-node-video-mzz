// bun test tests/cut-keep.test.ts

import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import ffmpegHandler from '../nodes/VideoMzz/src/handlers/ffmpegHandler';

describe('FfmpegHandler.cutAdvanced - Keep Segments Mode', () => {
  const sampleVideo = readFileSync(path.join(__dirname, 'fixtures', 'sample.mp4'));

  it('should keep multiple segments', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'keep',
      segments: [
        { start: 5, end: 10 },
        { start: 15, end: 20 },
        { start: 25, end: 30 }
      ]
    });
    
    expect(Array.isArray(result)).toBe(true);
    expect((result as Buffer[]).length).toBe(3);
    
    (result as Buffer[]).forEach((buffer, index) => {
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(1000);
      writeFileSync(path.join(__dirname, 'output', `cut_keep_segment_${index + 1}.mp4`), buffer);
    });
  }, 20000);

  it('should keep single segment', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'keep',
      segments: [
        { start: 0, end: 5 }
      ]
    });
    
    expect(Array.isArray(result)).toBe(true);
    expect((result as Buffer[]).length).toBe(1);
    expect((result as Buffer[])[0]).toBeInstanceOf(Buffer);
    
    writeFileSync(path.join(__dirname, 'output', 'cut_keep_single_segment.mp4'), (result as Buffer[])[0]);
  }, 15000);
});