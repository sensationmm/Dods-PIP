export type Title = "Mr" | "Mrs" | "Miss" | "Ms";

export type Language = "English" | "Turkish";

export interface SayLocalHelloParameters {
    firstName: string;
    lastName: string;
    title: Title;
}

export interface SayHelloParameters extends SayLocalHelloParameters {
    language: Language;
}

export interface DownstreamEndpoints {
    apiGatewayBaseURL: string;
    sayTurkishHelloEndpointUrl: string;
    sayEnglishHelloEndpointUrl: string;
    getFullNameEndpointUrl: string;
}