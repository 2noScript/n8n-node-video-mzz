// bun test tests/cut-duration.test.ts

import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import ffmpegHandler from '../nodes/VideoMzz/src/handlers/ffmpegHandler';

describe('FfmpegHandler.cutAdvanced - Duration Mode', () => {
  const sampleVideo = readFileSync(path.join(__dirname, 'fixtures', 'sample.mp4'));

  it('should cut by duration', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'duration',
      start: 10,
      duration: 20
    });
    
    expect(result).toBeInstanceOf(Buffer);
    expect((result as Buffer).length).toBeGreaterThan(1000);
    
    writeFileSync(path.join(__dirname, 'output', 'cut_duration_output.mp4'), result as Buffer);
  }, 15000);

  it('should cut short duration from beginning', async () => {
    const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
      mode: 'duration',
      start: 0,
      duration: 5
    });
    
    expect(result).toBeInstanceOf(Buffer);
    expect((result as Buffer).length).toBeGreaterThan(1000);
    
    writeFileSync(path.join(__dirname, 'output', 'cut_duration_short_output.mp4'), result as Buffer);
  }, 15000);
});