import { ClientAccountParameters, ClientAccountResponse } from ".";
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

export function parseSearchClientAccountResponse(model: any) {
    const response = {
        id: model.uuid,
        name: model.name,
        notes: model.notes,
        subscription: model.SubscriptionType && model.SubscriptionType.name,
        location: model.SubscriptionType && model.SubscriptionType.location,
        projects: 9999999,
        projectsNote: "FROM WHERE TO PULL THIS DATA?",
        team: {
            clientAccountId: model.ClientAccountTeam && model.ClientAccountTeam.clientAccountId,
            userId: model.ClientAccountTeam && model.ClientAccountTeam.userId,
            teamMemberType: model.ClientAccountTeam?.teamMemberType,
            name: "which field is the name? The 'teamMemberType' field is number",
            type: "consultant" as const,
            typeNote: "Same question..."
        },
        completed: true,
        completedNote: "FROM WHERE TO PULL THIS DATA?"
    };
    return response
}
