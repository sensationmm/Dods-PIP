import { Context } from 'aws-lambda'

export const createContext = (): Context => {
  return {
    callbackWaitsForEmptyEventLoop: true,
    functionName: 'asdasd',
    functionVersion: 'asdasd',
    invokedFunctionArn: 'asdasd',
    memoryLimitInMB: 'asdasd',
    awsRequestId: 'asdasd',
    logGroupName: 'asdasd',
    logStreamName: 'asdasd',
    getRemainingTimeInMillis: () => 0,
    done: () => { },
    fail: () => { },
    succeed: () => { }
  }
}
