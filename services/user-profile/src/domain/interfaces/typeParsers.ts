import { RoleTypeResponse, UserProfileCreate, UserProfileResponse } from '.';
import {
    UserProfileModelAttributes,
    UserProfileModelCreationAttributes,
} from '../../db/models/UserProfile';

import { RoleTypeAttributes } from '../../db/models/RoleType';

export const parseUserForCreation = (
    parameters: UserProfileCreate
): UserProfileModelCreationAttributes => {
    const modelParameters: UserProfileModelCreationAttributes = {
        title: parameters.title,
        firstName: parameters.first_name,
        lastName: parameters.last_name,
        primaryEmail: parameters.primary_email_address,
        secondaryEmail: parameters.secondary_email_address,
        telephoneNumber1: parameters.telephone_number_1,
        telephoneNumber2: parameters.telephone_number_2,
    };

    return modelParameters;
};

export const parseUserForResponse = (
    userProfile: UserProfileModelAttributes
): UserProfileResponse => {
    const profile: UserProfileResponse = {
        id: userProfile.uuid,
        title: userProfile.title,
        first_name: userProfile.firstName,
        last_name: userProfile.lastName,
        primary_email_address: userProfile.primaryEmail,
        secondary_email_address: userProfile.secondaryEmail,
        telephone_number_1: userProfile.telephoneNumber1!,
        telephone_number_2: userProfile.telephoneNumber2,
        role: parseRoleForResponse(userProfile.role!),
    };

    return profile;
};

export const parseRoleForResponse = (roleModel: RoleTypeAttributes): RoleTypeResponse => {
    const roleResponse: RoleTypeResponse = {
        id: roleModel.uuid,
        title: roleModel.title,
        dods_role: roleModel.dodsRole,
    };
    return roleResponse;
};
