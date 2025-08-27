import { execFile, execSync, spawn } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';

class FfmpegHandler {
	private ffmpegPath: string;

	constructor() {
		try {
			execSync('ffmpeg -version');
			this.ffmpegPath = 'ffmpeg';
		} catch {
			this.ffmpegPath = ffmpegStatic as string;
		}
	}

	private async _run(input: Buffer, args: string[]): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const ffmpeg = spawn(this.ffmpegPath, [...args, 'pipe:1']);
			const chunks: Buffer[] = [];

			ffmpeg.stdout.on('data', (c) => chunks.push(c));
			ffmpeg.stderr.on('data', (d) => console.error('ffmpeg:', d.toString()));
			ffmpeg.on('close', (code) =>
				code === 0 ? resolve(Buffer.concat(chunks as any)) : reject(new Error(`ffmpeg exited ${code}`)),
			);

			ffmpeg.stdin.write(input);
			ffmpeg.stdin.end();
		});
	}

	cut(input: Buffer, start: number, duration: number) {
		const args = [
			'-ss',
			String(start),
			'-t',
			String(duration),
			'-i',
			'pipe:0',
			'-c:v',
			'libx264',
			'-c:a',
			'aac',
			'-f',
			'mp4',
		];
		return this._run(input, args);
	}

	resize(input: Buffer, width: number, height: number) {
		const args = [
			'-i',
			'pipe:0',
			'-vf',
			`scale=${width}:${height}`,
			'-c:v',
			'libx264',
			'-c:a',
			'aac',
			'-f',
			'mp4',
		];
		return this._run(input, args);
	}

	crop(input: Buffer, w: number, h: number, x: number, y: number) {
		const args = [
			'-i',
			'pipe:0',
			'-vf',
			`crop=${w}:${h}:${x}:${y}`,
			'-c:v',
			'libx264',
			'-c:a',
			'aac',
			'-f',
			'mp4',
		];
		return this._run(input, args);
	}

	mute(input: Buffer) {
		const args = ['-i', 'pipe:0', '-an', '-c:v', 'libx264', '-f', 'mp4'];
		return this._run(input, args);
	}

	// async replaceAudio(video: Buffer, audio: Buffer): Promise<Buffer> {
	// 	return new Promise((resolve, reject) => {
	// 		const args = [
	// 			'-i',
	// 			'pipe:0', // video input
	// 			'-i',
	// 			'pipe:3', // audio input (extra pipe)
	// 			'-c:v',
	// 			'copy', // giữ nguyên video
	// 			'-c:a',
	// 			'aac', // encode audio
	// 			'-map',
	// 			'0:v:0', // chọn video từ input 0
	// 			'-map',
	// 			'1:a:0', // chọn audio từ input 1
	// 			'-f',
	// 			'mp4',
	// 			'pipe:1',
	// 		];

	// 		// Khai báo stdio đầy đủ
	// 		const ffmpeg = spawn(this.ffmpegPath, args, {
	// 			stdio: ['pipe', 'pipe', 'pipe', 'pipe'], // thêm pipe cho audio
	// 		});

	// 		const chunks: Buffer[] = [];

	// 		ffmpeg.stdout.on('data', (c) => chunks.push(c));
	// 		ffmpeg.stderr.on('data', (d) => console.error('ffmpeg:', d.toString()));

	// 		ffmpeg.on('close', (code) => {
	// 			if (code === 0) {
	// 				resolve(Buffer.concat(chunks));
	// 			} else {
	// 				reject(new Error(`ffmpeg exited ${code}`));
	// 			}
	// 		});

	// 		// ⏺️ Ghi video vào stdin (pipe:0)
	// 		ffmpeg.stdin.write(video);
	// 		ffmpeg.stdin.end();

	// 		// ⏺️ Ghi audio vào pipe:3
	// 		const audioPipe = ffmpeg.stdio[3] as Writable;
	// 		if (!audioPipe) {
	// 			return reject(new Error('Audio pipe not available'));
	// 		}
	// 		audioPipe.write(audio);
	// 		audioPipe.end();
	// 	});
	// }
	changeSpeed(input: Buffer, factor: number) {
		// factor <1 = slow, >1 = fast
		const args = [
			'-i',
			'pipe:0',
			'-filter:v',
			`setpts=${1 / factor}*PTS`,
			'-c:v',
			'libx264',
			'-an',
			'-f',
			'mp4',
		];
		return this._run(input, args);
	}

	addWatermark(input: Buffer, watermarkPath: string, x: number, y: number) {
		const args = [
			'-i',
			'pipe:0',
			'-i',
			watermarkPath,
			'-filter_complex',
			`overlay=${x}:${y}`,
			'-c:v',
			'libx264',
			'-c:a',
			'aac',
			'-f',
			'mp4',
		];
		return this._run(input, args);
	}

	thumbnail(input: Buffer, at: number = 1) {
		const args = ['-ss', String(at), '-i', 'pipe:0', '-frames:v', '1', '-f', 'image2', 'pipe:1'];
		return this._run(input, args);
	}

	extractAudio(input: Buffer) {
		const args = ['-i', 'pipe:0', '-vn', '-c:a', 'aac', '-f', 'mp3'];
		return this._run(input, args);
	}
}

const ffmpegHandler = new FfmpegHandler();

export default ffmpegHandler;
