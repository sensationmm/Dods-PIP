import { mapDataToSendGridInput, SendEmailInput } from '../../../src/domain';
import { EmailRepository } from '../../../src/repositories/EmailRepository';
import { requestHandler } from '../../../src/utility/requestHandler'

jest.mock('../../../src/utility/requestHandler');

//const getFullName = (data: SayLocalHelloParameters) => `${data.title} ${data.firstName} ${data.lastName}`;

const requestHandlerMock = (requestHandler as jest.Mock);

const FUNCTION_NAME = EmailRepository.name;

afterEach(() => {
    requestHandlerMock.mockReset();
});

describe(`${FUNCTION_NAME} handler`, () => {

    test(`${FUNCTION_NAME} Valid input`, async () => {
        const data: SendEmailInput = {
            "to": ["nxb@somoglobal.com"],
            "from": "test@somoglobal.com",
            "subject": "Test subject",
            "mimeType": "text/html",
            "content": "<h1>This is the way</h1><p>Hello test</p>"
        }

        requestHandlerMock.mockReturnValue({ status: 200 });

        const response = await EmailRepository.defaultInstance.sendEmail(mapDataToSendGridInput(data));

        const expectedResponse = requestHandlerMock.mock.results[0].value;

        expect(response).toEqual(expectedResponse);
        expect(requestHandlerMock).toHaveBeenCalledTimes(1);
    });
});

