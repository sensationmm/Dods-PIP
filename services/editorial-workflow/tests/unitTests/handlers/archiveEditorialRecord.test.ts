import { HttpResponse, HttpStatusCode, createContext, } from '@dodsgroup/dods-lambda';

import { EditorialRecordRepository, ArchiveEditorialRecordParameters } from '@dodsgroup/dods-repositories';
import { archiveEditorialRecord } from '../../../src/handlers/archiveEditorialRecord/archiveEditorialRecord';
import { mocked } from 'ts-jest/utils';

const defaultContext = createContext();

jest.mock('@dodsgroup/dods-repositories');

const mockedEditorialRecordRepository = mocked(EditorialRecordRepository, true);

const FUNCTION_NAME = archiveEditorialRecord.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input', async () => {

        const requestParams: ArchiveEditorialRecordParameters = { recordId: '' };

        const response = await archiveEditorialRecord(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Editorial Record archived',
        });

        expect(mockedEditorialRecordRepository.defaultInstance.archiveEditorialRecord).toHaveBeenCalledTimes(1);
        expect(response).toEqual(expectedResponse);
    });
});
