import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { EditorialRecordListOutput } from '../../../src/domain';
import { EditorialRecordRepository } from '../../../src/repositories/EditorialRecordRepository';
import { mocked } from 'ts-jest/utils';
import { searchEditorialRecords } from '../../../src/handlers/searchEditorialRecords/searchEditorialRecords';

const defaultContext = createContext();

const defaultFoundRecords: EditorialRecordListOutput = {
    totalRecords: 1,
    filteredRecords: 1,
    results: [
        {
            uuid: 'e2a93ed5-31af-42ef-97e1-772d93c7d857',
            documentName: 'Test',
            s3Location: 'SomeLocation',
            createdAt: new Date('2021-11-04T19:39:53.000Z'),
            updatedAt: new Date('2021-11-04T19:39:53.000Z'),
        },
    ],
};

jest.mock('../../../src/repositories/EditorialRecordRepository');

const mockedEditorialRecordRepository = mocked(EditorialRecordRepository, true);

mockedEditorialRecordRepository.defaultInstance.listEditorialRecords.mockResolvedValue(
    defaultFoundRecords
);

const FUNCTION_NAME = searchEditorialRecords.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input', async () => {
        const requestParams = {
            searchTerm: 'Test',
            contentSource: 'Random',
            informationType: 'Random Doc',
            status: '89cf96f7-d380-4c30-abcf-74c57843f50c',
            endDate: '2021-11-08T23:21:58.000Z',
            startDate: '2021-11-08T23:20:38.000Z',
            offset: '2',
            limit: '13',
            sortBy: 'creationDate',
            sortDirection: 'asc',
        };
        const response = await searchEditorialRecords(requestParams, defaultContext);

        const searchUsersResult = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Editorial Records Found',
            data: defaultFoundRecords,
        });

        expect(EditorialRecordRepository.defaultInstance.listEditorialRecords).toBeCalledWith(
            requestParams
        );
        expect(response).toEqual(searchUsersResult);
    });

    test('Document Name valid input', async () => {
        const requestParams = {
            searchTerm: 'Test',
            contentSource: 'Random',
            informationType: 'Random Doc',
            status: '89cf96f7-d380-4c30-abcf-74c57843f50c',
            endDate: '2021-11-08T23:21:58.000Z',
            startDate: '2021-11-08T23:20:38.000Z',
            offset: '2',
            limit: '13',
            sortBy: 'documentName',
            sortDirection: 'asc',
        };
        const response = await searchEditorialRecords(requestParams, defaultContext);

        const searchUsersResult = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Editorial Records Found',
            data: defaultFoundRecords,
        });

        expect(EditorialRecordRepository.defaultInstance.listEditorialRecords).toBeCalledWith(
            requestParams
        );
        expect(response).toEqual(searchUsersResult);
    });

    test('Status valid input', async () => {
        const requestParams = {
            searchTerm: 'Test',
            contentSource: 'Random',
            informationType: 'Random Doc',
            status: '89cf96f7-d380-4c30-abcf-74c57843f50c',
            endDate: '2021-11-08T23:21:58.000Z',
            startDate: '2021-11-08T23:20:38.000Z',
            offset: '2',
            limit: '13',
            sortBy: 'status',
            sortDirection: 'asc',
        };
        const response = await searchEditorialRecords(requestParams, defaultContext);

        const searchUsersResult = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Editorial Records Found',
            data: defaultFoundRecords,
        });

        expect(EditorialRecordRepository.defaultInstance.listEditorialRecords).toBeCalledWith(
            requestParams
        );
        expect(response).toEqual(searchUsersResult);
    });

    test('No offset and limit on params', async () => {
        const requestParams = {
            searchTerm: 'Test',
            contentSource: 'Random',
            informationType: 'Random Doc',
            status: '89cf96f7-d380-4c30-abcf-74c57843f50c',
            endDate: '2021-11-08T23:21:58.000Z',
            startDate: '2021-11-08T23:20:38.000Z',
        };
        await searchEditorialRecords(requestParams, defaultContext);

        expect(EditorialRecordRepository.defaultInstance.listEditorialRecords).toBeCalledWith({
            ...requestParams,
            offset: '0',
            limit: '20',
        });
    });

    test('endDate before startDate - should return "Bad Request"', async () => {
        const requestParams = {
            endDate: '2021-11-08T23:19:58.000Z',
            startDate: '2021-11-08T23:20:38.000Z',
        };
        const response = await searchEditorialRecords(requestParams, defaultContext);
        const expectedResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: `End date must be greater than start date`,
        });

        expect(response).toEqual(expectedResponse);
    });
});
