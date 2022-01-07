import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { mapDataToSendGridInput, SendEmailInput } from '../../domain';
import { EmailRepository } from '../../repositories/EmailRepository';

export const sendEmail: AsyncLambdaHandler<SendEmailInput> = async (data) => {

    try {
        await EmailRepository.defaultInstance.sendEmail(mapDataToSendGridInput(data));
        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'email sent'
        });
    } catch (error: any) {
        const responseStatus = error.response.status;

        // SendGrid API errors: https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api/errors
        if (responseStatus === 401 || responseStatus === 406) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: 'A parameter in the header or authorization is missing.',
            });
        } else if (responseStatus === 400) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: error.response.data.errors[0].message || 'A field in the request payload is not correct.',
            });
        } else if (responseStatus === 429) {
            return new HttpResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, {
                success: false,
                message: 'The rate limit was exceeded.',
            });
        } else {
            return new HttpResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, {
                success: false,
                message: 'An error occurred calling the third-party API. Try again in a while.',
            });
        }
    }
};
