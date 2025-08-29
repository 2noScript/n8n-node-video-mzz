import { spawn, execSync } from 'child_process';
import { Writable } from 'stream';
import ffmpegStatic from 'ffmpeg-static';

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

	cut(input: Buffer, start: number, duration: number) {
		const args = `-i pipe:0 -ss ${start} -t ${duration} -c:v libx264 -preset ultrafast -crf 23 -c:a aac -avoid_negative_ts make_zero -movflags frag_keyframe+empty_moov -f mp4 pipe:1`;
		return this._run(input, args);
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
