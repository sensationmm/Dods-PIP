import { EditorialRepository } from "./EditorialRepository";
import { CreateEditorialRecordParameters, EditorialRecord} from "../domain";
import dynamoDB from "../dynamodb"

import { v4 as uuidv4 } from 'uuid';
const AWS = require("aws-sdk");



export class EditorialRecordRepository implements EditorialRepository {
    constructor(private dynamoDB: typeof AWS.DynamoDB.DocumentClient) {}

    static defaultInstance: EditorialRepository = new EditorialRecordRepository(dynamoDB);

    async createEditorialRecord(data: CreateEditorialRecordParameters): Promise<EditorialRecord> {
        const record: EditorialRecord = {id: uuidv4(), ...data}
        this.dynamoDB;
        return record
    }
}