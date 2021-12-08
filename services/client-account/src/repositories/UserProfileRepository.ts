import { CreateUserOutput, CreateUserPersisterInput, RequestOutput, UserProfilePersister, config } from '../domain';
import { UserProfileModel, UserProfileModelAttributes } from '../db';
import { col, fn, where } from 'sequelize';

import axios from 'axios';

const { dods: { downstreamEndpoints: { apiGatewayBaseURL } } } = config;

export class UserProfileRepository implements UserProfilePersister {
    static defaultInstance: UserProfilePersister = new UserProfileRepository(UserProfileModel);

    constructor(private userModel: typeof UserProfileModel, private baseURL: string = apiGatewayBaseURL) { }

    async findOne(where: Partial<UserProfileModelAttributes>): Promise<UserProfileModel> {
        const clientAccountModel = await this.userModel.findOne({ where });

        if (clientAccountModel) {
            return clientAccountModel;
        } else {
            throw new Error('Error: userProfile not found');
        }
    }

    async checkUserEmailAvailability(primaryEmailAddress: string): Promise<boolean> {
        const lowerCaseEmail = primaryEmailAddress.trim().toLocaleLowerCase();
        const coincidences = await this.userModel.findAll({
            where: {
                primaryEmail: where(
                    fn('LOWER', col('primary_email')),
                    'LIKE',
                    lowerCaseEmail
                ),
            },
        });

        return coincidences.length == 0;
    }

    async createUser(parameters: CreateUserPersisterInput): Promise<RequestOutput<CreateUserOutput>> {
        const response = await axios.post(`${this.baseURL}/users`, parameters);

        const { data: { success, User, error } } = response;

        return { success, data: User, error };
    }

    async updateUser(values: Partial<UserProfileModelAttributes>, where: Partial<UserProfileModelAttributes>): Promise<void> {
        await this.userModel.update(values, { where });
    }
}