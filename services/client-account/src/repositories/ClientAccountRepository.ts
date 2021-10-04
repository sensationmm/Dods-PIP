import { Op, WhereOptions } from 'sequelize';
import { ClientAccountModel, ClientAccountTeamModel, SubscriptionTypeModel, UserProfileModel } from '../db';
import SubscriptionType from "../db/models/SubscriptionType";
import {
    SearchClientAccountParameters,
    ClientAccountPersister,
    ClientAccountResponse,
    SearchClientAccountResponse,
    ClientAccount,
    parseModelParameters,
    parseResponseFromModel,
    parseSearchClientAccountResponse
} from '../domain';

export class ClientAccountRepository implements ClientAccountPersister {
    static defaultInstance: ClientAccountPersister = new ClientAccountRepository(ClientAccountModel);

    constructor(private model: typeof ClientAccountModel) { }

    async createClientAccount(clientAccount: ClientAccount): Promise<ClientAccountResponse> {
        if (!clientAccount) {
            throw new Error('Error: clientAccount cannot be empty');
        }

        const newClientAccountModel = await this.model.create(
            parseModelParameters(clientAccount)
        );
        const newClientAccount = parseResponseFromModel(newClientAccountModel);

        return newClientAccount;
    }

    async getClientAccount(clientAccountId: string): Promise<ClientAccountResponse> {
        if (!clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        const clientAccountModel = await this.model.findOne({
            where: { uuid: clientAccountId }, include: [SubscriptionType]
        });

        if (clientAccountModel) {
            const clientAccount = parseResponseFromModel(clientAccountModel);

            return clientAccount;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async findOne(where: Record<string, any>): Promise<ClientAccountResponse> {

        const clientAccountModel = await this.model.findOne({ where, include: [SubscriptionType] });

        if (clientAccountModel) {
            const clientAccount = parseResponseFromModel(clientAccountModel);

            return clientAccount;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async searchClientAccount(searchClientAccountParams: SearchClientAccountParameters): Promise<Array<SearchClientAccountResponse>> {
        const { startsBy, locations, subscriptionTypes, searchTerm } = searchClientAccountParams
        const { limit, offset } = searchClientAccountParams

        let clientAccountWhere: WhereOptions = {}

        if (startsBy) {
            clientAccountWhere['name'] = {
                [Op.like]: `${startsBy}%`,
            }
        }
        if (locations) {
            clientAccountWhere['$SubscriptionType.location$'] = { [Op.in]: locations }
        }
        if (subscriptionTypes) {
            clientAccountWhere['$SubscriptionType.id$'] = { [Op.in]: subscriptionTypes }
        }
        if (searchTerm) {
            clientAccountWhere['name'] = {
                [Op.like]: `%${searchTerm}%`
            }
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
                    include: [UserProfileModel]
                },
            ],
            offset: offset,
            limit: limit,
        });
        if (clientAccountModels) {
            const clientAccounts: Array<SearchClientAccountResponse> = clientAccountModels.map(
                model => parseSearchClientAccountResponse(model)
            );

            return clientAccounts;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }
}
