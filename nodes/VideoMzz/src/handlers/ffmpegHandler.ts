import { spawn, execSync } from 'child_process';
import { Writable } from 'stream';
import ffmpegStatic from 'ffmpeg-static';
interface CutOptions {
	mode: 'range' | 'duration' | 'keep' | 'remove' | 'interval' | 'count';
	// Cho mode 'range'
	start?: number;
	end?: number;
	// Cho mode 'duration'
	duration?: number;
	// Cho mode 'keep' và 'remove'
	segments?: Array<{ start: number; end: number }>;
	// Cho mode 'interval'
	interval?: number;
	// Cho mode 'count'
	count?: number;
}

class FfmpegHandler {
	private ffmpegPath: string;

	constructor() {
		try {
			execSync('ffmpeg -version', { stdio: 'ignore' });
			this.ffmpegPath = 'ffmpeg';
			console.log('Using system FFmpeg');
		} catch {
			this.ffmpegPath = ffmpegStatic!;
			console.log('Using bundled FFmpeg');
		}
	}

	private async _run(input: Buffer, args: string): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			if (!this.ffmpegPath) {
				return reject(new Error('FFmpeg path not initialized'));
			}

			const argsArray = args.trim().split(/\s+/);
			const finalArgs = argsArray.includes('-i') ? argsArray : ['-i', 'pipe:0', ...argsArray];

			const ffmpeg = spawn(this.ffmpegPath, finalArgs);
			const chunks: Buffer[] = [];

			ffmpeg.stdout.on('data', (chunk: Buffer) => {
				chunks.push(chunk);
			});

			ffmpeg.stderr.on('data', (data: Buffer) => {
				console.error('ffmpeg stderr:', data.toString());
			});

			ffmpeg.on('error', (err) => {
				reject(new Error(`FFmpeg process error: ${err.message}`));
			});

			ffmpeg.on('close', (code) => {
				if (code === 0) {
					resolve(Buffer.concat(chunks as any));
				} else {
					reject(new Error(`FFmpeg exited with code ${code}`));
				}
			});

			if (ffmpeg.stdin) {
				ffmpeg.stdin.write(input);
				ffmpeg.stdin.end();
			} else {
				reject(new Error('FFmpeg stdin not available'));
			}
		});
	}

	// Interface cho các tùy chọn cắt video

	// Hàm cut cũ (giữ lại để tương thích ngược)
	cut(input: Buffer, start: number, duration: number) {
		const args = `-i pipe:0 -ss ${start} -t ${duration} -c:v libx264 -preset ultrafast -crf 23 -c:a aac -avoid_negative_ts make_zero -movflags frag_keyframe+empty_moov -f mp4 pipe:1`;
		return this._run(input, args);
	}

	// Hàm cut mới với nhiều chế độ
	async cutAdvanced(input: Buffer, options: CutOptions): Promise<Buffer | Buffer[]> {
		switch (options.mode) {
			case 'range':
				return this.cutByRange(input, options.start!, options.end!);

			case 'duration':
				return this.cutByDuration(input, options.start!, options.duration!);

			case 'keep':
				return this.keepSegments(input, options.segments!);

			case 'remove':
				return this.removeSegments(input, options.segments!);

			case 'interval':
				return this.splitByInterval(input, options.interval!);

			case 'count':
				return this.splitByCount(input, options.count!);

			default:
				throw new Error('Invalid cut mode');
		}
	}

	//  (start - end)
	private cutByRange(input: Buffer, start: number, end: number): Promise<Buffer> {
		const duration = end - start;
		const args = `-i pipe:0 -ss ${start} -t ${duration} -c:v libx264 -preset ultrafast -crf 23 -c:a aac -avoid_negative_ts make_zero -movflags frag_keyframe+empty_moov -f mp4 pipe:1`;
		return this._run(input, args);
	}

	// (start + duration)
	private cutByDuration(input: Buffer, start: number, duration: number): Promise<Buffer> {
		const args = `-i pipe:0 -ss ${start} -t ${duration} -c:v libx264 -preset ultrafast -crf 23 -c:a aac -avoid_negative_ts make_zero -movflags frag_keyframe+empty_moov -f mp4 pipe:1`;
		return this._run(input, args);
	}

	private async keepSegments(
		input: Buffer,
		segments: Array<{ start: number; end: number }>,
	): Promise<Buffer[]> {
		const results: Buffer[] = [];

		for (const segment of segments) {
			const duration = segment.end - segment.start;
			const args = `-i pipe:0 -ss ${segment.start} -t ${duration} -c:v libx264 -preset ultrafast -crf 23 -c:a aac -avoid_negative_ts make_zero -movflags frag_keyframe+empty_moov -f mp4 pipe:1`;
			const result = await this._run(input, args);
			results.push(result);
		}

		return results;
	}

	private async removeSegments(
		input: Buffer,
		segments: Array<{ start: number; end: number }>,
	): Promise<Buffer[]> {
		const sortedSegments = segments.sort((a, b) => a.start - b.start);
		const results: Buffer[] = [];

		const durationInfo = await this.getVideoDuration(input);
		const totalDuration = durationInfo;

		let currentTime = 0;

		for (const segment of sortedSegments) {
			if (currentTime < segment.start) {
				const duration = segment.start - currentTime;
				const args = `-i pipe:0 -ss ${currentTime} -t ${duration} -c:v libx264 -preset ultrafast -crf 23 -c:a aac -avoid_negative_ts make_zero -movflags frag_keyframe+empty_moov -f mp4 pipe:1`;
				const result = await this._run(input, args);
				results.push(result);
			}
			currentTime = segment.end;
		}

		if (currentTime < totalDuration) {
			const duration = totalDuration - currentTime;
			const args = `-i pipe:0 -ss ${currentTime} -t ${duration} -c:v libx264 -preset ultrafast -crf 23 -c:a aac -avoid_negative_ts make_zero -movflags frag_keyframe+empty_moov -f mp4 pipe:1`;
			const result = await this._run(input, args);
			results.push(result);
		}

		return results;
	}

	private async splitByInterval(input: Buffer, interval: number): Promise<Buffer[]> {
		const durationInfo = await this.getVideoDuration(input);
		const totalDuration = durationInfo;
		const results: Buffer[] = [];

		let currentTime = 0;
		while (currentTime < totalDuration) {
			const remainingTime = totalDuration - currentTime;
			const segmentDuration = Math.min(interval, remainingTime);

			const args = `-i pipe:0 -ss ${currentTime} -t ${segmentDuration} -c:v libx264 -preset ultrafast -crf 23 -c:a aac -avoid_negative_ts make_zero -movflags frag_keyframe+empty_moov -f mp4 pipe:1`;
			const result = await this._run(input, args);
			results.push(result);

			currentTime += interval;
		}

		return results;
	}

	private async splitByCount(input: Buffer, count: number): Promise<Buffer[]> {
		const durationInfo = await this.getVideoDuration(input);
		const totalDuration = durationInfo;
		const segmentDuration = totalDuration / count;
		const results: Buffer[] = [];

		for (let i = 0; i < count; i++) {
			const start = i * segmentDuration;
			const duration = i === count - 1 ? totalDuration - start : segmentDuration;

			const args = `-i pipe:0 -ss ${start} -t ${duration} -c:v libx264 -preset ultrafast -crf 23 -c:a aac -avoid_negative_ts make_zero -movflags frag_keyframe+empty_moov -f mp4 pipe:1`;
			const result = await this._run(input, args);
			results.push(result);
		}

		return results;
	}

	private async getVideoDuration(input: Buffer): Promise<number> {
		return new Promise((resolve, reject) => {
			const args = '-i pipe:0 -f null -'.split(' ');
			const ffmpeg = spawn(this.ffmpegPath, args);

			let stderrData = '';

			ffmpeg.stderr.on('data', (data: Buffer) => {
				stderrData += data.toString();
			});

			ffmpeg.on('close', () => {
				const durationMatch = stderrData.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
				if (durationMatch) {
					const hours = parseInt(durationMatch[1]);
					const minutes = parseInt(durationMatch[2]);
					const seconds = parseFloat(durationMatch[3]);
					const totalSeconds = hours * 3600 + minutes * 60 + seconds;
					resolve(totalSeconds);
				} else {
					reject(new Error('Could not parse video duration'));
				}
			});

			ffmpeg.on('error', (err) => {
				reject(new Error(`FFmpeg process error: ${err.message}`));
			});

			if (ffmpeg.stdin) {
				ffmpeg.stdin.write(input);
				ffmpeg.stdin.end();
			} else {
				reject(new Error('FFmpeg stdin not available'));
			}
		});
	}

	resize(input: Buffer, width: number, height: number) {
		const args = `-i pipe:0 -vf scale=${width}:${height} -c:v libx264 -c:a aac -movflags frag_keyframe+empty_moov -f mp4 pipe:1`;
		return this._run(input, args);
	}

	crop(input: Buffer, w: number, h: number, x: number, y: number) {
		const args = `-i pipe:0 -vf crop=${w}:${h}:${x}:${y} -c:v libx264 -c:a aac -movflags frag_keyframe+empty_moov -f mp4 pipe:1`;
		return this._run(input, args);
	}

	mute(input: Buffer) {
		const args = `-i pipe:0 -an -c:v copy -movflags frag_keyframe+empty_moov -f mp4 pipe:1`;
		return this._run(input, args);
	}

	// async replaceAudio(video: Buffer, audio: Buffer): Promise<Buffer> {
	// 	return new Promise((resolve, reject) => {
	// 		const args =
	// 			'-i pipe:0 -i pipe:3 -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 -movflags frag_keyframe+empty_moov -f mp4 pipe:1';

	// 		const ffmpeg = spawn(this.ffmpegPath, args.split(' '), {
	// 			stdio: ['pipe', 'pipe', 'pipe', 'pipe'],
	// 		});

	// 		const chunks: Buffer[] = [];

	// 		ffmpeg.stdout.on('data', (chunk: Buffer) => {
	// 			chunks.push(chunk);
	// 		});

	// 		ffmpeg.stderr.on('data', (data: Buffer) => {
	// 			console.error('ffmpeg stderr:', data.toString());
	// 		});

	// 		ffmpeg.on('error', (err) => {
	// 			reject(new Error(`FFmpeg process error: ${err.message}`));
	// 		});

	// 		ffmpeg.on('close', (code) => {
	// 			if (code === 0) {
	// 				resolve(Buffer.concat(chunks as any));
	// 			} else {
	// 				reject(new Error(`FFmpeg exited with code ${code}`));
	// 			}
	// 		});

	// 		if (ffmpeg.stdin) {
	// 			ffmpeg.stdin.write(video);
	// 			ffmpeg.stdin.end();
	// 		} else {
	// 			reject(new Error('Video input pipe not available'));
	// 			return;
	// 		}

	// 		const audioPipe = ffmpeg.stdio[3] as Writable | undefined;
	// 		if (audioPipe) {
	// 			audioPipe.write(audio);
	// 			audioPipe.end();
	// 		} else {
	// 			reject(new Error('Audio pipe not available'));
	// 		}
	// 	});
	// }

	changeSpeed(input: Buffer, factor: number) {
		const args = `-i pipe:0 -filter:v setpts=${1 / factor}*PTS -c:v libx264 -an -movflags frag_keyframe+empty_moov -f mp4 pipe:1`;
		return this._run(input, args);
	}

	addWatermark(input: Buffer, watermarkPath: string, x: number, y: number) {
		const args = `-i pipe:0 -i "${watermarkPath}" -filter_complex overlay=${x}:${y} -c:v libx264 -c:a aac -movflags frag_keyframe+empty_moov -f mp4 pipe:1`;
		return this._run(input, args);
	}

	thumbnail(input: Buffer, at: number = 1) {
		const args = `-i pipe:0 -ss ${at} -frames:v 1 -f image2 pipe:1`;
		return this._run(input, args);
	}

	extractAudio(input: Buffer) {
		const args = '-i pipe:0 -vn -c:a aac -f mp3 pipe:1';
		return this._run(input, args);
	}
}

const ffmpegHandler = new FfmpegHandler();

export default ffmpegHandler;
