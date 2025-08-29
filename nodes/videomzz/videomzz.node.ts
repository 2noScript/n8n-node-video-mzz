/* eslint-disable n8n-nodes-base/node-class-description-icon-not-svg */
/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */

import {
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
export class VideoEditorStatic implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Video Editor (ffmpeg-static)',
		name: 'videoEditorStatic',
		icon: 'file:video-ico.png',
		group: ['transform'],
		version: 1,
		description: 'Edit video files using ffmpeg (static or global)',
		defaults: {
			name: 'Video Editor',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Start Time (seconds)',
				name: 'startTime',
				type: 'number',
				default: 0,
				description: 'Start time to cut video',
			},
			{
				displayName: 'Duration (seconds)',
				name: 'duration',
				type: 'number',
				default: 10,
				description: 'Duration of output video',
			},
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();

		const returnData: INodeExecutionData[] = [];

		return [returnData];
	}
}
