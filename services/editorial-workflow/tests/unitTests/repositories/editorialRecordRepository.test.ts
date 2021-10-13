import { CreateEditorialRecordParameters } from '../../../src/domain';
import { EditorialRecordRepository } from '../../../src/repositories/EditorialRecordRepository';
//import dynamoDB from "../../../src/dynamodb"

jest.mock('../../../src/dynamodb');
jest.mock('uuid', () => ({ v4: () => '00000000-0000-0000-0000-000000000000' }));

afterEach(() => {
    jest.clearAllMocks();
});


describe(`Editorial Repository Test`, () => {

    test('create Editorial Record Valid input', async () => {

        const data: CreateEditorialRecordParameters = {document_name: 'Some Questions', s3_location: 'Some location'};

        const response = await EditorialRecordRepository.defaultInstance.createEditorialRecord(data)

        expect(response.document_name).toEqual('Some Questions');
        expect(response.s3_location).toEqual('Some location');
    });

    test('creating a record creates an ID', async () => {
        const data: CreateEditorialRecordParameters = {document_name: 'Some Questions', s3_location: 'Some location'};

        const response = await EditorialRecordRepository.defaultInstance.createEditorialRecord(data)

        expect(response.id).toEqual('00000000-0000-0000-0000-000000000000');
    });

    test('creating a record stores to dynamo', async () =>{

    });
});