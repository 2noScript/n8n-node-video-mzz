// bun test tests/resize.test.ts
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import ffmpegHandler from '../nodes/VideoMzz/src/handlers/ffmpegHandler';


describe('FfmpegHandler.resize', () => {
  const sampleVideo = readFileSync(path.join(__dirname, 'fixtures', 'sample.mp4'));

  it('should resize video to 640x360', async () => {
    const result = await ffmpegHandler.resize(sampleVideo, 640, 360);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(1000);

    writeFileSync(path.join(__dirname, 'output', 'resize_output.mp4'), result);
  }, 10000);
});
