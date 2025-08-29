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

  it('should split by count = 1', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'count',
      count: 1
    });
    
    expect(Array.isArray(result)).toBe(true);
    expect((result as Buffer[]).length).toBe(1);
    expect((result as Buffer[])[0]).toBeInstanceOf(Buffer);
    
    writeFileSync(path.join(__dirname, 'output', 'cut_count_1_output.mp4'), (result as Buffer[])[0]);
  }, 15000);

  it('should split by large count', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'count',
      count: 10
    });
    
    expect(Array.isArray(result)).toBe(true);
    expect((result as Buffer[]).length).toBe(10);
    
    (result as Buffer[]).forEach((buffer, index) => {
      expect(buffer).toBeInstanceOf(Buffer);
      writeFileSync(path.join(__dirname, 'output', `cut_count_10_${index + 1}.mp4`), buffer);
    });
  }, 30000);
});