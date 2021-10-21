import { SayLocalHelloParameters } from '../../../src/domain';
import { getFullName } from '../../../src/handlers/getFullName/getFullName';
import { createContext, } from '@dodsgroup/dods-lambda';

const defaultContext = createContext();

const FUNCTION_NAME = getFullName.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME}`, async () => {
        const data: SayLocalHelloParameters = { title: 'Mr', firstName: 'kenan', lastName: 'hancer' };

        const response = await getFullName(data, defaultContext);

        const expectedResponse = { statusCode: 200, body: `${data.title} ${data.firstName} ${data.lastName}` };

        expect(response).toEqual(expectedResponse);
    });
});
