/* eslint-disable n8n-nodes-base/node-class-description-missing-subtitle */
/* eslint-disable n8n-nodes-base/node-class-description-icon-not-svg */
/* eslint-disable n8n-nodes-base/node-param-display-name-miscased */

import {
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { videoFields, videoOperations } from './src/description/videoDescription';
import videoHandler from './src/handlers/videoHandler';

export class VideoMzz implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'VideoMzz',
		name: 'videoMzz',
		icon: 'file:video-ico.png',
		group: ['input'],
		version: 1,
		description: 'Video Editing',
		defaults: {
			name: 'Video Editor',
		},
		usableAsTool: true,
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Video',
						value: 'video',
					},
				],
				default: 'video',
			},
			...videoOperations,
			...videoFields,
		],
	};

	async execute(this: IExecuteFunctions) {
		const returnData: INodeExecutionData[] = [];

		try {
			const result = await videoHandler.runTask(this);
			returnData.push(result);
		} catch (error) {
			if (this.continueOnFail()) {
				const executionErrorData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray({ error: error.message }),
					{ itemData: { item: 0 } },
				);
				returnData.push(...executionErrorData);
			}
			throw error;
		}

		return [returnData];
	}
}
