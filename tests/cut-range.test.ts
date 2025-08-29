// bun test tests/cut-range.test.ts

import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import ffmpegHandler from '../nodes/VideoMzz/src/handlers/ffmpegHandler';

describe('FfmpegHandler.cutAdvanced - Range Mode', () => {
  const sampleVideo = readFileSync(path.join(__dirname, 'fixtures', 'sample.mp4'));

  it('should cut by range (start-end)', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'range',
      start: 5,
      end: 15
    });
    
    expect(result).toBeInstanceOf(Buffer);
    expect((result as Buffer).length).toBeGreaterThan(1000);
    
    writeFileSync(path.join(__dirname, 'output', 'cut_range_output.mp4'), result as Buffer);
  }, 15000);

  it('should cut by range with different time points', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'range',
      start: 10,
      end: 25
    });
    
    expect(result).toBeInstanceOf(Buffer);
    expect((result as Buffer).length).toBeGreaterThan(1000);
    
    writeFileSync(path.join(__dirname, 'output', 'cut_range_10_25_output.mp4'), result as Buffer);
  }, 15000);
});