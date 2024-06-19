import * as AWS from 'aws-sdk';
import { PutLogEventsRequest } from 'aws-sdk/clients/cloudwatchlogs';

AWS.config.update({ region: process.env.region || 'us-east-1' });

const cloudwatchlogs = new AWS.CloudWatchLogs({ apiVersion: '2014-03-28' });
const logGroupName = 'recipeburst';
const logStreamName = 'recipeburst';

export const logToCloudWatch = async (message: string, data: any): Promise<void> => {
  const timestamp = new Date().getTime();
  const logEvents = [
    {
      message: `${timestamp} - ${message} - ${JSON.stringify(data)}`,
      timestamp: timestamp,
    },
  ];

  try {
    // Retrieve the sequence token required for the next putLogEvents call
    const { uploadSequenceToken } = await getStreamSequenceToken(logGroupName, logStreamName);

    const params: PutLogEventsRequest = {
      logEvents: logEvents,
      logGroupName: logGroupName,
      logStreamName: logStreamName,
      sequenceToken: uploadSequenceToken,
    };

    await cloudwatchlogs.putLogEvents(params).promise();
  } catch (error) {
    console.error('Error logging to CloudWatch:', error);
  }
};

async function getStreamSequenceToken(logGroupName: string, logStreamName: string): Promise<{ uploadSequenceToken?: string }> {
  try {
    const response = await cloudwatchlogs.describeLogStreams({
      logGroupName: logGroupName,
      logStreamNamePrefix: logStreamName,
    }).promise();

    const stream = response.logStreams?.find(stream => stream.logStreamName === logStreamName);
    return { uploadSequenceToken: stream?.uploadSequenceToken };
  } catch (error) {
    console.error('Error retrieving sequence token:', error);
    throw error;
  }
}
