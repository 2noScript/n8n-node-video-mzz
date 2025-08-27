import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import ffmpegHandler from '../nodes/videomzz/handlers/ffmpegHandler';

describe('FfmpegHandler.mute', () => {
  const sampleVideo = readFileSync(path.join(__dirname, 'fixtures', 'sample.mp4'));

  it('should remove audio from video', async () => {
    const result = await ffmpegHandler.mute(sampleVideo);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(1000);

    writeFileSync(path.join(__dirname, 'fixtures', 'mute_output.mp4'), result);
  }, 10000);
});
