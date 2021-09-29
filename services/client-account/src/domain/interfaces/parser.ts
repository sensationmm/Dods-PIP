import { ClientAccountParameters, ClientAccountResponse, SearchClientAccountResponse } from ".";
import { ClientAccountModel } from "../../db";
import { ClientAccountModelCreationAttributes } from "../../db/types";

export function parseResponseFromModel(model: ClientAccountModel): ClientAccountResponse {
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
        subscription: model.SubscriptionType
    };

    return response;
}

export function parseModelParameters(requestParameters: ClientAccountParameters): ClientAccountModelCreationAttributes {
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

export function parseSearchClientAccountResponse(model: ClientAccountModel): SearchClientAccountResponse {
    const response = {
        id: model.uuid,
        name: model.name,
        notes: model.notes,
        subscription: model.SubscriptionType && model.SubscriptionType.name,
        location: model.SubscriptionType && model.SubscriptionType.location,
        projects: 0,
        team:
            model.ClientAccountTeam && 
            model.ClientAccountTeam.UserProfileModels &&
            model.ClientAccountTeam.UserProfileModels
                .map((item) => {
                    return {
                        name: item.fullName,
                        type: model.ClientAccountTeam && model.ClientAccountTeam.parsedType
                    }
            }),
        completed: true
    };
    return response
}
