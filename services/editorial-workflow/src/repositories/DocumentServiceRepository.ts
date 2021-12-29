import { DocumentServicePersister, config } from '../domain';

import axios from 'axios';

const { dods: { downstreamEndpoints: { userProfile } } } = config;

export class DocumentServiceRepository implements DocumentServicePersister {
    static defaultInstance: DocumentServicePersister = new DocumentServiceRepository();

    constructor(private baseURL: string = userProfile) { }

    async updateDocument(parameters: any): Promise<Object> {
        const response = await axios.put(`${this.baseURL}documents`, parameters);
        const { data: { success } } = response;
        return { success };
    }

}