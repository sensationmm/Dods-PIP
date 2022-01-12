import { Client } from '@elastic/elasticsearch';
import { config } from '../domain';

export default new Client({
    cloud: {
        id: config.elasticsearch.esCloudId,
    },
    auth: {
        apiKey: {
            id: config.elasticsearch.esKeyId,
            api_key: config.elasticsearch.esApiKey
        }
    }
})