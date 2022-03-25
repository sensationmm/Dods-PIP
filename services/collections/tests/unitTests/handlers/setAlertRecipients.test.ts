import { CollectionAlertRecipientRepository, SetAlertRecipientsInput, SetAlertRecipientsOutput } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { mocked } from 'jest-mock';
import { setAlertRecipients } from '../../../src/handlers/setAlertRecipients/setAlertRecipients';

const FUNCTION_NAME = setAlertRecipients.name;

const defaultContext = createContext();

jest.mock('@dodsgroup/dods-repositories');

const mockedCollectionAlertRecipientRepository = mocked(CollectionAlertRecipientRepository, true);

describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid input', async () => {

        const requestParams: SetAlertRecipientsInput = {
            collectionId: 'uuid',
            alertId: 'uuid',
            updatedBy: 'uuid',
            recipients: [
                { userId: 'uuid' }
            ],
        };

        const defaultSetAlertRecipientsRepositoryResponse: SetAlertRecipientsOutput = {
            uuid: 'uuid',
            title: '',
            description: '',
            collection: {
                uuid: '',
                name: '',
            },
            template: {
                id: 0,
                name: '',
            },
            schedule: '',
            timezone: '',
            searchQueriesCount: 0,
            recipientsCount: 0,
            lastStepCompleted: 2,
            isPublished: false,
            createdBy: {
                uuid: '',
                name: '',
                emailAddress: '',
            },
            createdAt: new Date(),
            updatedBy: {
                uuid: '',
                name: '',
                emailAddress: '',
            },
            updatedAt: new Date(),
            recipients: []
        };

        mockedCollectionAlertRecipientRepository.defaultInstance.setAlertRecipients.mockResolvedValue(defaultSetAlertRecipientsRepositoryResponse);

        const response = await setAlertRecipients(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'The alert recipients were set successfully',
            alert: defaultSetAlertRecipientsRepositoryResponse,
        });

        expect(response).toEqual(expectedResponse);
    });
});