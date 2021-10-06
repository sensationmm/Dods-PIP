import { ClientAccountParameters, ClientAccountResponse, SearchClientAccountResponse } from '.';
import { ClientAccountModel } from '../../db';
import { ClientAccountModelCreationAttributes } from '../../db/types';

export function parseResponseFromModel(
    model: ClientAccountModel
): ClientAccountResponse {
    const response: ClientAccountResponse = {
        uuid: model.uuid,
        name: model.name,
        notes: model.notes,
        contact_name: model.contactName,
        contact_email_address: model.contactEmailAddress,
        contact_telephone_number: model.contactTelephoneNumber,
        contract_start_date: model.contractStartDate,
        contract_rollover: model.contractRollover,
        contract_end_date: model.contractEndDate,
        subscription_seats: model.subscriptionSeats,
        consultant_hours: model.consultantHours,
        subscription: model.SubscriptionType!,
    };

    return response;
}

export function parseModelParameters(
    requestParameters: ClientAccountParameters
): ClientAccountModelCreationAttributes {
    const parameters: ClientAccountModelCreationAttributes = {
        name: requestParameters.clientAccount.name,
        notes: requestParameters.clientAccount.notes,
        contactName: requestParameters.clientAccount.contact_name,
        contactEmailAddress:
            requestParameters.clientAccount.contact_email_address,
        contactTelephoneNumber:
            requestParameters.clientAccount.contact_telephone_number,
    };

    return parameters;
}

export function parseSearchClientAccountResponse(
    model: ClientAccountModel
): SearchClientAccountResponse {
    const response: SearchClientAccountResponse = {
        id: model.uuid,
        name: model.name,
        notes: model.notes,
        subscription: model.SubscriptionType && model.SubscriptionType.name,
        location: model.SubscriptionType && model.SubscriptionType.location,
        projects: 0,
        team:
            model.ClientAccountTeam &&
            model.ClientAccountTeam.UserProfileModels &&
            model.ClientAccountTeam.UserProfileModels.map((item) => {
                return {
                    name: item.fullName,
                    type:
                        model.ClientAccountTeam &&
                        model.ClientAccountTeam.parsedType,
                };
            }),
        completed: true,
    };
    return response;
}
