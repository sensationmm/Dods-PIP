import { SayLocalHelloParameters } from '../../../src/domain';
import { sayTurkishHello } from '../../../src/handlers/sayTurkishHello/sayTurkishHello';
import { GreetingRepository } from '../../../src/repositories/GreetingRepository';
import { mocked } from 'ts-jest/utils'
import { createContext, } from '@dodsgroup/dods-lambda';

jest.mock("../../../src/repositories/GreetingRepository");

const mockedGreetingRepository = mocked(GreetingRepository, true);

mockedGreetingRepository.defaultInstance.getFullName.mockImplementation(async (data: SayLocalHelloParameters) => (`${data.title} ${data.firstName} ${data.lastName}`))

const defaultContext = createContext();

const FUNCTION_NAME = sayTurkishHello.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME}`, async () => {
        const data: SayLocalHelloParameters = { title: 'Mr', firstName: 'kenan', lastName: 'hancer' };

        const response = await sayTurkishHello(data, defaultContext);

        expect(mockedGreetingRepository.defaultInstance.getFullName).toHaveBeenCalledTimes(1);

        expect(mockedGreetingRepository.defaultInstance.getFullName).toHaveBeenCalledWith(data);

        const mockGetFullNameValue = await mockedGreetingRepository.defaultInstance.getFullName.mock.results[0].value;

        const expectedResponse = `Merhaba ${mockGetFullNameValue}`;

        expect(response).toEqual(expectedResponse);
    });
});
