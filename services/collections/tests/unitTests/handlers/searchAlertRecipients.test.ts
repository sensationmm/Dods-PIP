import { v4 as uuid } from 'uuid';
import { mocked } from 'jest-mock';
import { createContext, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertRecipientRepository, SearchAlertRecipientsInput, SearchAlertRecipientsOutput, } from '@dodsgroup/dods-repositories';
import { searchAlertRecipients } from '../../../src/handlers/searchAlertRecipients/searchAlertRecipients';

const FUNCTION_NAME = searchAlertRecipients.name;

const defaultContext = createContext();

jest.mock('@dodsgroup/dods-repositories');

const mockedCollectionAlertRecipientRepository = mocked(CollectionAlertRecipientRepository, true);

describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid input', async () => {

        const requestParams: SearchAlertRecipientsInput = {
            collectionId: uuid(),
            alertId: uuid(),
            limit: 30,
            offset: 0,
        };

        const defaultSearchAlertRecipientsRepositoryResponse: SearchAlertRecipientsOutput = {
            limit: requestParams.limit,
            offset: requestParams.offset,
            totalRecords: 0,
            filteredRecords: 0,
            data: []
        };

        mockedCollectionAlertRecipientRepository.defaultInstance.list.mockResolvedValue(defaultSearchAlertRecipientsRepositoryResponse);

        const response = await searchAlertRecipients(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Alert recipients found',
            ...defaultSearchAlertRecipientsRepositoryResponse,
        });

        expect(response).toEqual(expectedResponse);
    });
});