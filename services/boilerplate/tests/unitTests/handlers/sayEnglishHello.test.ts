import { SayLocalHelloParameters } from '../../../src/domain';
import { sayEnglishHello } from '../../../src/handlers/sayEnglishHello/sayEnglishHello';
import { GreetingRepository } from '../../../src/repositories/GreetingRepository';
import { createContext, } from '@dodsgroup/dods-lambda';

jest.mock("../../../src/repositories/GreetingRepository", () => {
    return {
        GreetingRepository: {
            defaultInstance: {
                getFullName: jest.fn((data: SayLocalHelloParameters) => `${data.title} ${data.firstName} ${data.lastName}`)
            }
        }
    };
});

const getFullNameMock = (GreetingRepository.defaultInstance.getFullName as jest.Mock);

const defaultContext = createContext();

const FUNCTION_NAME = sayEnglishHello.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME}`, async () => {
        const data: SayLocalHelloParameters = { title: 'Mr', firstName: 'kenan', lastName: 'hancer' };

        const response = await sayEnglishHello(data, defaultContext);

        expect(getFullNameMock).toHaveBeenCalledTimes(1);

        expect(getFullNameMock).toHaveBeenCalledWith(data);

        const expectedResponse = `Hello ${getFullNameMock.mock.results[0].value}`;

        expect(response).toEqual(expectedResponse);
    });
});
