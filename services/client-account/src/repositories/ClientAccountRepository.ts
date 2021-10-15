import {
    ClientAccountModel,
    ClientAccountTeamModel,
    SubscriptionTypeModel,
    UserProfileModel,
} from '../db/models';
import {
    ClientAccountParameters,
    ClientAccountPersister,
    ClientAccountResponse,
    SearchClientAccountParameters,
    SearchClientAccountResponse,
    UpdateClientAccountParameters,
    parseModelParameters,
    parseResponseFromModel,
    parseSearchClientAccountResponse,
} from '../domain';
import { Op, WhereOptions, col, fn, where } from 'sequelize';

export class ClientAccountError extends Error {
    constructor(message: string, cause: any) {
        super(message);
        this.name = 'ClientAccountError';
        this.cause = cause;
    }

    public cause: any;
}
export class ClientAccountRepository implements ClientAccountPersister {
    static defaultInstance: ClientAccountPersister =
        new ClientAccountRepository(
            ClientAccountModel,
            SubscriptionTypeModel,
            UserProfileModel
        );

    constructor(
        private model: typeof ClientAccountModel,
        private subsModel: typeof SubscriptionTypeModel,
        private userModel: typeof UserProfileModel
    ) {}

    async createClientAccount(
        clientAccountParameters: ClientAccountParameters | null
    ): Promise<ClientAccountResponse | undefined> {
        if (!clientAccountParameters?.clientAccount) {
            throw new Error('Error: clientAccount cannot be empty');
        } else {
            try {
                const newAccount = parseModelParameters(
                    clientAccountParameters
                );

                const newClientAccountModel = await this.model.create(
                    newAccount
                );
                const newClientAccount = parseResponseFromModel(
                    newClientAccountModel
                );

                return newClientAccount;
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    }

    async getClientAccount(
        clientAccountId: string
    ): Promise<ClientAccountResponse> {
        if (!clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        const clientAccountModel = await this.model.findOne({
            where: { uuid: clientAccountId },
            include: ['subscriptionType'],
        });

        if (clientAccountModel) {
            const clientAccount = parseResponseFromModel(clientAccountModel);

            return clientAccount;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async findOne(where: Record<string, any>): Promise<ClientAccountResponse> {
        const clientAccountModel = await this.model.findOne({
            where,
            include: ['subscriptionType'],
        });

        if (clientAccountModel) {
            const clientAccount = parseResponseFromModel(clientAccountModel);

            return clientAccount;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async searchClientAccount(
        searchClientAccountParams: SearchClientAccountParameters
    ): Promise<Array<SearchClientAccountResponse> | undefined> {
        const { startsBy, locations, subscriptionTypes, searchTerm } =
            searchClientAccountParams;
        const { limit, offset } = searchClientAccountParams;

        let clientAccountWhere: WhereOptions = {};

        if (startsBy) {
            clientAccountWhere['name'] = {
                [Op.like]: `${startsBy}%`,
            };
        }
        if (locations) {
            clientAccountWhere['$SubscriptionType.location$'] = {
                [Op.in]: locations,
            };
        }
        if (subscriptionTypes) {
            clientAccountWhere['$SubscriptionType.id$'] = {
                [Op.in]: subscriptionTypes,
            };
        }
        if (searchTerm) {
            clientAccountWhere['name'] = {
                [Op.like]: `%${searchTerm}%`,
            };
        }
        const clientAccountModels = await this.model.findAll({
            where: clientAccountWhere,
            subQuery: false,
            include: [
                'subscriptionType',
                {
                    model: ClientAccountTeamModel,
                    required: false,
                    include: [this.userModel],
                },
            ],
            offset: offset,
            limit: limit,
        });
        if (clientAccountModels) {
            const clientAccounts: Array<SearchClientAccountResponse> =
                clientAccountModels.map((model) =>
                    parseSearchClientAccountResponse(model)
                );

            return clientAccounts;
        } else {
            return [];
        }
    }

    async updateClientAccount(
        updateParameters: UpdateClientAccountParameters
    ): Promise<ClientAccountResponse | never[]> {
        if (!updateParameters.clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        const clientAccountToUpdate = await this.model.findOne({
            where: { uuid: updateParameters.clientAccountId },
            include: 'subscriptionType',
        });

        if (clientAccountToUpdate) {
            const subscriptionData = await this.subsModel.findOne({
                where: { uuid: updateParameters.subscription },
            });

            if (!subscriptionData) {
                throw new Error('Error: Wrong subscription uuid');
            }

            //clientAccountToUpdate.SubscriptionType = subscriptionData;

            await clientAccountToUpdate.setSubscriptionType(subscriptionData);

            clientAccountToUpdate.subscriptionSeats =
                updateParameters.subscription_seats;
            clientAccountToUpdate.consultantHours =
                updateParameters.consultant_hours;
            clientAccountToUpdate.contractStartDate = new Date(
                updateParameters.contract_start_date
            );
            clientAccountToUpdate.contractRollover =
                updateParameters.contract_rollover;
            if (updateParameters.contract_end_date)
                clientAccountToUpdate.contractEndDate = new Date(
                    updateParameters.contract_end_date
                );

            await clientAccountToUpdate.save();

            let updatedClientAccount = await this.model.findOne({
                where: { uuid: updateParameters.clientAccountId },
                include: 'subscriptionType',
            });

            if (updatedClientAccount) {
                const newClientAccount =
                    parseResponseFromModel(updatedClientAccount);
                return newClientAccount;
            }
            return [];
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async getClientAccountSeats(clientAccountId: string): Promise<number> {
        if (!clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        const clientAccountModel = await this.model.findOne({
            where: { uuid: clientAccountId },
        });

        if (clientAccountModel) {
            const subscriptionSeats = clientAccountModel.subscriptionSeats;
            return subscriptionSeats!;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async getClientAccountUsers(clientAccountId: string): Promise<number> {
        if (!clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        const clientAccountModel = await this.model.findOne({
            where: { uuid: clientAccountId },
            include: this.userModel,
        });

        if (clientAccountModel) {
            const UsersPerClientObj: any =
                clientAccountModel.get('UserProfileModels');
            const occupiedSeats = Object.keys(UsersPerClientObj).length;
            return occupiedSeats;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async checkNameAvailability(name: string): Promise<boolean> {
        const lowerCaseName = name.trim().toLocaleLowerCase();

        const coincidences = await this.model.findAll({
            where: {
                name: where(
                    fn('LOWER', col('name')),
                    'LIKE',
                    '%' + lowerCaseName + '%'
                ),
            },
        });

        return coincidences.length == 0;
    }

    async UpdateCompletion(
        clientAccountId: string,
        isCompleted: boolean,
        lastStepCompleted: number
    ): Promise<boolean> {
        if (!clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        const clientAccountModel = await this.model.findOne({
            where: { uuid: clientAccountId },
        });

        if (clientAccountModel) {
            clientAccountModel.isCompleted = isCompleted;
            clientAccountModel.lastStepCompleted = lastStepCompleted;

            clientAccountModel.save();

            return true;
        }
        return false;
    }
}
