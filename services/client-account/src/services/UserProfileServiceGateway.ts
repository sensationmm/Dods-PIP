import axios, { AxiosRequestConfig } from 'axios';

import { config } from '../domain';

const userProfileConfig: AxiosRequestConfig = {
    baseURL: config.dods.downstreamEndpoints.apiGatewayBaseURL + '/',
    timeout: 10 * 1000,
};

export const userProfileServiceGateway = axios.create(userProfileConfig);
