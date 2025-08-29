// bun test tests/cut.test.ts

import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import ffmpegHandler from '../nodes/VideoMzz/src/handlers/ffmpegHandler';


describe('FfmpegHandler.cut', () => {
  const sampleVideo = readFileSync(path.join(__dirname, 'fixtures', 'sample.mp4'));

  it('should cut first 30 seconds of the video', async () => {
    const result = await ffmpegHandler.cut(sampleVideo, 0, 30);
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBeGreaterThan(1000);

    writeFileSync(path.join(__dirname, 'output', 'cut_output.mp4'), result);
  }, 10000);

  describe('cutAdvanced', () => {
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

    it('should remove segments and return leftovers', async () => {
      const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
        mode: 'remove',
        segments: [
          { start: 10, end: 15 },
          { start: 25, end: 30 }
        ]
      });
      
      expect(Array.isArray(result)).toBe(true);
      expect((result as Buffer[]).length).toBeGreaterThan(0);
      
      (result as Buffer[]).forEach((buffer, index) => {
        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(1000);
        writeFileSync(path.join(__dirname, 'output', `cut_remove_leftover_${index + 1}.mp4`), buffer);
      });
    }, 20000);

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

    it('should throw error for invalid mode', async () => {
      await expect(ffmpegHandler.cutAdvanced(sampleVideo, {
        mode: 'invalid' as any
      })).rejects.toThrow('Invalid cut mode');
    });

    it('should handle edge cases - zero duration', async () => {
      const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
        mode: 'duration',
        start: 0,
        duration: 0
      });
      
      expect(result).toBeInstanceOf(Buffer);
      // Video với duration 0 vẫn có thể tạo ra buffer nhỏ
    }, 10000);

    it('should handle edge cases - single segment keep', async () => {
      const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
        mode: 'keep',
        segments: [
          { start: 0, end: 5 }
        ]
      });
      
      expect(Array.isArray(result)).toBe(true);
      expect((result as Buffer[]).length).toBe(1);
      expect((result as Buffer[])[0]).toBeInstanceOf(Buffer);
    }, 15000);

    it('should handle edge cases - split by count = 1', async () => {
      const result = await ffmpegHandler.cutAdvanced(sampleVideo, {
        mode: 'count',
        count: 1
      });
      
      expect(Array.isArray(result)).toBe(true);
      expect((result as Buffer[]).length).toBe(1);
      expect((result as Buffer[])[0]).toBeInstanceOf(Buffer);
    }, 15000);
  });
});
