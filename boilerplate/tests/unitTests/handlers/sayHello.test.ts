import { SayHelloParameters, SayLocalHelloParameters } from '../../../src/domain';
import { sayHello } from '../../../src/handlers/sayHello/sayHello';
import { GreetingRepository } from '../../../src/repositories/GreetingRepository';

const getFullName = (data: SayLocalHelloParameters) => `${data.title} ${data.firstName} ${data.lastName}`;
const sayTurkishHello = (data: SayLocalHelloParameters) => `Merhaba ${getFullName(data)}`;
const sayEnglishHello = (data: SayLocalHelloParameters) => `Hello ${getFullName(data)}`;

jest.mock("../../../src/repositories/GreetingRepository", () => {
    return {
        GreetingRepository: {
            defaultInstance: {
                getFullName: jest.fn((data: SayLocalHelloParameters) => getFullName(data)),
                sayTurkishHello: jest.fn((data: SayLocalHelloParameters) => sayTurkishHello(data)),
                sayEnglishHello: jest.fn((data: SayLocalHelloParameters) => sayEnglishHello(data))
            }
        }
    };
});

const sayTurkishHelloMock = (GreetingRepository.defaultInstance.sayTurkishHello as jest.Mock);
const sayEnglishHelloMock = (GreetingRepository.defaultInstance.sayEnglishHello as jest.Mock);

const FUNCTION_NAME = sayHello.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} as English`, async () => {
        const data: SayHelloParameters = { language: 'English', title: 'Mr', firstName: 'kenan', lastName: 'hancer' };

        const response = await sayHello(data);

        const englishGreeting = sayEnglishHello(data);

        expect(response).toEqual(englishGreeting);

        expect(sayEnglishHelloMock).toHaveBeenCalledWith(data);

        expect(sayEnglishHelloMock).toHaveReturnedWith(englishGreeting);
    });

    test(`${FUNCTION_NAME} as Turkish`, async () => {
        const data: SayHelloParameters = { language: 'Turkish', title: 'Mr', firstName: 'kenan', lastName: 'hancer' };

        const response = await sayHello(data);

        const turkishGreeting = sayTurkishHello(data);

        expect(response).toEqual(turkishGreeting);

        expect(sayTurkishHelloMock).toHaveBeenCalledWith(data);

        expect(sayTurkishHelloMock).toHaveReturnedWith(turkishGreeting);
    });


    test(`${FUNCTION_NAME} as undefined`, async () => {
        const data = { title: 'Mr', firstName: 'kenan', lastName: 'hancer' } as SayHelloParameters;

        const response = await sayHello(data);

        expect(response).toEqual(undefined);

    });
});
