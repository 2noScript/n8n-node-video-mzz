import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import ffmpegHandler from '../nodes/VideoMzz/src/handlers/ffmpegHandler';

describe('FfmpegHandler.crop', () => {
  const sampleVideo = readFileSync(path.join(__dirname, 'fixtures', 'sample.mp4'));

  it('should crop 320x180 from top-left', async () => {
    const result = await ffmpegHandler.crop(sampleVideo, 320, 180, 0, 0);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(1000);

    writeFileSync(path.join(__dirname, 'fixtures', 'crop_output.mp4'), result);
  }, 10000);
});
