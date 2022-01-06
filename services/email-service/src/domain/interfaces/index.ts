export type MimeType = "application/json" | "application/xml" | "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain" | "text/html" | "application/pdf" | "image/png";

export interface SendGridPayload {
    personalizations: [{
        to: [{
            email: string
        }]
    }],
    from: {
        email: string
    },
    subject: string,
    content: [{
        type: MimeType,
        value: string
    }]
}

export interface SendEmailInput {
    to: string[];
    from: string;
    subject: string;
    mimeType: MimeType;
    content: string;
}

export interface DownstreamEndpoints {
    apiGatewayBaseURL: string;
    sendEmailUrl: string;
}
