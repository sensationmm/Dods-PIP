import { SayLocalHelloParameters } from "../domain/interfaces";

export interface Greeting {
    sayEnglishHello(data: SayLocalHelloParameters): Promise<string>;
    sayTurkishHello(data: SayLocalHelloParameters): Promise<string>;
}