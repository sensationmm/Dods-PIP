import { CollectionAlertRecipientRepository, CollectionAlertsRepository, DocumentRepository } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { ProcessAlertParameters } from '../../../src/domain';
//import { getMultipleSnippetEmailBody } from '../../../src/templates/multipleSnippetAlert'
import { mocked } from 'jest-mock';
import { processAlert } from '../../../src/handlers/processAlert/processAlert';

const FUNCTION_NAME = processAlert.name;

const defaultContext = createContext();

jest.mock('@dodsgroup/dods-repositories');
jest.mock('../../../src/templates/singleFullAlert');


//const mockedValue = mocked(getMultipleSnippetEmailBody, true);

const mockedCollectionAlertsRepository = mocked(CollectionAlertsRepository, true);
const mockedCollectionAlertRecipientRepository = mocked(CollectionAlertRecipientRepository, true);
const mockedDocumentRepository = mocked(DocumentRepository, true);

describe(`${FUNCTION_NAME} handler`, () => {

    it('Valid Input', async () => {

        const requestParameters: ProcessAlertParameters = {
            alertId: 'alertUuid',
            collectionId: 'documentUuid',
        }

        const alertOutput = {
            alert: {
                id: 1,
                uuid: 'alertUUID',
                title: 'alert title',
                elasticQuery: '{"query":{"bool":{}}}'
            }
        } as any

        const recipients: any = [{ emailAddress: 'person@example.com' }]

        const documentsResponse = {
            response: {
                data: {
                    es_response: {
                        hits: {
                            hits: [{
                                _source: {
                                    documentId: 'documentId',
                                    documentTitle: 'title document',
                                    contentDateTime: '2021-07-15T11:11:12+00:00',
                                    informationType: 'information',
                                    contentSource: 'contentSource',
                                }
                            }]
                        }
                    }
                }
            }
        }

        mockedCollectionAlertsRepository.defaultInstance.getAlert.mockResolvedValue(alertOutput);
        mockedCollectionAlertRecipientRepository.defaultInstance.listAlertRecipients.mockResolvedValue(recipients);
        mockedDocumentRepository.defaultInstance.searchContent.mockResolvedValue(documentsResponse)
        mockedDocumentRepository.defaultInstance.sendEmail.mockResolvedValue({ success: true })
        mockedCollectionAlertsRepository.defaultInstance.createAlertDocumentRecord.mockResolvedValue(true);
        //mockedValue.mockResolvedValue('string')

        const response = await processAlert(requestParameters, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'alert schedule with ID ' + requestParameters.alertId + ' from collection ' + requestParameters.collectionId + ' triggered'
        });

        expect(response).toEqual(expectedResponse);
    });

    it('Valid Input', async () => {

        const requestParameters: ProcessAlertParameters = {
            alertId: 'alertUuid',
            collectionId: 'documentUuid',
        }

        const alertOutput = {
            alert: {
                id: 1,
                uuid: 'alertUUID',
                title: 'alert title',
                elasticQuery: '{"query":{"bool":{}}}'
            }
        } as any

        const recipients: any = [{ emailAddress: 'person@example.com' }]

        const documentsResponse = {
            response: {
                data: {
                    es_response: {
                        hits: {
                            hits: []
                        }
                    }
                }
            }
        }

        mockedCollectionAlertsRepository.defaultInstance.getAlert.mockResolvedValue(alertOutput);
        mockedCollectionAlertRecipientRepository.defaultInstance.listAlertRecipients.mockResolvedValue(recipients);
        mockedDocumentRepository.defaultInstance.searchContent.mockResolvedValue(documentsResponse)
        mockedDocumentRepository.defaultInstance.sendEmail.mockResolvedValue({ success: true })
        mockedCollectionAlertsRepository.defaultInstance.createAlertDocumentRecord.mockResolvedValue(true);

        const response = await processAlert(requestParameters, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Not Documents for this period of time'
        });

        expect(response).toEqual(expectedResponse);
    });

    it('No documents available Input', async () => {

        const requestParameters: ProcessAlertParameters = {
            alertId: 'alertUuid',
            collectionId: 'documentUuid',
        }

        const alertOutput = {
            alert: {
                id: 1,
                uuid: 'alertUUID',
                title: 'alert title',
                elasticQuery: '{"query":{"bool":{}}}'
            }
        } as any

        const recipients: any = [{ emailAddress: 'person@example.com' }]

        const documentsResponse = {
            response: {
                data: {
                    es_response: {
                        hits: {
                            hits: [{
                                _source: {
                                    documentId: 'documentId',
                                    documentTitle: 'title document',
                                    contentDateTime: '2021-07-15T11:11:12+00:00',
                                    informationType: 'information',
                                    contentSource: 'contentSource',
                                }
                            }]
                        }
                    }
                }
            }
        }

        mockedCollectionAlertsRepository.defaultInstance.getAlert.mockResolvedValue(alertOutput);
        mockedCollectionAlertRecipientRepository.defaultInstance.listAlertRecipients.mockResolvedValue(recipients);
        mockedDocumentRepository.defaultInstance.searchContent.mockResolvedValue(documentsResponse)
        mockedDocumentRepository.defaultInstance.sendEmail.mockResolvedValue({ success: true })
        mockedCollectionAlertsRepository.defaultInstance.createAlertDocumentRecord.mockResolvedValue(true);
        //mockedValue.mockResolvedValue('string')

        const response = await processAlert(requestParameters, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'alert schedule with ID ' + requestParameters.alertId + ' from collection ' + requestParameters.collectionId + ' triggered'
        });

        expect(response).toEqual(expectedResponse);
    });

    it('No success email ', async () => {

        const requestParameters: ProcessAlertParameters = {
            alertId: 'alertUuid',
            collectionId: 'documentUuid',
        }

        const alertOutput = {
            alert: {
                id: 1,
                uuid: 'alertUUID',
                title: 'alert title',
                elasticQuery: '{"query":{"bool":{}}}'
            }
        } as any

        const recipients: any = [{ emailAddress: 'person@example.com' }]

        const documentsResponse = {
            response: {
                data: {
                    es_response: {
                        hits: {
                            hits: [{
                                _source: {
                                    documentId: 'documentId',
                                    documentTitle: 'title document',
                                    contentDateTime: '2021-07-15T11:11:12+00:00',
                                    informationType: 'information',
                                    contentSource: 'contentSource',
                                }
                            }]
                        }
                    }
                }
            }
        }

        mockedCollectionAlertsRepository.defaultInstance.getAlert.mockResolvedValue(alertOutput);
        mockedCollectionAlertRecipientRepository.defaultInstance.listAlertRecipients.mockResolvedValue(recipients);
        mockedDocumentRepository.defaultInstance.searchContent.mockResolvedValue(documentsResponse)
        mockedDocumentRepository.defaultInstance.sendEmail.mockResolvedValue({ success: false })
        mockedCollectionAlertsRepository.defaultInstance.createAlertDocumentRecord.mockResolvedValue(true);

        const response = await processAlert(requestParameters, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Problem Sending email'
        });

        expect(response).toEqual(expectedResponse);
    });



});