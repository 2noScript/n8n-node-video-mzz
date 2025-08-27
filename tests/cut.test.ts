// bun test tests/cut.test.ts

import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import ffmpegHandler from '../nodes/videomzz/handlers/ffmpegHandler';


describe('FfmpegHandler.cut', () => {
  const sampleVideo = readFileSync(path.join(__dirname, 'fixtures', 'sample.mp4'));

  it('should cut first 3 seconds of the video', async () => {
    const result = await ffmpegHandler.cut(sampleVideo, 0, 30);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(1000);

    writeFileSync(path.join(__dirname, 'output', 'cut_output.mp4'), result);
  }, 10000);
});
