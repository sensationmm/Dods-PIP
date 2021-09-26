import { addDays, addMinutes, subMinutes, getUnixTime } from 'date-fns'
import { config, LoginLastPasswordsPersister } from '../domain';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Logger } from '../utility';

const defaultDynamodbClient = new DocumentClient();

export class LoginLastPasswordsDynamodb implements LoginLastPasswordsPersister {

    static defaultInstance: LoginLastPasswordsPersister = new LoginLastPasswordsDynamodb(config.aws.resources.loginLastPasswordsDynamodbTableName, defaultDynamodbClient);

    constructor(private loginLastPasswordsDynamodbTableName: string, private dynamoDb: DocumentClient) { }

    async saveLastPassword(userName: string, password: string): Promise<void> {

        try {
            const now = new Date().toISOString();

            const putInput: DocumentClient.PutItemInput = {
                TableName: this.loginLastPasswordsDynamodbTableName,
                Item: {
                    userName,
                    createdDate: now,
                    password,
                    _ttl: getUnixTime(addMinutes(new Date(), config.aws.resources.cognito.lastPasswordNotReuseMinutes))
                }
            };

            await this.dynamoDb.put(putInput).promise();
        } catch (error: any) {
            Logger.error(`saveLastPassword function in LoginLastPasswordsDynamodb module`, error);
        }
    }

    async getLastPasswords(userName: string): Promise<Array<string>> {

        try {

            const queryDate = subMinutes(new Date(), config.aws.resources.cognito.lastPasswordNotReuseMinutes)

            const queryParams: DocumentClient.QueryInput = {
                TableName: this.loginLastPasswordsDynamodbTableName,
                KeyConditionExpression: '#userName = :userName and #createdDate > :createdDate',
                ExpressionAttributeValues: {
                    ':userName': userName,
                    ':createdDate': queryDate.toISOString()
                },
                ExpressionAttributeNames: {
                    '#userName': 'userName',
                    '#createdDate': 'createdDate'
                },
                ConsistentRead: true
            };

            const result = await this.dynamoDb.query(queryParams).promise();

            return result.Items?.map(item => item.password) || [];
        } catch (error) {
            Logger.error(`validateLastPassword function in LoginLastPasswordsDynamodb module`, error);
        }

        return [];
    }
}