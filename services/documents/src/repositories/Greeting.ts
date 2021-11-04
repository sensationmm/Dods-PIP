import { SayLocalHelloParameters } from "../domain";

export interface Greeting {
    sayEnglishHello(data: SayLocalHelloParameters): Promise<string>;
    sayTurkishHello(data: SayLocalHelloParameters): Promise<string>;
    getFullName(data: SayLocalHelloParameters): Promise<string>;
}