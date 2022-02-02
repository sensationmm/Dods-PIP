import { AlertRecipientsOutput, CollectionAlertRecipientRepository, UpdateRecipientParameters } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { copyAlert } from '../../../src/handlers/copyAlert/copyAlert';
import { mocked } from 'jest-mock';
import { updateRecipient } from '../../../src/handlers/updateRecipient/updateRecipient';

const FUNCTION_NAME = copyAlert.name;
const defaultContext = createContext();
jest.mock('@dodsgroup/dods-repositories');
const mockedCollectionAlertRecipientRepository = mocked(CollectionAlertRecipientRepository, true);

const answerMock: AlertRecipientsOutput = {
    "uuid": "6c16a036-2439-4b78-bf29-8069f4cd6c0b",
    "name": "Joe Myers",
    "emailAddress": "joe@ex.com",
    "isActive": false,
    "isDodsUser": true
}

describe(`${FUNCTION_NAME} handler`, () => {

    it('Valid Input', async () => {
        const requestParams: UpdateRecipientParameters = {
            collectionId: 'cd44bad6-8eeb-4870-abb8-72d297ea7a3e',
            alertId: '9dc71771-9ce2-49c0-be02-2f26c94b3408',
            isActive: false,
            updatedBy: 'd33f7495-f597-40c9-8cad-26fe81e7cdb6',
            userId: 'b310c3d3-d72d-4a7e-b7b4-2bc8a1066354'
        };

        mockedCollectionAlertRecipientRepository.defaultInstance.update.mockResolvedValue(answerMock);

        const response = await updateRecipient(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            "success": true,
            "message": "The recipient was updated successfully",
            "recipient": {
                "uuid": "6c16a036-2439-4b78-bf29-8069f4cd6c0b",
                "name": "Joe Myers",
                "emailAddress": "joe@ex.com",
                "isActive": false,
                "isDodsUser": true
            }
        });

        expect(response).toEqual(expectedResponse);
        expect(mockedCollectionAlertRecipientRepository.defaultInstance.update).toHaveBeenCalledWith(requestParams);
    });
});
