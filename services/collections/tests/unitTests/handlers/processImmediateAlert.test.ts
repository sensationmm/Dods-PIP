import { CollectionAlertRecipientRepository, CollectionAlertsRepository, DocumentRepository } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { ProcessImmediateAlertParameters } from '../../../src/domain';
import { mocked } from 'jest-mock';
import { processImmediateAlert } from '../../../src/handlers/processImmediateAlert/processImmediateAlert';
import { singleEmailBodyHandler } from '../../../src/templates/singleFullAlert'

const FUNCTION_NAME = processImmediateAlert.name;

const defaultContext = createContext();

jest.mock('@dodsgroup/dods-repositories');
jest.mock('../../../src/templates/singleFullAlert');


const mockedValue = mocked(singleEmailBodyHandler, true);

const mockedCollectionAlertsRepository = mocked(CollectionAlertsRepository, true);
const mockedCollectionAlertRecipientRepository = mocked(CollectionAlertRecipientRepository, true);
const mockedDocumentRepository = mocked(DocumentRepository, true);

describe(`${FUNCTION_NAME} handler`, () => {

    it('Valid Input', async () => {

        const requestParameters: ProcessImmediateAlertParameters = {
            alertId: 'alertUuid',
            docId: 'documentUuid',
        }

        const alertOutput = {
            alert: {
                id: 1,
                uuid: 'alertUUID',
                title: 'alert title'
            }
        } as any

        const recipients: any = [{ emailAddress: 'person@example.com' }]

        const document = {
            success: true,
            data: {
                documentId: 'id',
                documentTitle: 'title',
                contentDateTime: '04 Dec 1995 00:12:00 GMT',
                documentContent: 'document content'
            }
        }

        mockedCollectionAlertsRepository.defaultInstance.getAlertById.mockResolvedValue(alertOutput);
        mockedCollectionAlertRecipientRepository.defaultInstance.listAlertRecipients.mockResolvedValue(recipients);
        mockedDocumentRepository.defaultInstance.getDocumentById.mockResolvedValue(document)
        mockedDocumentRepository.defaultInstance.sendEmail.mockResolvedValue(true)
        mockedCollectionAlertsRepository.defaultInstance.createAlertDocumentRecord.mockResolvedValue(true);
        mockedValue.mockResolvedValue('string')

        const response = await processImmediateAlert(requestParameters, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Inmetiadte Alert ' + requestParameters.alertId + ' with document  ' + requestParameters.docId + ' triggered',
        });

        expect(response).toEqual(expectedResponse);
    });

    it('Error output', async () => {

        const requestParameters: ProcessImmediateAlertParameters = {
            alertId: 'alertUuid',
            docId: 'documentUuid',

        }


        const recipients: any = [{ emailAddress: 'person@example.com' }]

        const document = {
            success: true,
            data: {
                docId: 'id',
                documentTitle: 'title',
                contentDateTime: '04 Dec 1995 00:12:00 GMT',
                documentContent: 'document content'
            }
        }

        mockedCollectionAlertsRepository.defaultInstance.getAlertById.mockImplementation(() => { throw new Error('No Alert') });
        mockedCollectionAlertRecipientRepository.defaultInstance.listAlertRecipients.mockResolvedValue(recipients);
        mockedDocumentRepository.defaultInstance.getDocumentById.mockResolvedValue(document)
        mockedDocumentRepository.defaultInstance.sendEmail.mockResolvedValue(true)
        mockedCollectionAlertsRepository.defaultInstance.createAlertDocumentRecord.mockResolvedValue(true);
        mockedValue.mockResolvedValue('string')

        const response = await processImmediateAlert(requestParameters, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'No Alert',
        });

        expect(response).toEqual(expectedResponse);
    });

    it('No recipients output', async () => {

        const requestParameters: ProcessImmediateAlertParameters = {
            alertId: 'alertUuid',
            docId: 'documentUuid',
        }


        const recipients: any = []

        const document = {
            success: true,
            data: {
                documentId: 'id',
                documentTitle: 'title',
                contentDateTime: '04 Dec 1995 00:12:00 GMT',
                documentContent: 'document content'
            }
        }

        const alertOutput = {
            alert: {
                id: 1,
                uuid: 'alertUUID',
                title: 'alert title'
            }
        } as any

        mockedCollectionAlertsRepository.defaultInstance.getAlertById.mockResolvedValue(alertOutput);
        mockedCollectionAlertRecipientRepository.defaultInstance.listAlertRecipients.mockResolvedValue(recipients);
        mockedDocumentRepository.defaultInstance.getDocumentById.mockResolvedValue(document)
        mockedDocumentRepository.defaultInstance.sendEmail.mockResolvedValue(true)
        mockedCollectionAlertsRepository.defaultInstance.createAlertDocumentRecord.mockResolvedValue(true);
        mockedValue.mockResolvedValue('string')

        const response = await processImmediateAlert(requestParameters, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'There are not recipients for these alert',
        });

        expect(response).toEqual(expectedResponse);
    });

    it('No Alert Title', async () => {

        const requestParameters: ProcessImmediateAlertParameters = {
            alertId: 'alertUuid',
            docId: 'documentUuid',
        }

        const recipients: any = []

        const document = {
            success: true,
            data: {
                documentId: 'id',
                documentTitle: 'title',
                contentDateTime: '04 Dec 1995 00:12:00 GMT',
                documentContent: 'document content'
            }
        }

        const alertOutput = {
            alert: {
                id: 1,
                uuid: 'alertUUID'
            }
        } as any

        mockedCollectionAlertsRepository.defaultInstance.getAlertById.mockResolvedValue(alertOutput);
        mockedCollectionAlertRecipientRepository.defaultInstance.listAlertRecipients.mockResolvedValue(recipients);
        mockedDocumentRepository.defaultInstance.getDocumentById.mockResolvedValue(document)
        mockedDocumentRepository.defaultInstance.sendEmail.mockResolvedValue(true)
        mockedCollectionAlertsRepository.defaultInstance.createAlertDocumentRecord.mockResolvedValue(true);
        mockedValue.mockResolvedValue('string')

        const response = await processImmediateAlert(requestParameters, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Alert must have title',
        });

        expect(response).toEqual(expectedResponse);
    });


});