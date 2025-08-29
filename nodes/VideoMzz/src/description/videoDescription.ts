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
		name: 'mode',
		type: 'options',
		options: [
			{ name: 'By Range (Start–End)', value: 'range' },
			{ name: 'By Duration', value: 'duration' },
			{ name: 'Keep Segments (Multiple)', value: 'keep' },
			{ name: 'Remove Segments (Return Leftovers)', value: 'remove' },
			{ name: 'Split by Interval', value: 'interval' },
			{ name: 'Split by Count', value: 'count' },
		],
		default: 'range',
		description: 'Choose how you want to cut the video',
		
	},

	{
		displayName: 'Ranges (JSON)',
		name: 'range',
		type: 'json',
		default: '{"start": "00:00:05", "end": "00:00:15"}',
		placeholder: '{"start":"00:00:05","end":"00:00:15"}',
		description:
			'List of time ranges in JSON format. Example: {"start":"00:00:05","end":"00:00:15"}.',
		displayOptions: {
			show: {
				mode: ['range'],
			},
		},
	},

	// {
	// 	displayName: 'Segments to Keep',
	// 	name: 'segments',
	// 	type: 'fixedCollection',
	// 	placeholder: 'Add Segment',
	// 	typeOptions: {
	// 		multipleValues: true,
	// 	},
	// 	default: [],
	// 	options: [
	// 		{
	// 			name: 'segment',
	// 			displayName: 'Segment',
	// 			values: [
	// 				{
	// 					displayName: 'Start Time',
	// 					name: 'start',
	// 					type: 'string',
	// 					default: '',
	// 					placeholder: '00:00:05',
	// 					description: 'Start time of the segment (HH:MM:SS or seconds)',
	// 				},
	// 				{
	// 					displayName: 'End Time',
	// 					name: 'end',
	// 					type: 'string',
	// 					placeholder: '00:00:10',
	// 					description: 'End time of the segment (HH:MM:SS or seconds)',
	// 					default: '',
	// 				},
	// 			],
	// 		},
	// 	],
	// },
];

export const videoFields: INodeProperties[] = [...videoCutFields];
