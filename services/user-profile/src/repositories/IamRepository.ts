import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { config, CreateUserOutput, IamPersister, RequestOutput } from '../domain';

const { dods: { downstreamEndpoints: { apiGatewayBaseURL } } } = config;

export class IamRepository implements IamPersister {
    private axiosInstance: AxiosInstance;

    static defaultInstance: IamPersister = new IamRepository();

    constructor(baseURL: string = apiGatewayBaseURL) {

        const requestConfig: AxiosRequestConfig = {
            baseURL,
            timeout: 10 * 1000,
        };

        this.axiosInstance = axios.create(requestConfig);
    }

    async createUser(email: string, clientAccountId: string, clientAccountName: string): Promise<RequestOutput<CreateUserOutput>> {
        const user = await this.axiosInstance.post('/createUser', { email, clientAccountId, clientAccountName });

        const { data: { success, data, error } } = user;

        return { success, data, error };
    }
}