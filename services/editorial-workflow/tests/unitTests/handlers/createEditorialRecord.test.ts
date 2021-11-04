import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { EditorialRecordRepository } from '../../../src/repositories/EditorialRecordRepository';
import { createEditorialRecord } from '../../../src/handlers/createEditorialRecord/createEditorialRecord';
import { mocked } from 'ts-jest/utils';

const defaultContext = createContext();

const defaultCreatedRecord: any = {
    uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
    documentName: 'NewDocument',
    s3Location: 'SomeLocation',
};

jest.mock('../../../src/repositories/EditorialRecordRepository');

const mockedEditorialRecordRepository = mocked(EditorialRecordRepository, true);

mockedEditorialRecordRepository.defaultInstance.createEditorialRecord.mockResolvedValue(
    defaultCreatedRecord
);

const FUNCTION_NAME = createEditorialRecord.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be "healthy"', async () => {
        const requestParams = { documentName: 'NewDocument', s3Location: 'SomeLocation' };
        const response = await createEditorialRecord(requestParams, defaultContext);

        const searchUsersResult = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'New Editorial Record created.',
            data: defaultCreatedRecord,
        });

        expect(EditorialRecordRepository.defaultInstance.createEditorialRecord).toBeCalledWith(
            requestParams
        );
        expect(response).toEqual(searchUsersResult);
    });
});
