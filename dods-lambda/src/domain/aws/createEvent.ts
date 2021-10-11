import { APIGatewayProxyEventV2, EventBridgeEvent } from 'aws-lambda'

export const createEventBridgeEvent = <T>(source: string, detailType: string, detail: T): EventBridgeEvent<string, T> => ({
  time: '12/Mar/2020:19:03:58 +0000',
  id: '123',
  version: '2.0',
  detail: detail,
  region: 'eu-west-2',
  account: '123456789012',
  source,
  resources: [],
  'detail-type': detailType,
})

export const createApiGatewayProxyEvent = (body?: string | unknown): APIGatewayProxyEventV2 => ({
  version: '2.0',
  routeKey: '$default',
  rawPath: '/my/path',
  rawQueryString: '',
  headers: {},
  requestContext: {
    accountId: '123456789012',
    apiId: 'api-id',
    domainName: 'id.execute-api.us-east-1.amazonaws.com',
    domainPrefix: 'id',
    http: {
      method: 'POST',
      path: '/my/path',
      protocol: 'HTTP/1.1',
      sourceIp: 'IP',
      userAgent: 'agent',
    },
    requestId: 'id',
    routeKey: '$default',
    stage: '$default',
    time: '12/Mar/2020:19:03:58 +0000',
    timeEpoch: 1583348638390,
  },
  body: typeof body === 'string' ? body : JSON.stringify(body),
  isBase64Encoded: false,
})
