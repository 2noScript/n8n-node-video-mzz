import { IExecuteFunctions, NodeConnectionType } from 'n8n-workflow';
import { INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import { execSync } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';

export class VideoMzzTest implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'videoMzzTest',
		name: 'videoMzzTest',
		group: ['utility'],
		version: 1,
		description: 'Test if FFmpeg works in this environment',
		defaults: { name: 'FFmpeg Test' },
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
        icon: 'file:video-ico.png',
		properties: [
			{
				displayName: 'Use System FFmpeg',
				name: 'useSystem',
				type: 'boolean',
				default: false,
				description: 'If true, use system-installed FFmpeg; otherwise use bundled ffmpeg-static',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const useSystem = this.getNodeParameter('useSystem', 0) as boolean;
		const ffmpegPath = useSystem ? 'ffmpeg' : ffmpegStatic!;

		let result = '';
		try {
			execSync(`${ffmpegPath} -version`, { stdio: 'pipe' });
			result = 'FFmpeg works!';
		} catch (err: any) {
			result = `FFmpeg error: ${err.message}`;
		}

		for (let i = 0; i < items.length; i++) {
			returnData.push({
				json: { ffmpegPath, result },
			});
		}

		return [returnData];
	}
}
