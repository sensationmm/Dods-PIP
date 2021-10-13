import { userByName } from '../../../src/handlers/userByName/userByName';

const FUNCTION_NAME = "userByName";

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be "UserByName"', async () => {
        const response = await userByName();
        expect(response).toEqual({ body: 'userByName', statusCode: 200 });
    });
});

