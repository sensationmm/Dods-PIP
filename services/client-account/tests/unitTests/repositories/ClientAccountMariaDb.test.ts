import { ClientAccountMariaDb } from '../../../src/repositories';

const MODULE_NAME = ClientAccountMariaDb.name;

const GET_CLIENT_ACCOUNT = ClientAccountMariaDb.defaultInstance.getClientAccount.name;

describe(`${MODULE_NAME} handler`, () => {

    test(`${GET_CLIENT_ACCOUNT} Valid input`, async () => {

        const clientAccountId = '111';

        const response = await ClientAccountMariaDb.defaultInstance.getClientAccount(clientAccountId);

        const expectedResponse = [{clientAccountId}];

        expect(response).toEqual(expectedResponse);

    });

    test(`${GET_CLIENT_ACCOUNT} Invalid input`, async () => {

        const clientAccountId = '';
        try {
            await ClientAccountMariaDb.defaultInstance.getClientAccount(clientAccountId);

            expect(true).toBe(false);
        } catch (error: any) {
            expect(error.message).toEqual('Error: clientAccountId cannot be empty');
        }
    });
});

