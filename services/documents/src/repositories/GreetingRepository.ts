import { DownstreamEndpoints, SayLocalHelloParameters, config } from "../domain";
import { Greeting } from "./Greeting";
import { requestHandler } from '../utility';

export class GreetingRepository implements Greeting {

    static defaultInstance: Greeting = new GreetingRepository(config.dods.downstreamEndpoints);

    constructor(private config: DownstreamEndpoints) { }

    async getFullName(data: SayLocalHelloParameters): Promise<string> {
        return await requestHandler({ url: this.config.getFullNameEndpointUrl, headers: data })
    }
    async sayEnglishHello(data: SayLocalHelloParameters): Promise<string> {
        return await requestHandler({ url: this.config.sayEnglishHelloEndpointUrl, headers: data });
    }
    async sayTurkishHello(data: SayLocalHelloParameters): Promise<string> {
        return await requestHandler({ url: this.config.sayTurkishHelloEndpointUrl, headers: data });
    }
}
