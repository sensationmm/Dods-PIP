import {
    Op, WhereOptions
} from 'sequelize';
import {
    ClientAccountParameters,
    SearchClientAccountParameters,
    ClientAccountPersister,
    ClientAccountResponse,
} from '../domain';

import { ClientAccountModel, SubscriptionTypeModel } from '../db/models';
import { ClientAccountModelCreationAttributes } from '../db/types';
import SubscriptionType from "../db/models/SubscriptionType";

function parseResponseFromModel(
    model: ClientAccountModel
): ClientAccountResponse {
    const response: ClientAccountResponse = {
        id: model.uuid,
        name: model.name,
        notes: model.notes,
        contact_name: model.contactName,
        contact_email_address: model.contactEmailAddress,
        contact_telephone_number: model.contactTelephoneNumber,
        contract_start_date: model.contractStartDate.toJSON(),
        contract_rollover: model.contractRollover,
        contract_end_date: model.contractEndDate
            ? model.contractEndDate.toJSON()
            : undefined,
        // SubscriptionType: model.SubscriptionType ? model.SubscriptionType : undefined,
        subscription: model.SubscriptionType
    };

    return response;
}

function parseModelParameters(
    requestParameters: ClientAccountParameters
): ClientAccountModelCreationAttributes {
    const parameters: ClientAccountModelCreationAttributes = {
        name: requestParameters.name,
        notes: requestParameters.notes,
        contactName: requestParameters.contact_name,
        contactEmailAddress: requestParameters.contact_email_address,
        contactTelephoneNumber: requestParameters.contact_telephone_number,
        contractStartDate: new Date(requestParameters.contract_start_date),
        contractRollover: requestParameters.contract_rollover,
        contractEndDate: requestParameters.contract_end_date
            ? new Date(requestParameters.contract_end_date)
            : null,
    };

    return parameters;
}

export class ClientAccountRepository implements ClientAccountPersister {
    static defaultInstance: ClientAccountPersister =
        new ClientAccountRepository(ClientAccountModel);

    constructor(private model: typeof ClientAccountModel) {}

    async createClientAccount(
        clientAccount: ClientAccountParameters
    ): Promise<ClientAccountResponse> {
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

    async searchClientAccount(searchClientAccountParams: SearchClientAccountParameters): Promise<Array<ClientAccountResponse>> {
        const { startsBy, locations, subscriptionTypes, searchTerm } = searchClientAccountParams
        const { limit, offset } = searchClientAccountParams

        let clientAccountWhere: WhereOptions = {}
        let subscriptionTypeWhere: WhereOptions = {}

        if (startsBy) {
            clientAccountWhere['name'] = {
                [Op.like]: `${startsBy}%`
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
                    required: false
                }
            ],
            offset: offset,
            limit: limit,
        });
        if (clientAccountModels) {
            const parsedModels: Array<ClientAccountResponse> = clientAccountModels.map(model => parseResponseFromModel(model))
            const clientAccounts: Array<ClientAccountResponse> = parsedModels;

            return clientAccounts;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }
}
