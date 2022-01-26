import { BadParameterError, config } from '../../../src/domain';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { EditorialRecordRepository } from '@dodsgroup/dods-repositories';
import { lockEditorialRecord } from '../../../src/handlers/lockEditorialRecord/lockEditorialRecord';
import { mocked } from 'ts-jest/utils';

const defaultContext = createContext();

const defaultLockedRecord: any = {
    uuid: 'unlocked',
    documentName: 'NewDocument',
    s3Location: 'SomeLocation',
    status: {
        uuid: config.dods.recordStatuses.inProgress,
        status: 'In Progress',
    },
    assignedEditor: {
        uuid: '0698280d-8b0f-4a2c-8892-e1599e407fb4',
        fullName: 'Employee Example',
    },
    createdAt: '2021-11-08T16:20:58.000Z',
    updatedAt: '2021-11-08T16:20:58.000Z',
};

jest.mock('@dodsgroup/dods-repositories');

const mockedEditorialRecordRepository = mocked(EditorialRecordRepository, true);

mockedEditorialRecordRepository.defaultInstance.lockEditorialRecord.mockImplementation((params) => {
    if (params.recordId === 'unlocked') return defaultLockedRecord;
    if (params.recordId === 'locked')
        throw new BadParameterError('Error: Bad Parameter', defaultLockedRecord);
    if (params.recordId === 'badId') throw new BadParameterError('Error: Bad Parameter');
    throw Error('Generic Error');
});

const FUNCTION_NAME = lockEditorialRecord.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be "healthy"', async () => {
        const requestParams = {
            recordId: 'unlocked',
            assignedEditorId: '0698280d-8b0f-4a2c-8892-e1599e407fb4',
        };
        const response = await lockEditorialRecord(requestParams, defaultContext);

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Editorial Record locked.',
            data: defaultLockedRecord,
        });

        expect(EditorialRecordRepository.defaultInstance.lockEditorialRecord).toBeCalledWith(
            requestParams
        );
        expect(response).toEqual(expectedHealthyResponse);
    });

    test('Bad input - response should be "Bad Request"', async () => {
        const requestParams = {
            recordId: 'badId',
            assignedEditorId: '0698280d-8b0f-4a2c-8892-e1599e407fb4',
        };
        const response = await lockEditorialRecord(requestParams, defaultContext);

        const expectedBadResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Error: Bad Parameter',
        });

        expect(EditorialRecordRepository.defaultInstance.lockEditorialRecord).toBeCalledWith(
            requestParams
        );
        expect(response).toEqual(expectedBadResponse);
    });

    test('Record already locked - response should be "Bad Request"', async () => {
        const requestParams = {
            recordId: 'locked',
            assignedEditorId: '0698280d-8b0f-4a2c-8892-e1599e407fb4',
        };
        const response = await lockEditorialRecord(requestParams, defaultContext);

        const expectedBadResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Error: Bad Parameter',
            data: defaultLockedRecord,
        });

        expect(EditorialRecordRepository.defaultInstance.lockEditorialRecord).toBeCalledWith(
            requestParams
        );
        expect(response).toEqual(expectedBadResponse);
    });

    test('Service Error - should throw', async () => {
        const requestParams = {
            recordId: 'error',
            assignedEditorId: '0698280d-8b0f-4a2c-8892-e1599e407fb4',
        };
        try {
            await lockEditorialRecord(requestParams, defaultContext);
            expect(true).toBe(false);
        } catch (e) {
            expect(e).toHaveProperty('message', 'Generic Error');
        }
    });
});
