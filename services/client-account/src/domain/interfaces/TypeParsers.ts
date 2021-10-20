import { ClientAccountModel, SubscriptionTypeModel, UserProfileModel } from '../../db';
import {
    ClientAccountParameters,
    ClientAccountResponse,
    SearchClientAccountResponse,
    SubscriptionTypeResponse,
    TeamMemberResponse,
} from '.';

import { ClientAccountModelCreationAttributes } from '../../db/types';

export function parseSubscriptionResponseFromModel(
    model: SubscriptionTypeModel
): SubscriptionTypeResponse {
    const response: SubscriptionTypeResponse = {
        uuid: model.uuid,
        name: model.name,
        location: model.location,
        contentType: model.contentType,
    };

    return response;
}

export function parseResponseFromModel(model: ClientAccountModel): ClientAccountResponse {
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
        subscription: model.subscriptionType
            ? parseSubscriptionResponseFromModel(model.subscriptionType!)
            : undefined,
        is_completed: model.isCompleted,
        last_step_completed: model.lastStepCompleted,
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
        contactEmailAddress: requestParameters.clientAccount.contact_email_address,
        contactTelephoneNumber: requestParameters.clientAccount.contact_telephone_number,
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
        subscription: model.subscriptionType && model.subscriptionType.name,
        location: model.subscriptionType && model.subscriptionType.location,
        projects: 0,
        team: model.team && model.team.map(parseTeamMember),
        completed: true,
        is_completed: model.isCompleted,
        last_step_completed: model.lastStepCompleted,
    };
    return response;
}

export function parseTeamMember(item: UserProfileModel): TeamMemberResponse {
    return {
        id: item.uuid,
        name: item.fullName,
        type: item.ClientAccountTeamModel!.parsedType,
    };
}
