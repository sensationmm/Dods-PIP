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
import { Op, ValidationError, WhereOptions } from 'sequelize';

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
        clientAccount: ClientAccountParameters | null
    ): Promise<ClientAccountResponse | undefined> {
        if (!clientAccount) {
            throw new Error('Error: clientAccount cannot be empty');
        }

        try {
            const newClientAccountModel = await this.model.create(
                parseModelParameters(clientAccount)
            );
            const newClientAccount = parseResponseFromModel(
                newClientAccountModel
            );

            return newClientAccount;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new ClientAccountError(
                    'Error: Bad request',
                    error.errors
                );
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
            include: [this.subsModel],
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
            include: [this.subsModel],
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
                {
                    model: SubscriptionTypeModel,
                    required: false,
                },
                {
                    model: ClientAccountTeamModel,
                    required: false,
                    include: [UserProfileModel],
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

            let subscriptionId: number;

            if (subscriptionData) {
                subscriptionId = subscriptionData.id;
            } else {
                throw new Error('Error: Wrong subscription uuid');
            }

            // Save directly if comes as a parameter
            //clientAccountToUpdate.subscription=updateParameters.subscription;

            clientAccountToUpdate.subscription = subscriptionId;
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

            const updateRecord = await clientAccountToUpdate.save();

            const newClientAccount = parseResponseFromModel(updateRecord);

            return newClientAccount;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async getClientAccountSeats(
        clientAccountId: string
    ): Promise<number | never[]> {
        if (!clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        const clientAccountModel = await this.model.findOne({
            where: { uuid: clientAccountId },
        });

        if (clientAccountModel) {
            const subscriptionSeats: number =
                clientAccountModel.subscriptionSeats;
            return subscriptionSeats;
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
}
