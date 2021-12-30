export * from './Collection';
export * from './CollectionPersister';

export interface DownstreamEndpoints {
    apiGatewayBaseURL: string;
    sayTurkishHelloEndpointUrl: string;
    sayEnglishHelloEndpointUrl: string;
    getFullNameEndpointUrl: string;
}
