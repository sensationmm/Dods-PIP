import {
    ClientAccountModel,
    Role,
    SubscriptionTypeModel,
    UserProfileModel,
} from '../../db';
import {
    ClientAccountParameters,
    ClientAccountResponse,
    RoleInfo,
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

export function parseResponseFromModel(
    model: ClientAccountModel
): ClientAccountResponse {
    const response: ClientAccountResponse = {
        uuid: model.uuid,
        name: model.name,
        notes: model.notes,
        contactName: model.contactName,
        contactEmailAddress: model.contactEmailAddress,
        contactTelephoneNumber: model.contactTelephoneNumber,
        contractStartDate: model.contractStartDate,
        contractRollover: model.contractRollover,
        contractEndDate: model.contractEndDate,
        subscriptionSeats: model.subscriptionSeats,
        consultantHours: model.consultantHours,
        team: model.team && model.team.map(parseTeamMember),
        subscription: model.subscriptionType
            ? parseSubscriptionResponseFromModel(model.subscriptionType!)
            : undefined,
        isEU: model.isEu,
        isUK: model.isUk,
        isCompleted: model.isCompleted,
        lastStepCompleted: model.lastStepCompleted,
    };

    return response;
}

export function parseModelParameters(
    requestParameters: ClientAccountParameters
): ClientAccountModelCreationAttributes {
    const parameters: ClientAccountModelCreationAttributes = {
        name: requestParameters.clientAccount.name,
        notes: requestParameters.clientAccount.notes,
        contactName: requestParameters.clientAccount.contactName,
        contactEmailAddress:
            requestParameters.clientAccount.contactEmailAddress,
        contactTelephoneNumber:
            requestParameters.clientAccount.contactTelephoneNumber,
    };

    return parameters;
}

export function parseSearchClientAccountResponse(
    model: ClientAccountModel
): SearchClientAccountResponse {
    const response: SearchClientAccountResponse = {
        uuid: model.uuid,
        name: model.name,
        notes: model.notes,
        subscription: model.subscriptionType && model.subscriptionType.name,
        location: model.subscriptionType && model.subscriptionType.location,
        projects: 0,
        team: model.team && model.team.map(parseTeamMember),
        isEU: model.isEu ? true : false,
        isUK: model.isUk ? true : false,
        isCompleted: model.isCompleted,
        lastStepCompleted: model.lastStepCompleted,
    };
    return response;
}

export function parseTeamMember(item: UserProfileModel): TeamMemberResponse {
    console.log('------ITEMMM-----');
    console.log(item.userRole);

    return {
        id: item.uuid,
        name: item.fullName,
        teamMemberType: item.ClientAccountTeamModel!.parsedType,
        title: item.title,
        primaryEmailAddress: item.primaryEmail,
        secondaryEmailAddress: item.secondaryEmail,
        telephoneNumber1: item.telephoneNumber1,
        telephoneNumber2: item.telephoneNumber2,
        role: item.userRole ? parseRoleId(item.userRole) : undefined,
    };
}

export function parseRoleId(item: Role): RoleInfo {
    const role: RoleInfo = {
        uuid: item.uuid,
        title: item.title,
        dodsRole: item.dodsRole,
    };
    return role;
}
