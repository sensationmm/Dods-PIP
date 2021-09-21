import {
    ClientAccountParameters,
    ClientAccountPersister,
    ClientAccountResponse,
} from '../domain';

import { ClientAccountModel } from '../db/models';
import { ClientAccountModelCreationAttributes } from '../db/types';

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
            where: { uuid: clientAccountId },
        });

        if (clientAccountModel) {
            const clientAccount = parseResponseFromModel(clientAccountModel);

            return clientAccount;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }
}
