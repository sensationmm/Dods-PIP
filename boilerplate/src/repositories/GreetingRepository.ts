import { DownstreamEndpoints, SayLocalHelloParameters } from "../domain/interfaces";
import { Greeting } from "./Greeting";
import { requestHandler } from '../utility';
import { config } from "../domain/config";

export class GreetingRepository implements Greeting {

    static defaultInstance: Greeting = new GreetingRepository(config.dods.downstreamEndpoints);

    constructor(private config: DownstreamEndpoints) { }

    async sayEnglishHello(data: SayLocalHelloParameters): Promise<string> {
        return await requestHandler({ url: this.config.sayEnglishHelloEndpointUrl, headers: data });
    }
    async sayTurkishHello(data: SayLocalHelloParameters): Promise<string> {
        return await requestHandler({ url: this.config.sayTurkishHelloEndpointUrl, headers: data });
    }
}
