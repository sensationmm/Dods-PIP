/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export * from './user-profile';
export * from './typeParsers';
export * from './UserProfile';
export * from './UserProfilePersister';
export * from './UserProfilePersisterV2';

export interface DownstreamEndpoints {
    getUserEndpoint: string;
    getUserByNameEndpoint: string;
    getRoleEndpoint: string;
}
