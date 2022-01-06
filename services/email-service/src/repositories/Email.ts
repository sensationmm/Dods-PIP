import { SendGridPayload } from "../domain";

export interface Email {
    sendEmail(data: SendGridPayload): Promise<string>;
}