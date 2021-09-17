import { role } from '../../../src/handlers/role/role';

const FUNCTION_NAME = "role";

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be "role"', async () => {
        const response = await role();
        expect(response).toEqual({ body: 'role', statusCode: 200 });
    });
});

