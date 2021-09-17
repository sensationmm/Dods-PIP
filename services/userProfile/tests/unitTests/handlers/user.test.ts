import { user } from '../../../src/handlers/user/user';

const FUNCTION_NAME = "user";

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be "user"', async () => {
        const response = await user();
        expect(response).toEqual({ body: 'user', statusCode: 200 });
    });
});

