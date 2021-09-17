import { config, LoginAttemptsPersister } from '../domain';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Logger } from '../utility';

const defaultDynamodbClient = new DocumentClient();

export class LoginAttemptsDynamodb implements LoginAttemptsPersister {

    static defaultInstance: LoginAttemptsPersister = new LoginAttemptsDynamodb(config.aws.resources.loginAttemptsDynamodbTableName, defaultDynamodbClient);

    constructor(private loginAttemptsDynamodbTableName: string, private dynamoDb: DocumentClient) { }

    async resetLoginAttempt(userName: string): Promise<boolean> {

        try {
            let failedLoginAttemptCount = 0;

            const now = new Date().toISOString();

            const queryParams: DocumentClient.UpdateItemInput = {
                TableName: this.loginAttemptsDynamodbTableName,
                Key: { userName },
                UpdateExpression: 'SET #loginAttemptCount = :loginAttemptCount, #updatedDate = :now, #createdDate = if_not_exists(#createdDate, :now)',
                ExpressionAttributeNames: {
                    '#loginAttemptCount': 'loginAttemptCount',
                    '#createdDate': 'createdDate',
                    '#updatedDate': 'updatedDate'
                },
                ExpressionAttributeValues: {
                    ':loginAttemptCount': failedLoginAttemptCount,
                    ':now': now
                },
                ReturnValues: "UPDATED_NEW"
            };

            await this.dynamoDb.update(queryParams).promise();

        } catch (error: any) {
            Logger.error(`resetLoginAttempt function in LoginAttemptsDynamodb module`, error);
        }

        return true;
    }

    async incrementFailedLoginAttempt(userName: string): Promise<number> {

        let failedLoginAttemptCount = 1;
        try {
            const increment = 1;
            const now = new Date().toISOString();

            const queryParams: DocumentClient.UpdateItemInput = {
                TableName: this.loginAttemptsDynamodbTableName,
                Key: { userName },
                UpdateExpression: 'SET #loginAttemptCount = #loginAttemptCount + :loginAttemptCount, #updatedDate = :now, #createdDate = if_not_exists(#createdDate, :now)',
                ExpressionAttributeNames: {
                    '#loginAttemptCount': 'loginAttemptCount',
                    '#createdDate': 'createdDate',
                    '#updatedDate': 'updatedDate'
                },
                ExpressionAttributeValues: {
                    ':loginAttemptCount': increment,
                    ':now': now
                },
                ReturnValues: "UPDATED_NEW"
            };

            const result: DocumentClient.UpdateItemOutput = await this.dynamoDb.update(queryParams).promise();

            failedLoginAttemptCount = result.Attributes?.['loginAttemptCount'];
        } catch (error) {
            Logger.error(`incrementFailedLoginAttempt function in LoginAttemptsDynamodb module`, error);
        }

        return failedLoginAttemptCount;
    }
}