import { EditorialRecord, Op } from '@dodsgroup/dods-model';

import { EditorialRecordRepository } from '../../../src/repositories/EditorialRecordRepository';
import { mocked } from 'ts-jest/utils';

const defaultCreatedRecord: any = {
    uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
    documentName: 'NewDocument',
    s3Location: 'SomeLocation',
};

const defaultListRecords: any = {
    count: 1,
    rows: [
        {
            uuid: 'f3bfb804-b786-44e8-ab9b-36db9f226216',
            documentName: "The effects on Fridays on Jhonny's brain",
            s3Location:
                'arn:aws:s3:::editorial-workflow-prod/editorial-workflow/01012020/fried-brain.json',
            informationType: 'Random Doc',
            contentSource: 'Manual Injection',
            status: {
                uuid: '89cf96f7-d380-4c30-abcf-74c57843f50c',
                status: 'Draft',
            },
            assignedEditor: {
                uuid: '0698280d-8b0f-4a2c-8892-e1599e407fb4',
                fullName: 'Employee Example',
            },
            createdAt: '2021-11-08T16:20:58.000Z',
            updatedAt: '2021-11-08T16:20:58.000Z',
        },
    ],
};

const defaultAmountOfTotalRecords = 10;

jest.mock('@dodsgroup/dods-model');

const mockedEditorialRecord = mocked(EditorialRecord);

mockedEditorialRecord.create.mockResolvedValue(defaultCreatedRecord);
mockedEditorialRecord.findAndCountAll.mockResolvedValue(defaultListRecords);
mockedEditorialRecord.count.mockResolvedValue(defaultAmountOfTotalRecords);

const CLASS_NAME = EditorialRecordRepository.name;
const CREATE_RECORD_FUNCTION_NAME =
    EditorialRecordRepository.defaultInstance.createEditorialRecord.name;

const SEARCH_RECORDS_FUNCTION_NAME =
    EditorialRecordRepository.defaultInstance.listEditorialRecords.name;

describe(`${CLASS_NAME}.${CREATE_RECORD_FUNCTION_NAME}`, () => {
    test('Valid input Happy case', async () => {
        const requestParams = { documentName: 'NewDocument', s3Location: 'SomeLocation' };
        const response = await EditorialRecordRepository.defaultInstance.createEditorialRecord(
            requestParams
        );
        expect(EditorialRecord.create).toBeCalled;
        expect(response).toEqual(defaultCreatedRecord);
    });
});

describe(`${CLASS_NAME}.${SEARCH_RECORDS_FUNCTION_NAME}`, () => {
    test('All filters applied', async () => {
        const requestParams = {
            searchTerm: 'Test',
            contentSource: 'Random',
            informationType: 'Random Doc',
            status: '89cf96f7-d380-4c30-abcf-74c57843f50c',
            endDate: '2021-11-08T23:21:58.000Z',
            startDate: '2021-11-08T23:20:38.000Z',
            page: '3',
            pageSize: '33',
        };
        const response = await EditorialRecordRepository.defaultInstance.listEditorialRecords(
            requestParams
        );
        expect(EditorialRecord.findAndCountAll).toHaveBeenCalledWith({
            where: expect.objectContaining({
                '$status.uuid$': '89cf96f7-d380-4c30-abcf-74c57843f50c',
                contentSource: 'Random',
                createdAt: {
                    [Op.and]: [
                        {
                            [Op.gte]: new Date('2021-11-08T23:20:38.000Z'),
                        },
                        {
                            [Op.lte]: new Date('2021-11-08T23:21:58.000Z'),
                        },
                    ],
                },
                informationType: 'Random Doc',
            }),
            include: ['status', 'assignedEditor'],
            limit: 33,
            offset: 66,
        });
        expect(response).toEqual({
            totalRecords: defaultAmountOfTotalRecords,
            filteredRecords: defaultListRecords.count,
            results: defaultListRecords.rows,
        });
    });

    test('No filters applied', async () => {
        const requestParams = {
            page: '3',
            pageSize: '33',
        };
        const response = await EditorialRecordRepository.defaultInstance.listEditorialRecords(
            requestParams
        );
        expect(EditorialRecord.findAndCountAll).toHaveBeenCalledWith({
            where: {},
            include: ['status', 'assignedEditor'],
            limit: 33,
            offset: 66,
        });
        expect(response).toEqual({
            totalRecords: defaultAmountOfTotalRecords,
            filteredRecords: defaultListRecords.count,
            results: defaultListRecords.rows,
        });
    });
});
