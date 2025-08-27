// import { INodeType, INodeTypeDescription, IExecuteFunctions } from 'n8n-workflow';
// import { execFile, execSync } from 'child_process';
// import { readFileSync, writeFileSync } from 'fs';
// import * as tmp from 'tmp';
// import ffmpegStatic from 'ffmpeg-static';
// import { NodeConnectionType } from 'n8n-workflow';
// export class VideoEditorStatic implements INodeType {
// 	description: INodeTypeDescription = {
// 		displayName: 'Video Editor (ffmpeg-static)',
// 		name: 'videoEditorStatic',
// 		icon: 'file:video.svg',
// 		group: ['transform'],
// 		version: 1,
// 		description: 'Edit video files using ffmpeg (static or global)',
// 		defaults: {
// 			name: 'Video Editor',
// 			color: '#1F72E5',
// 		},
// 		inputs: [NodeConnectionType.Main],
// 		outputs: [NodeConnectionType.Main],
// 		properties: [
// 			{
// 				displayName: 'Start Time (seconds)',
// 				name: 'startTime',
// 				type: 'number',
// 				default: 0,
// 				description: 'Start time to cut video',
// 			},
// 			{
// 				displayName: 'Duration (seconds)',
// 				name: 'duration',
// 				type: 'number',
// 				default: 10,
// 				description: 'Duration of output video',
// 			},
// 		],
// 	};

// 	async execute(this: IExecuteFunctions) {
// 		const items = this.getInputData();
// 		const returnData = [];

// 		let ffmpegPath: string;
// 		try {
// 			execSync('ffmpeg -version');
// 			ffmpegPath = 'ffmpeg'; 
// 		} catch {
// 			ffmpegPath = ffmpegStatic as string; 
// 		}

// 		for (let i = 0; i < items.length; i++) {
// 			const binaryData = items[i].binary?.data;
// 			if (!binaryData) continue;

// 			const tmpInput = tmp.fileSync({ postfix: '.mp4' });
// 			const tmpOutput = tmp.fileSync({ postfix: '.mp4' });

// 			writeFileSync(tmpInput.name, binaryData.data);

// 			const startTime = this.getNodeParameter('startTime', i) as number;
// 			const duration = this.getNodeParameter('duration', i) as number;

// 			await new Promise<void>((resolve, reject) => {
// 				execFile(
// 					ffmpegPath,
// 					[
// 						'-ss',
// 						startTime.toString(),
// 						'-t',
// 						duration.toString(),
// 						'-i',
// 						tmpInput.name,
// 						'-c',
// 						'copy',
// 						tmpOutput.name,
// 					],
// 					(err) => {
// 						if (err) reject(err);
// 						else resolve();
// 					},
// 				);
// 			});

// 			const editedVideo = readFileSync(tmpOutput.name);

// 			returnData.push({
// 				json: {},
// 				binary: {
// 					data: {
// 						data: editedVideo,
// 						fileName: 'edited.mp4',
// 						mimeType: 'video/mp4',
// 					},
// 				},
// 			});
// 		}

// 		return this.prepareOutputData(returnData);
// 	}
// }
