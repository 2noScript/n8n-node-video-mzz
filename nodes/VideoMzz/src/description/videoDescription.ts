/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */
/* eslint-disable n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options */
/* eslint-disable n8n-nodes-base/node-param-description-empty-string */
/* eslint-disable n8n-nodes-base/node-param-default-wrong-for-options */
/* eslint-disable n8n-nodes-base/node-param-type-options-max-value-present */
/* eslint-disable n8n-nodes-base/node-param-default-wrong-for-limit */
import type { INodeProperties } from 'n8n-workflow';

export const videoOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['video'],
			},
		},
		options: [
			{
				name: 'Cut',
				value: 'cut',
				description: 'Trim a video by specifying start and end time',
				action: 'Cut a video segment',
			},
			{
				name: 'Crop',
				value: 'crop',
				description: 'Crop a video by defining width, height, and position (x, y)',
				action: 'Crop a video frame',
			},
		],
		default: 'cut',
	},
];

const videoCutFields: INodeProperties[] = [
	{
		displayName: 'Cut Mode',
		name: 'cutMode',
		type: 'options',
		options: [
			{ name: 'By Range (Start–End)', value: 'cutRange' },
			{ name: 'By Duration', value: 'duration' },
			{ name: 'Keep Segments (Multiple)', value: 'keep' },
			{ name: 'Remove Segments (Return Leftovers)', value: 'remove' },
			{ name: 'Split by Interval', value: 'interval' },
			{ name: 'Split by Count', value: 'count' },
		],
		default: 'cutRange',
		description: 'Choose how you want to cut the video',
		displayOptions: {
			show: {
				resource: ['video'],
				operation: ['cut'],
			},
		},
	},
	{
		displayName: 'Cut Range (JSON)',
		name: 'cutRange',
		type: 'json',
		default: '{"start": "00:00:05", "end": "00:00:15"}',
		placeholder: '{"start":"00:00:05","end":"00:00:15"}',
		description:
			'List of time ranges in JSON format. Example: {"start":"00:00:05","end":"00:00:15"}.',
		displayOptions: {
			show: {
				resource: ['video'],
				cutMode: ['cutRange'],
			},
		},
	}
];

const videoUtilsFields: INodeProperties[] = [
	{
		displayName: 'Video data',
		name: 'binaryProperty',
		type: 'string',
		required: true,
		hint: 'The name of the input binary field containing the file to be uploaded',
		displayOptions: {
			show: {
				resource: ['video'],
			},
		},
		default: 'data',
	},
];

export const videoFields: INodeProperties[] = [...videoCutFields, ...videoUtilsFields];
