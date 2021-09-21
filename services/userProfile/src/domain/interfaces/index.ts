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
    sayTurkishHelloEndpointUrl: string;
    sayEnglishHelloEndpointUrl: string;
}