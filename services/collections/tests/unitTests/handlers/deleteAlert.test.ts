import { CollectionAlertsRepository, DeleteAlertParameters } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { deleteAlert } from '../../../src/handlers/deleteAlert/deleteAlert';
import { mocked } from 'jest-mock';

const FUNCTION_NAME = deleteAlert.name;
const defaultContext = createContext();
jest.mock('@dodsgroup/dods-repositories');
const mockedCollectionAlertsRepository = mocked(CollectionAlertsRepository, true);

describe(`${FUNCTION_NAME} handler`, () => {

    it('Valid Input scheduled ', async () => {
        const requestParams: DeleteAlertParameters = {
            collectionId: '350b159c-6e43-11ec-90d6-0242ac120003',
            alertId: '9648fe0-534b-4b3b-9214-6bf57b0cdd56',
        };
        const alertResponse: any = {
            alert: {
                id: 1,
                uuid: "uuid",
                title: "alert Title",
                isScheduled: true
            }
        }
        mockedCollectionAlertsRepository.defaultInstance.getAlert.mockResolvedValue(alertResponse);
        mockedCollectionAlertsRepository.defaultInstance.deleteAlert.mockResolvedValue();

        const response = await deleteAlert(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Alert was deleted successfully'
        });

        expect(response).toEqual(expectedResponse);
        expect(mockedCollectionAlertsRepository.defaultInstance.deleteAlert).toHaveBeenCalledWith(requestParams);
    });

    it('Valid Input non scheduled', async () => {
        const requestParams: DeleteAlertParameters = {
            collectionId: '350b159c-6e43-11ec-90d6-0242ac120003',
            alertId: '9648fe0-534b-4b3b-9214-6bf57b0cdd56',
        };
        const alertResponse: any = {
            alert: {
                id: 1,
                uuid: "uuid",
                title: "alert Title",
                isScheduled: false
            }
        }
        mockedCollectionAlertsRepository.defaultInstance.getAlert.mockResolvedValue(alertResponse);
        mockedCollectionAlertsRepository.defaultInstance.deleteAlert.mockResolvedValue();

        const response = await deleteAlert(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Alert was deleted successfully'
        });

        expect(response).toEqual(expectedResponse);
        expect(mockedCollectionAlertsRepository.defaultInstance.deleteAlert).toHaveBeenCalledWith(requestParams);
    });
});
