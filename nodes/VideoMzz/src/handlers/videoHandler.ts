import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import ffmpegHandler from './ffmpegHandler';

class VideoHandler {
	async getProperties(exc: IExecuteFunctions): Promise<Record<string, any>> {
		const resource = exc.getNodeParameter('resource');
		const operation = exc.getNodeParameter('operation', 0);
		const binaryProperty = exc.getNodeParameter('binaryProperty', 0);
		const inputBuffer = await exc.helpers.getBinaryDataBuffer(0, binaryProperty);

		return {
			resource,
			operation,
            inputBuffer
            
		};
	}

	async runTask(exc: IExecuteFunctions): Promise<INodeExecutionData> {
		const { inputBuffer } = await this.getProperties(exc);

		const result = await ffmpegHandler.cut(inputBuffer, 0, 30);
		const binaryData = await exc.helpers.prepareBinaryData(result, 'output.mp4');
		return {
			binary: {
				output: binaryData,
			},
			json: {
				output: 'output.mp4',
			},
		};
	}
}

export default new VideoHandler();
