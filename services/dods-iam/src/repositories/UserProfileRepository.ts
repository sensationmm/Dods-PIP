import axios from 'axios';

import { config, GetUserInput, GetUserOutput, UserProfile } from "../domain";

const { dods: { downstreamEndpoints: { apiGatewayBaseURL } } } = config;

export class UserProfileRepository implements UserProfile {

    static defaultInstance: UserProfile = new UserProfileRepository();

    constructor(private baseURL: string = apiGatewayBaseURL) { }

    async getUser(parameters: GetUserInput): Promise<GetUserOutput> {
        const user = await axios.get(`${this.baseURL}/user/${parameters.userId}`);

        const { data: { data } } = user;

        return data;
    }
}