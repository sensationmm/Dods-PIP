import { config, LoginPersister } from '../domain';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Logger } from '../utility';

const defaultDynamodbClient = new DocumentClient();

const defaultLoginDynamodbTableName = config.aws.resources.loginDynamodbTableName;

export class LoginDynamodb implements LoginPersister {

    static defaultInstance = new LoginDynamodb(defaultLoginDynamodbTableName, defaultDynamodbClient);

    constructor(private loginDynamodbTableName: string, private dynamoDb: DocumentClient) { }

    async saveLastPassword(userName: string, password: string): Promise<void> {

        try {
            const now = new Date().toISOString();

            const queryParams: DocumentClient.UpdateItemInput = {
                TableName: this.loginDynamodbTableName,
                Key: { userName },
                UpdateExpression: 'SET #lastPassword = :lastPassword, #updatedDate = :now, #createdDate = if_not_exists(#createdDate, :now)',
                ExpressionAttributeNames: {
                    '#lastPassword': 'lastPassword',
                    '#createdDate': 'createdDate',
                    '#updatedDate': 'updatedDate'
                },
                ExpressionAttributeValues: {
                    ':lastPassword': password,
                    ':now': now
                },
                ReturnValues: "UPDATED_NEW"
            };

            await this.dynamoDb.update(queryParams).promise();
        } catch (error: any) {
            Logger.error(`saveLastPassword function in LoginDynamodb module`, error);
        }
    }

    async getLastPassword(userName: string): Promise<string | undefined> {

        try {
            const queryParams: DocumentClient.GetItemInput = {
                TableName: this.loginDynamodbTableName,
                Key: { userName },
                AttributesToGet: ['lastPassword']
            };

            const result = await this.dynamoDb.get(queryParams).promise();

            const lastPassword = result.Item?.lastPassword;

            return lastPassword;

        } catch (error) {
            Logger.error(`validateLastPassword function in LoginDynamodb module`, error);
        }

        return undefined;
    }

    async resetLoginAttempt(userName: string): Promise<boolean> {

        try {
            let failedLoginAttemptCount = 0;

            const now = new Date().toISOString();

            const queryParams: DocumentClient.UpdateItemInput = {
                TableName: this.loginDynamodbTableName,
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
            Logger.error(`resetLoginAttempt function in LoginDynamodb module`, error);
        }

        return true;
    }

    async incrementFailedLoginAttempt(userName: string): Promise<number> {

        let failedLoginAttemptCount = 1;
        try {
            const increment = 1;
            const now = new Date().toISOString();

            const queryParams: DocumentClient.UpdateItemInput = {
                TableName: this.loginDynamodbTableName,
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
            Logger.error(`incrementFailedLoginAttempt function in LoginDynamodb module`, error);
        }

        return failedLoginAttemptCount;
    }
}