import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { BadParameterError } from '../../../src/domain';
import { EditorialRecordRepository } from '../../../src/repositories/EditorialRecordRepository';
import { mocked } from 'ts-jest/utils';
import { updateEditorialRecord } from '../../../src/handlers/updateEditorialRecord/updateEditorialRecord';

const defaultContext = createContext();

const defaultCreatedRecord: any = {
    uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
    documentName: 'NewDocument',
    s3Location: 'SomeLocation',
};

jest.mock('../../../src/repositories/EditorialRecordRepository');

const mockedEditorialRecordRepository = mocked(EditorialRecordRepository, true);

mockedEditorialRecordRepository.defaultInstance.updateEditorialRecord.mockImplementation(
    (params) => {
        if (params.recordId === 'f9d1482a-77e8-440e-a370-7e06fa0da176') return defaultCreatedRecord;
        if (params.recordId === 'BadId') throw new BadParameterError('Error: Bad Parameter');
        throw Error('Generic Error');
    }
);

const FUNCTION_NAME = updateEditorialRecord.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be "healthy"', async () => {
        const requestParams = {
            documentName: 'NewDocument',
            s3Location: 'SomeLocation',
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
        };
        const response = await updateEditorialRecord(requestParams, defaultContext);

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Editorial Record updated.',
            data: defaultCreatedRecord,
        });

        expect(EditorialRecordRepository.defaultInstance.updateEditorialRecord).toBeCalledWith(
            requestParams
        );
        expect(response).toEqual(expectedHealthyResponse);
    });

    test('Bad input - response should be "Bad Request"', async () => {
        const requestParams = {
            documentName: 'NewDocument',
            s3Location: 'SomeLocation',
            recordId: 'BadId',
        };
        const response = await updateEditorialRecord(requestParams, defaultContext);

        const expectedBadResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Error: Bad Parameter',
        });

        expect(EditorialRecordRepository.defaultInstance.updateEditorialRecord).toBeCalledWith(
            requestParams
        );
        expect(response).toEqual(expectedBadResponse);
    });

    test('Service Error - should throw', async () => {
        const requestParams = {
            documentName: 'NewDocument',
            s3Location: 'SomeLocation',
            recordId: 'serviceError',
        };
        try {
            await updateEditorialRecord(requestParams, defaultContext);
            expect(true).toBe(false);
        } catch (e) {
            expect(e).toHaveProperty('message', 'Generic Error');
        }
    });
});
