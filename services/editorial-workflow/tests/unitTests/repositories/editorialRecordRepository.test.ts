import { EditorialRecord } from '@dodsgroup/dods-model';
import { EditorialRecordRepository } from '../../../src/repositories/EditorialRecordRepository';
import { mocked } from 'ts-jest/utils';

const defaultCreatedRecord: any = {
    uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
    documentName: 'NewDocument',
    s3Location: 'SomeLocation',
};

jest.mock('@dodsgroup/dods-model');

const mockedEditorialRecord = mocked(EditorialRecord);

mockedEditorialRecord.create.mockResolvedValue(defaultCreatedRecord);

const CLASS_NAME = EditorialRecordRepository.name;
const CREATE_RECORD_FUNCTION_NAME =
    EditorialRecordRepository.defaultInstance.createEditorialRecord.name;

describe(`${CLASS_NAME}`, () => {
    test(`${CREATE_RECORD_FUNCTION_NAME} Valid input Happy case`, async () => {
        const requestParams = { documentName: 'NewDocument', s3Location: 'SomeLocation' };
        const response = await EditorialRecordRepository.defaultInstance.createEditorialRecord(
            requestParams
        );
        expect(EditorialRecord.create).toBeCalled;
        expect(response).toEqual(defaultCreatedRecord);
    });
});
