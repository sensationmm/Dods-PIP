import {ClientAccountPersister, ClientAccountResponse} from '../domain';
import { ClientAccountModel } from '../db/models';

function parseResponseFromModel(
    model: ClientAccountModel
): ClientAccountResponse {
    const response: ClientAccountResponse = {
        id: model.id,
        uuid: model.uuid,
        name: model.name,
        notes: model.notes,
        contact_name: model.contactName,
        contact_email_address: model.contactEmailAddress,
        contact_telephone_number: model.contactTelephoneNumber,
        contract_start_date: model.contractStartDate.toJSON(),
        contract_rollover: model.contractRollover,
        subscription: model.SubscriptionType,
        contract_end_date: model.contractEndDate
            ? model.contractEndDate.toJSON()
            : undefined,
    };

    return response;
}

export class ClientAccountRepository implements ClientAccountPersister {
    static defaultInstance: ClientAccountPersister =
        new ClientAccountRepository(ClientAccountModel);

    constructor(private model: typeof ClientAccountModel) {}

    async getClientAccount(
        clientAccountId: string
    ): Promise<ClientAccountResponse> {
        if (!clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        const clientAccountModel = await this.model.findOne({
            where: { uuid: clientAccountId }, include: ["SubscriptionType"]
        });

        if (clientAccountModel) {
            const clientAccount = parseResponseFromModel(clientAccountModel);

            return clientAccount;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }
}