import { health } from '../../../src/handlers/health/health';

const FUNCTION_NAME = health.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be "healthy"', async () => {
        const response = await health();
        expect(response).toEqual('healthy');
    });
});

