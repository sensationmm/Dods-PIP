import { CollectionsRepository, UpdateCollectionParameters, CollectionOutput } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { mocked } from 'jest-mock';
import { updateCollection } from '../../../src/handlers/updateCollection/updateCollection';

const mockedCollectionRepository = mocked(CollectionsRepository, true);
const defaultContext = createContext();
const FUNCTION_NAME = updateCollection.name;

jest.mock('@dodsgroup/dods-repositories');

describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid input', async () => {

        const requestParams: UpdateCollectionParameters = {
            collectionId: '94a57103-3bf0-4a29-bdba-99a4650c1849',
            name: 'test',
            updatedBy: 'user-uuid',
        };

        const responseMock: CollectionOutput = {
            "uuid": "d33f7495-f597-40c9-8cad-26fe81e7cdb6",
            "name": "Test",
            "clientAccount": {
                "uuid": "a170742a-f84d-40e9-9176-8fd6568149f7",
                "name": "DODS GROUP"
            },
            "createdAt": new Date(),
            "createdBy": {
                "uuid": "6c16a036-2439-4b78-bf29-8069f4cd6c0b",
                "name": "Joe Myers",
                "emailAddress": "joe@ex.com",
                "isDodsUser": true
            },
            "updatedAt": new Date(),
            "updatedBy": {
                "uuid": "6340c08f-0a01-41c1-8434-421f1fff3d1e",
                "name": "Mark Myers",
                "emailAddress": "mark@ex.com",
                "isDodsUser": true
            },
        };

        mockedCollectionRepository.defaultInstance.update.mockResolvedValue(responseMock);


        const response = await updateCollection(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Collection updated successfully',
            data: responseMock
        });

        expect(response).toEqual(expectedResponse);
        expect(mockedCollectionRepository.defaultInstance.update).toHaveBeenCalledTimes(1);
        expect(mockedCollectionRepository.defaultInstance.update).toHaveBeenCalledWith(requestParams);
    });

});