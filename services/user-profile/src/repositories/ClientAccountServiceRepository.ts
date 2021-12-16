import axios, { AxiosResponse } from 'axios';

import { config } from '../domain';

const {
    dods: {
        downstreamEndpoints: { apiGatewayBaseURL },
    },
} = config;

export class ClientAccountServiceRepository {
    static defaultInstance = new ClientAccountServiceRepository();

    constructor(private baseURL: string = apiGatewayBaseURL) {}

    async getRemainingSeats(clientAccountId: string): Promise<number> {
        const response: AxiosResponse<{
            success: boolean;
            message: string;
            data: number;
        }> = await axios.get(`${this.baseURL}/clientaccount/${clientAccountId}/seats`);

        if (response.data.success) {
            return response.data.data;
        } else {
            throw Error(
                `Error: Client Account Service responded with error: ${JSON.stringify(response)}`
            );
        }
    }
}
