import { AsyncLambdaHandler } from '@dodsgroup/dods-lambda';
import { SendEmailInput, SendGridPayload } from '../../domain';
import { EmailRepository } from '../../repositories/EmailRepository';

export const sendEmail: AsyncLambdaHandler<SendEmailInput> = async (data) => {

    const input = {
        "personalizations": [{
            "to": [{
                "email": data.to[0]
            }]
        }],
        "from": {
            "email": data.from
        },
        "subject": data.subject,
        "content": [{
            "type": data.mimeType,
            "value": data.content
        }]
    } as SendGridPayload;

    const response = await EmailRepository.defaultInstance.sendEmail(input);

    return response;
};