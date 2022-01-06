import { DownstreamEndpoints, config, SendGridPayload } from "../domain";
import { Email } from "./Email";
import { requestHandler } from '../utility';

export class EmailRepository implements Email {

    static defaultInstance: Email = new EmailRepository(config.dods.downstreamEndpoints);

    constructor(private config: DownstreamEndpoints) { }

    async sendEmail(data: SendGridPayload): Promise<any> {
        return await requestHandler({ url: config.sendGrid.apiEndpoint, headers: { 'Authorization': `Bearer ${config.sendGrid.apiKey}` }, data, method: 'post' })
    }
}
