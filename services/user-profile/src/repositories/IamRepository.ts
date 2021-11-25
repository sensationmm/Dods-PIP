import axios from 'axios';

import { config, CreateUserOutput, IamPersister, RequestOutput, UserAttributes } from '../domain';

const { dods: { downstreamEndpoints: { apiGatewayBaseURL } } } = config;

export class IamRepository implements IamPersister {
    static defaultInstance: IamPersister = new IamRepository();

    constructor(private baseURL: string = apiGatewayBaseURL) { }

    async createUser(email: string, clientAccountId: string, clientAccountName: string): Promise<RequestOutput<CreateUserOutput>> {

        const user = await axios.post(`${this.baseURL}/createUser`, { email, clientAccountId, clientAccountName });

        const { data: { success, data, error } } = user;

        return { success, data, error };
    }

    async updateUserAttributes(email: string, userAttributes: Array<UserAttributes>): Promise<void> {
        await axios.post(`${this.baseURL}/updateUserAttributes`, { email, userAttributes });
    }
}