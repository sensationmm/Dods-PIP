import { mapDataToSendGridInput, SendEmailInput, SendGridPayload } from '../../../src/domain';
import { sendEmail } from '../../../src/handlers/sendEmail/sendEmail';
import { EmailRepository } from '../../../src/repositories/EmailRepository';
import { mocked } from 'jest-mock';
import { createContext } from '@dodsgroup/dods-lambda';

jest.mock("../../../src/repositories/EmailRepository");

const mockedEmailRepository = mocked(EmailRepository, true);
const defaultContext = createContext();
const FUNCTION_NAME = sendEmail.name;

afterEach(() => {
    mockedEmailRepository.mockReset();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} should be successful`, async () => {
        mockedEmailRepository.defaultInstance.sendEmail.mockImplementation(async (_data: SendGridPayload) => ({}))

        const data: SendEmailInput = {
            "to": ["nxb@somoglobal.com"],
            "from": "test@somoglobal.com",
            "subject": "Test subject",
            "mimeType": "text/html",
            "content": "<h1>This is the way</h1><p>Hello test</p>"
        }

        const response = await sendEmail(data, defaultContext);

        expect(mockedEmailRepository.defaultInstance.sendEmail).toHaveBeenCalledWith(mapDataToSendGridInput(data));
        expect(response).toEqual({ statusCode: 200, body: '{"success":true,"message":"email sent"}' });
    });

    test(`${FUNCTION_NAME} should return BAD_REQUEST with custom message error if coming status is 401 - Requires authentication`, async () => {
        mockedEmailRepository.defaultInstance.sendEmail.mockImplementation(async (_data: SendGridPayload) => {
            throw { response: { status: 401 }, name: new Error() }
        })

        const data: SendEmailInput = {
            "to": ["nxb@somoglobal.com"],
            "from": "test@somoglobal.com",
            "subject": "Test subject",
            "mimeType": "text/html",
            "content": "<h1>This is the way</h1><p>Hello test</p>"
        }

        const response = await sendEmail(data, defaultContext);

        expect(mockedEmailRepository.defaultInstance.sendEmail).toHaveBeenCalledWith(mapDataToSendGridInput(data));
        expect(response).toEqual({ statusCode: 400, body: '{"success":false,"message":"A parameter in the header or authorization is missing."}' });
    });

    test(`${FUNCTION_NAME} should return BAD_REQUEST with custom message error if coming status is 406 - Missing Accept header`, async () => {
        mockedEmailRepository.defaultInstance.sendEmail.mockImplementation(async (_data: SendGridPayload) => {
            throw { response: { status: 406 }, name: new Error() }
        })

        const data: SendEmailInput = {
            "to": ["nxb@somoglobal.com"],
            "from": "test@somoglobal.com",
            "subject": "Test subject",
            "mimeType": "text/html",
            "content": "<h1>This is the way</h1><p>Hello test</p>"
        }

        const response = await sendEmail(data, defaultContext);

        expect(mockedEmailRepository.defaultInstance.sendEmail).toHaveBeenCalledWith(mapDataToSendGridInput(data));
        expect(response).toEqual({ statusCode: 400, body: '{"success":false,"message":"A parameter in the header or authorization is missing."}' });
    });

    test(`${FUNCTION_NAME} should return BAD_REQUEST with custom message error if coming status is 400 without a customized message`, async () => {
        mockedEmailRepository.defaultInstance.sendEmail.mockImplementation(async (_data: SendGridPayload) => {
            throw { response: { status: 400 }, name: new Error() }
        })

        const data: SendEmailInput = {
            "to": ["nxb@somoglobal.com"],
            "from": "test@somoglobal.com",
            "subject": "Test subject",
            "mimeType": "text/html",
            "content": "<h1>This is the way</h1><p>Hello test</p>"
        }

        const response = await sendEmail(data, defaultContext);

        expect(mockedEmailRepository.defaultInstance.sendEmail).toHaveBeenCalledWith(mapDataToSendGridInput(data));
        expect(response).toEqual({ statusCode: 400, body: '{"success":false,"message":"A field in the request payload is not correct."}' });
    });

    test(`${FUNCTION_NAME} should return INTERNAL_SERVER_ERROR with custom message error if coming status is 429 - Too many requests/Rate limit exceeded`, async () => {
        mockedEmailRepository.defaultInstance.sendEmail.mockImplementation(async (_data: SendGridPayload) => {
            throw { response: { status: 429 }, name: new Error() }
        })

        const data: SendEmailInput = {
            "to": ["nxb@somoglobal.com"],
            "from": "test@somoglobal.com",
            "subject": "Test subject",
            "mimeType": "text/html",
            "content": "<h1>This is the way</h1><p>Hello test</p>"
        }

        const response = await sendEmail(data, defaultContext);

        expect(mockedEmailRepository.defaultInstance.sendEmail).toHaveBeenCalledWith(mapDataToSendGridInput(data));
        expect(response).toEqual({ statusCode: 500, body: '{"success":false,"message":"The rate limit was exceeded."}' });
    });
    
    test(`${FUNCTION_NAME} should return INTERNAL_SERVER_ERROR with custom message error if coming status is 500 or unknown`, async () => {
        mockedEmailRepository.defaultInstance.sendEmail.mockImplementation(async (_data: SendGridPayload) => {
            throw { response: { status: 500 }, name: new Error() }
        })

        const data: SendEmailInput = {
            "to": ["nxb@somoglobal.com"],
            "from": "test@somoglobal.com",
            "subject": "Test subject",
            "mimeType": "text/html",
            "content": "<h1>This is the way</h1><p>Hello test</p>"
        }

        const response = await sendEmail(data, defaultContext);

        expect(mockedEmailRepository.defaultInstance.sendEmail).toHaveBeenCalledWith(mapDataToSendGridInput(data));
        expect(response).toEqual({ statusCode: 500, body: '{"success":false,"message":"An error occurred calling the third-party API. Try again in a while."}' });
    });
});
