import { SayLocalHelloParameters } from '../../../src/domain';
import { GreetingRepository } from '../../../src/repositories/GreetingRepository';
import { requestHandler } from '../../../src/utility/requestHandler'

jest.mock('../../../src/utility/requestHandler');

const getFullName = (data: SayLocalHelloParameters) => `${data.title} ${data.firstName} ${data.lastName}`;

const requestHandlerMock = (requestHandler as jest.Mock);

const FUNCTION_NAME = GreetingRepository.name;

afterEach(() => {
    requestHandlerMock.mockReset();
});

describe(`${FUNCTION_NAME} handler`, () => {

    test('sayEnglishHello Valid input', async () => {
        const data: SayLocalHelloParameters = { title: 'Mr', firstName: 'kenan', lastName: 'hancer' };

        const getFullNameResponse = getFullName(data);

        const requestHandlerResponse = `Hello ${getFullNameResponse}`;

        requestHandlerMock.mockReturnValue(requestHandlerResponse);

        const response = await GreetingRepository.defaultInstance.sayEnglishHello(data);

        expect(requestHandlerMock).toHaveBeenCalledTimes(1);

        const expectedResponse = requestHandlerMock.mock.results[0].value;

        expect(response).toEqual(expectedResponse);

    });

    test('sayTurkishHello Valid input', async () => {
        const data: SayLocalHelloParameters = { title: 'Mr', firstName: 'kenan', lastName: 'hancer' };

        const getFullNameResponse = getFullName(data);

        const requestHandlerResponse = `Merhaba ${getFullNameResponse}`;

        requestHandlerMock.mockReturnValue(requestHandlerResponse);

        const response = await GreetingRepository.defaultInstance.sayTurkishHello(data);

        expect(requestHandlerMock).toHaveBeenCalledTimes(1);

        const expectedResponse = requestHandlerMock.mock.results[0].value;

        expect(response).toEqual(expectedResponse);

    });

    it('getFullName valid input', async () => {
        const data: SayLocalHelloParameters = { title: 'Mr', firstName: 'kenan', lastName: 'hancer' };

        const requestHandlerResponse = `${data.title} ${data.firstName} ${data.lastName}`;

        requestHandlerMock.mockReturnValue(requestHandlerResponse);

        const response = await GreetingRepository.defaultInstance.getFullName(data);

        expect(requestHandlerMock).toHaveBeenCalledTimes(1);

        const expectedResponse = requestHandlerMock.mock.results[0].value;

        expect(response).toEqual(expectedResponse);
    });
});

