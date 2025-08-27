// import { readFileSync, writeFileSync } from 'fs';
// import path from 'path';
// import { FfmpegHandler } from '../src/ffmpegHandler';

// describe('FfmpegHandler.replaceAudio', () => {
//   const ffmpeg = new FfmpegHandler();
//   const sampleVideo = readFileSync(path.join(__dirname, 'fixtures', 'sample.mp4'));
//   const sampleAudio = readFileSync(path.join(__dirname, 'fixtures', 'sample.mp3'));

//   it('should replace video audio track', async () => {
//     const result = await ffmpeg.replaceAudio(sampleVideo, sampleAudio);
//     expect(result).toBeInstanceOf(Buffer);
//     expect(result.length).toBeGreaterThan(1000);

//     writeFileSync(path.join(__dirname, 'fixtures', 'replace_audio_output.mp4'), result);
//   }, 20000); // ffmpeg chạy lâu hơn
// });
