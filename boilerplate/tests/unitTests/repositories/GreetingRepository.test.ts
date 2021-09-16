import { SayLocalHelloParameters } from '../../../src/domain';
import { GreetingRepository } from '../../../src/repositories/GreetingRepository';
import { requestHandler } from '../../../src/utility/requestHandler'

jest.mock('../../../src/utility/requestHandler');

const getFullName = (data: SayLocalHelloParameters) => `${data.title} ${data.firstName} ${data.lastName}`;

const requestHandlerMock = (requestHandler as jest.Mock);

const FUNCTION_NAME = "GreetingRepository";

afterEach(() => {
    requestHandlerMock.mockReset();
});

describe(`${FUNCTION_NAME} handler`, () => {

    test('sayEnglishHello Valid input', async () => {
        const data: SayLocalHelloParameters = { title: 'Mr', firstName: 'kenan', lastName: 'hancer' };

        const getFullNameResponse = getFullName(data);

        const requestHandlerResponse = `Hello ${getFullNameResponse}`;

        requestHandlerMock.mockImplementation(() => requestHandlerResponse);

        const response = await GreetingRepository.defaultInstance.sayEnglishHello(data);

        expect(response).toEqual(requestHandlerResponse);

        // expect(requestHandlerMock).toHaveBeenCalledWith(data);

        expect(requestHandlerMock).toHaveReturnedWith(requestHandlerResponse);
    });

    test('sayTurkishHello Valid input', async () => {
        const data: SayLocalHelloParameters = { title: 'Mr', firstName: 'kenan', lastName: 'hancer' };

        const getFullNameResponse = getFullName(data);

        const requestHandlerResponse = `Merhaba ${getFullNameResponse}`;

        requestHandlerMock.mockImplementation(() => requestHandlerResponse);

        const response = await GreetingRepository.defaultInstance.sayTurkishHello(data);

        expect(response).toEqual(requestHandlerResponse);

        // expect(requestHandlerMock).toHaveBeenCalledWith(data);

        expect(requestHandlerMock).toHaveReturnedWith(requestHandlerResponse);
    });
});

