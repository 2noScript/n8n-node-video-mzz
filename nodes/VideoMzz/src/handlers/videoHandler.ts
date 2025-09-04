import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import ffmpegHandler from './ffmpegHandler';

export type cutMode = 'range' | 'duration' | 'keep' | 'remove' | 'interval' | 'count';

class VideoHandler {
	private standTime(time: string) {
		const [h, m, s] = time.split(':').map(Number);
		return h * 60 * 60 + m * 60 + s;
	}

	private async getProperties(exc: IExecuteFunctions): Promise<Record<string, any>> {
		const resource = exc.getNodeParameter('resource');
		const operation = exc.getNodeParameter('operation', 0);
		const binaryProperty = exc.getNodeParameter('binaryProperty', 0);
		const inputBuffer = await exc.helpers.getBinaryDataBuffer(0, binaryProperty);
		let properties: Record<string, any> = {
			resource,
			operation,
			inputBuffer,
		};

		if (operation === 'cut') {
			let cut: Record<string, any> = {};
			properties['cut'] = cut;
			const cutMode = exc.getNodeParameter('cutMode', 0);
			cut['mode'] = cutMode;
			cut['jsonTask'] = JSON.parse(exc.getNodeParameter('cutRange', 0) as string);
		}

		return properties;
	}

	private async cutTask(inputBuffer: Buffer, cut: Record<string, any>) {
		const { mode, jsonTask } = cut;
		let cutResult: Buffer = inputBuffer;
		if (mode === 'cutRange') {
			const { start, end } = jsonTask;
			const startTime = this.standTime(start);
			const endTime = this.standTime(end);
			cutResult = await ffmpegHandler.cutByRange(inputBuffer, startTime, endTime);
		}
		return cutResult;
	}

	async runTask(exc: IExecuteFunctions): Promise<INodeExecutionData> {
		const properties = await this.getProperties(exc);

		let result: INodeExecutionData = {
			json: {},
		};


		if (properties.operation === 'cut') {
			const cutResult = await this.cutTask(properties.inputBuffer, properties.cut);
			const binaryData = await exc.helpers.prepareBinaryData(cutResult, 'output.mp4');
			result['binary'] = {
				data:binaryData
			};
			result.json = {
				output: 'data.mp4',
				cut: properties?.cut,
			};
		
		}

		// const result = await ffmpegHandler.cut(properties.inputBuffer, 0, 30);
		// const binaryData = await exc.helpers.prepareBinaryData(result, 'output.mp4');

		// return {
		// 	binary: {
		// 		data: binaryData,
		// 	},
		// 	json: {
		// 		// properties,
		// 		cut: properties?.cut,
		// 		output: 'output.mp4',
		// 	},
		// };
		return result;
	}
}

export default new VideoHandler();
