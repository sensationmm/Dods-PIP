import { EditorialRepository } from "./EditorialRepository";
import { CreateEditorialRecordParameters, EditorialRecord} from "../domain";
import dynamoDB from "../dynamodb"
import { config } from '../domain';

import { v4 as uuidv4 } from 'uuid';
import {AWSError} from "aws-sdk";
const AWS = require("aws-sdk");

export class EditorialRecordRepository implements EditorialRepository {
    constructor(private dynamoDB: typeof AWS.DynamoDB.DocumentClient) {}

    static defaultInstance: EditorialRepository = new EditorialRecordRepository(dynamoDB);

    static async createEditorialRecordPutRequest(data: EditorialRecord): Promise<any> {
        return { TableName: config.dynamodb.dynamoTable, Item: data };
    }

    async sendPutRequestToDynamo(request: any): Promise<any> {
        await this.dynamoDB.put(request, function(err: AWSError, data: any) {
            if (err) {
                console.log(err)
                throw err;
            }
            else return data;
        });
    }

    async createEditorialRecord(data: CreateEditorialRecordParameters): Promise<EditorialRecord> {
        const record: EditorialRecord = {id: uuidv4(), ...data};
        const putRequest = await EditorialRecordRepository.createEditorialRecordPutRequest(record);
        await this.sendPutRequestToDynamo(putRequest);

        return record;
    }
}