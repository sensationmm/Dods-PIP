import { AxiosInstance } from 'axios';
import { userProfileServiceGateway } from '../services';

export class UserProfileServiceRepository {
    static defaultInstance = new UserProfileServiceRepository(userProfileServiceGateway);
    constructor(private gateway: AxiosInstance) {}

    async createUser(userParameters: any) {
        const user = await this.gateway.post('/user', userParameters);

        if (user.data.success) return user.data;
    }
}
