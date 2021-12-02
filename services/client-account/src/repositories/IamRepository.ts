import axios from "axios";
import { config, DestroyUserInput, IamPersister } from "../domain";

const { dods: { downstreamEndpoints: { apiGatewayBaseURL } } } = config;

export class IamRepository implements IamPersister {
    static defaultInstance: IamPersister = new IamRepository();

    constructor(private baseURL: string = apiGatewayBaseURL) { }

    async destroyUser(parameters: DestroyUserInput): Promise<void> {
        await axios.post(`${this.baseURL}/destroyUser`, parameters);
    }
}