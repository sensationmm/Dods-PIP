export type UserAttributes = {
    Name: string;
    Value: string;
}

export interface UpdateUserAttributesParameters {
    email: string;
    userAttributes: Array<UserAttributes>;
}