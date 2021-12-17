import { CreateUserOutput, CreateUserPersisterInput, RequestOutput, UserProfilePersisterV2, config } from '../domain';
import { User, UserInput, UserOutput } from '@dodsgroup/dods-model';
import { col, fn, where } from 'sequelize';

import axios from 'axios';

const { dods: { downstreamEndpoints: { apiGatewayBaseURL } } } = config;

export class UserProfileRepositoryV2 implements UserProfilePersisterV2 {
    static defaultInstance: UserProfilePersisterV2 = new UserProfileRepositoryV2();

    constructor(private baseURL: string = apiGatewayBaseURL) { }

    async findOne(where: Partial<UserInput>): Promise<UserOutput> {
        const result = await User.findOne({ where });

        if (result) {
            return result;
        } else {
            throw new Error('Error: userProfile not found');
        }
    }

    async checkUserEmailAvailability(primaryEmailAddress: string): Promise<boolean> {
        const lowerCaseEmail = primaryEmailAddress.trim().toLocaleLowerCase();
        const coincidences = await User.findAll({
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

    async updateUser(values: Partial<UserInput>, where: Partial<UserInput>): Promise<void> {
        await User.update(values, { where });
    }


    async deleteUser(userId: string): Promise<boolean> {
        const userProfile = await User.findOne({
            where: { uuid: userId },
        });

        if (userProfile) {
            User.destroy({
                where: {
                    uuid: userId,
                },
            });
            return true;
        } else {
            throw new Error('Error: user not found');
        }
    }
}
