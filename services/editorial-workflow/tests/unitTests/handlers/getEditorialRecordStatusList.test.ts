import { HttpResponse, HttpStatusCode, createContext, createApiGatewayProxyEvent } from '@dodsgroup/dods-lambda';

import { EditorialRecordStatusesRepository } from '@dodsgroup/dods-repositories';
import { getEditorialRecordStatusList } from '../../../src/handlers/getEditorialRecordStatusList/getEditorialRecordStatusList';
import { mocked } from 'ts-jest/utils';

const defaultApiGatewayEvent = createApiGatewayProxyEvent();

const defaultContext = createContext();


const defaultSatusesRecord: any = [{
    "uuid": "89cf96f7-d380-4c30-abcf-74c57843f50c",
    "name": "Draft"
},
{
    "uuid": "b54bea83-fa06-4bd4-852d-08e5908c55b5",
    "name": "Ingested"
},
{
    "uuid": "a1c5e035-28d3-4ac3-b5b9-240e0b11dbce",
    "name": "Created"
},
{
    "uuid": "bbffb0d0-cb43-464d-a4ea-aa9ebd14a138",
    "name": "In progress"
},
{
    "uuid": "c6dadaed-de7f-45c1-bcdf-f3bbef389a60",
    "name": "Scheduled"
}];

jest.mock('@dodsgroup/dods-repositories');

const mockedEditorialRecordStatusesRepository = mocked(EditorialRecordStatusesRepository, true);

mockedEditorialRecordStatusesRepository.defaultInstance.getEditorialRecordStatuses.mockResolvedValue(
    defaultSatusesRecord
);

const FUNCTION_NAME = getEditorialRecordStatusList.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be "healthy"', async () => {
        const response = await getEditorialRecordStatusList(defaultApiGatewayEvent, defaultContext);

        const statusesResult = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            status: defaultSatusesRecord,
        });

        expect(EditorialRecordStatusesRepository.defaultInstance.getEditorialRecordStatuses).toBeCalled;
        expect(response).toEqual(statusesResult);
    });
});
