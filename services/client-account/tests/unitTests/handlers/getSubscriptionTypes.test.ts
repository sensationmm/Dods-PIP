import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { SubscriptionTypeRepository } from '../../../src/repositories';
import { getSubscriptionTypes } from '../../../src/handlers/getSubscriptionTypes/getSubscriptionTypes';
import { mocked } from 'ts-jest/utils';

const FUNCTION_NAME = getSubscriptionTypes.name;

const SUCCESS_SUBSCRIPTION_TYPE_RESPONSE = [
    {
        id: 'ea06b7da-c2ec-47bc-bea5-ec528b1f46a8',
        name: 'Level 1',
        location: 1,
        contentType: 1,
    },
    {
        id: 'ea06b7da-c2ec-47bc-bea5-ec528b1f46a9',
        name: 'Level 2',
        location: 2,
        contentType: 2,
    },
    {
        id: 'ea06b7da-c2ec-47bc-bea5-ec528b1f46b0',
        name: 'Level 3',
        location: 3,
        contentType: 3,
    },
];

jest.mock('../../../src/repositories/SubscriptionTypeRepository');

const mockedSubscriptionTypeRepository = mocked(
    SubscriptionTypeRepository,
    true
);

afterEach(() => {
    mockedSubscriptionTypeRepository.defaultInstance.getSubscriptionTypes.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid input`, async () => {
        const expectedRepositoryResponse = SUCCESS_SUBSCRIPTION_TYPE_RESPONSE;

        const expectedResponse = new HttpResponse(
            HttpStatusCode.OK,
            JSON.stringify(SUCCESS_SUBSCRIPTION_TYPE_RESPONSE)
        );

        mockedSubscriptionTypeRepository.defaultInstance.getSubscriptionTypes.mockResolvedValue(
            expectedRepositoryResponse
        );
        // @ts-ignore
        const response = await getSubscriptionTypes();

        expect(response).toEqual(expectedResponse);

        expect(
            mockedSubscriptionTypeRepository.defaultInstance
                .getSubscriptionTypes
        ).toHaveBeenCalledTimes(1);
    });
});
