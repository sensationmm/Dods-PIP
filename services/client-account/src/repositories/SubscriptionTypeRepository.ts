import {
    // ClientAccountParameters,
    // ClientAccountPersister,
    // ClientAccountResponse,
    SubscriptionTypeResponse,
} from '../domain';

import { SubscriptionTypeModel } from '../db/models';
import { SubscriptionTypePersister } from '../domain/interfaces/SubscriptionTypePersister';
// import { ClientAccountModelCreationAttributes } from '../db/types';

// function parseResponseFromModel(
//     model: ClientAccountModel
// ): ClientAccountResponse {
//     const response: ClientAccountResponse = {
//         id: model.uuid,
//         name: model.name,
//         notes: model.notes,
//         contact_name: model.contactName,
//         contact_email_address: model.contactEmailAddress,
//         contact_telephone_number: model.contactTelephoneNumber,
//         contract_start_date: model.contractStartDate.toJSON(),
//         contract_rollover: model.contractRollover,
//         contract_end_date: model.contractEndDate
//             ? model.contractEndDate.toJSON()
//             : undefined,
//     };

//     return response;
// }

// function parseModelParameters(
//     requestParameters: ClientAccountParameters
// ): ClientAccountModelCreationAttributes {
//     const parameters: ClientAccountModelCreationAttributes = {
//         name: requestParameters.name,
//         notes: requestParameters.notes,
//         contactName: requestParameters.contact_name,
//         contactEmailAddress: requestParameters.contact_email_address,
//         contactTelephoneNumber: requestParameters.contact_telephone_number,
//         contractStartDate: new Date(requestParameters.contract_start_date),
//         contractRollover: requestParameters.contract_rollover,
//         contractEndDate: requestParameters.contract_end_date
//             ? new Date(requestParameters.contract_end_date)
//             : null,
//     };

//     return parameters;
// }

function parseSubscriptionTypesResponseFromModel(modelList: SubscriptionTypeModel[]): SubscriptionTypeResponse[] {
    const response: SubscriptionTypeResponse[] = modelList.map(model => {
        return {
            id: model.uuid,
            name: model.name
        }
    })
    return response
}

export class SubscriptionTypeRepository implements SubscriptionTypePersister {
    static defaultInstance: SubscriptionTypePersister =
        new SubscriptionTypeRepository(SubscriptionTypeModel);

    constructor(private subscriptionTypeModel: typeof SubscriptionTypeModel) {}

    async getSubscriptionTypes(): Promise<Array<SubscriptionTypeResponse>> {
        const subscriptionTypes = await this.subscriptionTypeModel.findAll()
        const subscriptionTypesParsed = parseSubscriptionTypesResponseFromModel(subscriptionTypes)
        return subscriptionTypesParsed
    }
}
