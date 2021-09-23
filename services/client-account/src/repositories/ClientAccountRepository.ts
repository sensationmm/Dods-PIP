import {
    Op, WhereOptions
} from 'sequelize';
import {
    ClientAccountParameters,
    SearchClientAccountParameters,
    ClientAccountPersister,
    ClientAccountResponse,
    SearchClientAccountResponse,
} from '../domain';

import { ClientAccountModel, ClientAccountTeamModel, SubscriptionTypeModel, UserProfileModel } from '../db/models';
import SubscriptionType from "../db/models/SubscriptionType";
import { parseModelParameters, parseResponseFromModel, parseSearchClientAccountResponse } from '../domain/interfaces/parser';

export class ClientAccountRepository implements ClientAccountPersister {
    static defaultInstance: ClientAccountPersister =
        new ClientAccountRepository(ClientAccountModel);

    constructor(private model: typeof ClientAccountModel) {}

    async createClientAccount(clientAccount: ClientAccountParameters): Promise<ClientAccountResponse> {
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

    async searchClientAccount(searchClientAccountParams: SearchClientAccountParameters): Promise<Array<SearchClientAccountResponse>> {
        const { startsBy, locations, subscriptionTypes, searchTerm } = searchClientAccountParams
        const { limit, offset } = searchClientAccountParams

        let clientAccountWhere: WhereOptions = {}
        let subscriptionTypeWhere: WhereOptions = {}

        if (startsBy) {
            clientAccountWhere['name'] = {
                [Op.like]: `${startsBy}%`,
            }
        }
        if (locations) {
            subscriptionTypeWhere['location'] = {
                [Op.in]: locations
            }
        }
        if (subscriptionTypes) {
            subscriptionTypeWhere['id'] = {
                [Op.in]: subscriptionTypes
            }
        }
        if (searchTerm) {
            clientAccountWhere['name'] = {
                [Op.like]: `%${searchTerm}%`
            }
        }
        const clientAccountModels = await this.model.findAll({
            where: clientAccountWhere,
            include: [
                {
                    model: SubscriptionTypeModel,
                    where: subscriptionTypeWhere,
                    required: false,
                },
                {
                    model: ClientAccountTeamModel,
                    required: false
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
    async getClientAccountSeats(
        clientAccountId: string
    ): Promise<number> {
        if (!clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        const clientAccountModel = await this.model.findOne({
            where: { uuid: clientAccountId },
        });

       if (clientAccountModel) {
            const subscriptionSeats:number= clientAccountModel.subscriptionSeats;
            return subscriptionSeats;
       }
       else {
        throw new Error('Error: clientAccount not found');
    }


    }

    async getClientAccountUsers(
        clientAccountId: string
    ): Promise<ClientAccountModel> {

        if (!clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        const clientAccountModel = await ClientAccountModel.findOne({
            where: { uuid: clientAccountId },
            include: UserProfileModel
        });

       if (clientAccountModel) {

            
            return clientAccountModel;
       }
       else {
            throw new Error('Error: clientAccount not found');
        }
    }

}
