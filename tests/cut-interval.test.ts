// bun test tests/cut-interval.test.ts

import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import ffmpegHandler from '../nodes/VideoMzz/src/handlers/ffmpegHandler';

describe('FfmpegHandler.cutAdvanced - Split by Interval Mode', () => {
  const sampleVideo = readFileSync(path.join(__dirname, 'fixtures', 'sample.mp4'));

  it('should split by interval', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'interval',
      interval: 15
    });
    
    expect(Array.isArray(result)).toBe(true);
    expect((result as Buffer[]).length).toBeGreaterThan(1);
    
    (result as Buffer[]).forEach((buffer, index) => {
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(1000);
      writeFileSync(path.join(__dirname, 'output', `cut_interval_${index + 1}.mp4`), buffer);
    });
  }, 25000);

  it('should split by small interval', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'interval',
      interval: 5
    });
    
    expect(Array.isArray(result)).toBe(true);
    expect((result as Buffer[]).length).toBeGreaterThan(2);
    
    (result as Buffer[]).forEach((buffer, index) => {
      expect(buffer).toBeInstanceOf(Buffer);
      writeFileSync(path.join(__dirname, 'output', `cut_interval_5s_${index + 1}.mp4`), buffer);
    });
  }, 30000);
});