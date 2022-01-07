import { SendEmailInput, SendGridPayload } from "..";

export const mapDataToSendGridInput = (data: SendEmailInput): SendGridPayload => {
    const payload = {
        "personalizations": [{
            "to": data.to.map(to => ({ "email": to }))
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
    return payload;
}
