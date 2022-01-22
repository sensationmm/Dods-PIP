import { v4 as uuid } from 'uuid';
import { mocked } from 'jest-mock';
import { createContext, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertRecipientRepository, DeleteAlertRecipientInput, } from '@dodsgroup/dods-repositories';
import { deleteAlertRecipient } from '../../../src/handlers/deleteAlertRecipient/deleteAlertRecipient';

const FUNCTION_NAME = deleteAlertRecipient.name;

const defaultContext = createContext();

jest.mock('@dodsgroup/dods-repositories');

const mockedCollectionAlertRecipientRepository = mocked(CollectionAlertRecipientRepository, true);

describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid input', async () => {

        const requestParams: DeleteAlertRecipientInput = {
            collectionId: uuid(),
            alertId: uuid(),
            userId: uuid(),
        };


        mockedCollectionAlertRecipientRepository.defaultInstance.delete.mockResolvedValue(true);

        const response = await deleteAlertRecipient(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Recipient was removed successfully',
        });

        expect(response).toEqual(expectedResponse);
    });
});