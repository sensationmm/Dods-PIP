import {CreateEditorialRecordParameters, EditorialRecord} from '../../../src/domain';
import { EditorialRecordRepository } from '../../../src/repositories/EditorialRecordRepository';
import dynamoDB from "../../../src/dynamodb"

jest.mock('../../../src/dynamodb');
jest.mock('uuid', () => ({ v4: () => '00000000-0000-0000-0000-000000000000' }));

afterEach(() => {
    jest.clearAllMocks();
});


describe(`Editorial Repository Test`, () => {

    test('create Editorial Record Valid input', async () => {
        const data: CreateEditorialRecordParameters = {document_name: 'Some Questions', s3_location: 'Some location'};
        const response = await EditorialRecordRepository.defaultInstance.createEditorialRecord(data);

        expect(response.document_name).toEqual('Some Questions');
        expect(response.s3_location).toEqual('Some location');
    });

    test('creating a record creates an ID', async () => {
        const data: CreateEditorialRecordParameters = {document_name: 'Some Questions', s3_location: 'Some location'};
        const response = await EditorialRecordRepository.defaultInstance.createEditorialRecord(data);

        expect(response.id).toEqual('00000000-0000-0000-0000-000000000000');
    });

    test('we create the correct dynamo put request', async () =>{
        const data: EditorialRecord = { id: '00000000-0000-0000-0000-000000000000', document_name: 'Some Questions', s3_location: 'Some location' };
        const response = await EditorialRecordRepository.createEditorialRecordPutRequest(data);

        expect(response.TableName).toBeDefined();
        expect(response.Item.document_name).toEqual(data.document_name);
        expect(response.Item.s3_location).toEqual(data.s3_location);
        expect(response.Item.id).toEqual('00000000-0000-0000-0000-000000000000');
    });

    test('creating a record creates the correct request', async () =>{
        const spy = jest.spyOn(EditorialRecordRepository, 'createEditorialRecordPutRequest');

        const data: CreateEditorialRecordParameters = {document_name: 'Some Questions', s3_location: 'Some location'};
        await EditorialRecordRepository.defaultInstance.createEditorialRecord(data);

        expect(spy).toHaveBeenCalled();

        spy.mockRestore();
    });

    test('creating a record stores to dynamo', async () =>{
        const data: CreateEditorialRecordParameters = {document_name: 'Some Questions', s3_location: 'Some location'};
        await EditorialRecordRepository.defaultInstance.createEditorialRecord(data);

        expect(dynamoDB.put.mock.calls.length).toBe(1);
    });

    test('DynamoDB errors are re thrown', async () =>{
        dynamoDB.put.mockImplementation(() => {
            throw new Error();
        });
        const data: CreateEditorialRecordParameters = {document_name: 'Some Questions', s3_location: 'Some location'};

        await expect(EditorialRecordRepository.defaultInstance.createEditorialRecord(data)).rejects.toThrow(Error);
    });
});