import axios from 'axios';
import { config } from '../domain';

const { dods: { downstreamEndpoints: { apiGatewayBaseURL } } } = config;

export class UserProfileServiceRepository {
    static defaultInstance = new UserProfileServiceRepository();

    constructor(private baseURL: string = apiGatewayBaseURL) { }

    async createUser(userParameters: any) {
        const user = await axios.post(`${this.baseURL}/user`, userParameters);

        if (user.data.success) return user.data.data;
    }
}
