import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { EditorialRecordRepository } from '../../../src/repositories/EditorialRecordRepository';
import { createEditorialRecord } from '../../../src/handlers/createEditorialRecord/createEditorialRecord';
import { mocked } from 'ts-jest/utils';

const defaultContext = createContext();

const basicCreatedRecord: any = {
    uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
    documentName: 'NewDocument',
    s3Location: 'SomeLocation',
    informationType: 'Random Doc',
    contentSource: 'Manual Injection',
    status: {
        uuid: '89cf96f7-d380-4c30-abcf-74c57843f50c',
        status: 'Draft',
    },
    assignedEditor: {
        uuid: '0698280d-8b0f-4a2c-8892-e1599e407fb4',
        fullName: 'Employee Example',
    },
    createdAt: '2021-11-08T16:20:58.000Z',
    updatedAt: '2021-11-08T16:20:58.000Z',
    reload: () => {},
    setAssignedEditor: () => {},
    setStatus: () => {},
};

jest.mock('../../../src/repositories/EditorialRecordRepository');

const mockedEditorialRecordRepository = mocked(EditorialRecordRepository, true);

mockedEditorialRecordRepository.defaultInstance.createEditorialRecord.mockImplementation(
    async (params) => {
        if (params.documentName === 'ThrowError') throw new Error('Generic Error');

        return basicCreatedRecord;
    }
);
mockedEditorialRecordRepository.defaultInstance.checkUserId.mockImplementation(
    async (userId) => userId === '0698280d-8b0f-4a2c-8892-e1599e407fb4'
);

const FUNCTION_NAME = createEditorialRecord.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input, basic parameters - response should be "healthy"', async () => {
        const requestParams = { documentName: 'NewDocument', s3Location: 'SomeLocation' };
        const response = await createEditorialRecord(requestParams, defaultContext);

        const expectedCreatedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'New Editorial Record created.',
            data: basicCreatedRecord,
        });

        expect(EditorialRecordRepository.defaultInstance.createEditorialRecord).toBeCalledWith(
            requestParams
        );
        expect(response).toEqual(expectedCreatedResponse);
    });

    test('Valid input, all parameters - response should be "healthy"', async () => {
        const requestParams = {
            documentName: 'NewDocument',
            s3Location: 'SomeLocation',
            statusId: '89cf96f7-d380-4c30-abcf-74c57843f50c',
            assignedEditorId: '0698280d-8b0f-4a2c-8892-e1599e407fb4',
        };
        const response = await createEditorialRecord(requestParams, defaultContext);

        const expectedCreatedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'New Editorial Record created.',
            data: basicCreatedRecord,
        });

        expect(EditorialRecordRepository.defaultInstance.createEditorialRecord).toBeCalledWith(
            requestParams
        );
        expect(response).toEqual(expectedCreatedResponse);
    });

    test('Invalid UserId - response should be "Bad Request"', async () => {
        const requestParams = {
            documentName: 'NewDocument',
            s3Location: 'SomeLocation',
            statusId: '89cf96f7-d380-4c30-abcf-74c57843f50c',
            assignedEditorId: 'invalid',
        };
        const response = await createEditorialRecord(requestParams, defaultContext);

        const expectedCreatedResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: `Error: can not find user with id: ${requestParams.assignedEditorId}`,
        });

        expect(response).toEqual(expectedCreatedResponse);
    });

    test('Invalid UserId - response should be "Bad Request"', async () => {
        const requestParams = {
            documentName: 'NewDocument',
            s3Location: 'SomeLocation',
            statusId: '89cf96f7-d380-4c30-abcf-74c57843f50c',
            assignedEditorId: 'invalid',
        };
        const response = await createEditorialRecord(requestParams, defaultContext);

        const expectedCreatedResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: `Error: can not find user with id: ${requestParams.assignedEditorId}`,
        });

        expect(response).toEqual(expectedCreatedResponse);
    });

    test('Invalid statusId - response should be "Bad Request"', async () => {
        const requestParams = {
            documentName: 'NewDocument',
            s3Location: 'SomeLocation',
            statusId: 'invalid',
            assignedEditorId: '0698280d-8b0f-4a2c-8892-e1599e407fb4',
        };
        const response = await createEditorialRecord(requestParams, defaultContext);

        const expectedCreatedResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: `Error: invalid statusId: ${requestParams.statusId}`,
        });

        expect(response).toEqual(expectedCreatedResponse);
    });

    test('Status in-progress without assignedEditorId - response should be "Bad Request"', async () => {
        const requestParams = {
            documentName: 'NewDocument',
            s3Location: 'SomeLocation',
            statusId: 'bbffb0d0-cb43-464d-a4ea-aa9ebd14a138',
        };
        const response = await createEditorialRecord(requestParams, defaultContext);

        const expectedCreatedResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Error: In-progress status requires a record with an Assigned Editor',
        });

        expect(response).toEqual(expectedCreatedResponse);
    });

    test('Service Error - should throw', async () => {
        const requestParams = {
            documentName: 'ThrowError',
            s3Location: 'SomeLocation',
        };
        try {
            await createEditorialRecord(requestParams, defaultContext);
            expect(true).toBe(false);
        } catch (e) {
            expect(e).toHaveProperty('message', 'Generic Error');
        }
    });
});
