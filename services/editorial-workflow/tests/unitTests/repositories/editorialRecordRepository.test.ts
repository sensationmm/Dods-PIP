import { EditorialRecord, EditorialRecordStatus, Model, Op, User } from '@dodsgroup/dods-model';

import { BadParameterError } from '../../../src/domain';
import { EditorialRecordRepository } from '../../../src/repositories/EditorialRecordRepository';
import { mocked } from 'ts-jest/utils';

const defaultRecordModel: any = {
    uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
    documentName: 'NewDocument',
    s3Location: 'SomeLocation',
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
    update: () => {},
    reload: () => {},
    setAssignedEditor: () => {},
    setStatus: () => {},
};

const defaultUser: any = {
    uuid: '0698280d-8b0f-4a2c-8892-e1599e407fb4',
    fullName: 'Employee Example',
};

const defaultStatus: any = {
    uuid: '89cf96f7-d380-4c30-abcf-74c57843f50c',
    status: 'Draft',
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

const mockFindOne = async (options: any) => {
    if (options.where.uuid === '0698280d-8b0f-4a2c-8892-e1599e407fb4') {
        return defaultUser;
    }
    if (options.where.uuid === '89cf96f7-d380-4c30-abcf-74c57843f50c') {
        return defaultStatus;
    }
    if (options.where.uuid === 'f9d1482a-77e8-440e-a370-7e06fa0da176') {
        return defaultRecordModel;
    }

    return null;
};

jest.mock('@dodsgroup/dods-model');

const mockedEditorialRecord = mocked(EditorialRecord, true);
const mockedEditorialRecordStatus = mocked(EditorialRecordStatus, true);
const mockedUser = mocked(User, true);

const mockedFindOne = mocked(Model.findOne);

beforeEach(() => {
    mockedFindOne.mockImplementation(mockFindOne);

    mockedEditorialRecord.create.mockReturnValue(defaultRecordModel);
    mockedEditorialRecord.update.mockReturnValue(defaultRecordModel);
    mockedEditorialRecord.findAndCountAll.mockReturnValue(defaultListRecords);
    mockedEditorialRecord.count.mockReturnValue(Promise.resolve(defaultAmountOfTotalRecords));
});

afterEach(() => {
    mockedFindOne.mockClear();
    mockedEditorialRecord.create.mockClear();
    mockedEditorialRecord.update.mockClear();
    mockedEditorialRecord.findAndCountAll.mockClear();
    mockedEditorialRecord.count.mockClear();

    mockedUser.mockClear();
    mockedEditorialRecord.mockClear();
    mockedEditorialRecordStatus.mockClear();
});

const CLASS_NAME = EditorialRecordRepository.name;

const CHECK_USER_ID_FUNCTION_NAME = EditorialRecordRepository.defaultInstance.checkUserId.name;

const CREATE_RECORD_FUNCTION_NAME =
    EditorialRecordRepository.defaultInstance.createEditorialRecord.name;

const UPDATE_RECORD_FUNCTION_NAME =
    EditorialRecordRepository.defaultInstance.updateEditorialRecord.name;

const GET_RECORD_FUNCTION_NAME = EditorialRecordRepository.defaultInstance.getEditorialRecord.name;

const SEARCH_RECORDS_FUNCTION_NAME =
    EditorialRecordRepository.defaultInstance.listEditorialRecords.name;

describe(`${CLASS_NAME}.${CHECK_USER_ID_FUNCTION_NAME}`, () => {
    test('Happy case, all parameters', async () => {
        const userId = '0698280d-8b0f-4a2c-8892-e1599e407fb4';
        const response = await EditorialRecordRepository.defaultInstance.checkUserId(userId);
        expect(response).toEqual(true);
    });
    test('Bad userId case', async () => {
        const userId = 'nullUser';
        const response = await EditorialRecordRepository.defaultInstance.checkUserId(userId);
        expect(response).toEqual(false);
    });
});

describe(`${CLASS_NAME}.${CREATE_RECORD_FUNCTION_NAME}`, () => {
    test('Happy case, all parameters', async () => {
        const requestParams = {
            documentName: 'NewDocument',
            s3Location: 'SomeLocation',
            statusId: '89cf96f7-d380-4c30-abcf-74c57843f50c',
            assignedEditorId: '0698280d-8b0f-4a2c-8892-e1599e407fb4',
        };
        const response = await EditorialRecordRepository.defaultInstance.createEditorialRecord(
            requestParams
        );
        expect(EditorialRecord.create).toBeCalled;
        expect(response).toEqual({
            uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
            documentName: 'NewDocument',
            s3Location: 'SomeLocation',
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
        });
    });
});

describe(`${CLASS_NAME}.${UPDATE_RECORD_FUNCTION_NAME}`, () => {
    test('Happy case, all parameters', async () => {
        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
            documentName: 'NewDocument',
            s3Location: 'SomeLocation',
            statusId: '89cf96f7-d380-4c30-abcf-74c57843f50c',
            assignedEditorId: '0698280d-8b0f-4a2c-8892-e1599e407fb4',
        };
        const response = await EditorialRecordRepository.defaultInstance.updateEditorialRecord(
            requestParams
        );
        expect(EditorialRecord.update).toBeCalled;
        expect(response).toEqual({
            uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
            documentName: 'NewDocument',
            s3Location: 'SomeLocation',
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
        });
    });

    test('Invalid statusId', async () => {
        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
            documentName: 'NewDocument',
            s3Location: 'SomeLocation',
            statusId: 'invalid',
            assignedEditorId: '0698280d-8b0f-4a2c-8892-e1599e407fb4',
        };
        try {
            await EditorialRecordRepository.defaultInstance.updateEditorialRecord(requestParams);
            expect(true).toBe(false);
        } catch (e) {
            expect(e instanceof BadParameterError).toBe(true);
            expect(e).toHaveProperty(
                'message',
                `Unable to retrieve Editorial Record Status with uuid: ${requestParams.statusId}`
            );
        }
    });

    test('Invalid RecordId', async () => {
        const requestParams = {
            recordId: 'invalid',
            documentName: 'NewDocument',
            s3Location: 'SomeLocation',
            statusId: '89cf96f7-d380-4c30-abcf-74c57843f50c',
            assignedEditorId: '0698280d-8b0f-4a2c-8892-e1599e407fb4',
        };

        try {
            await EditorialRecordRepository.defaultInstance.updateEditorialRecord(requestParams);
            expect(true).toBe(false);
        } catch (e) {
            expect(e instanceof BadParameterError).toBe(true);
            expect(e).toHaveProperty(
                'message',
                `Error: could not retrieve Editorial Record with uuid: ${requestParams.recordId}`
            );
        }
    });

    test('Invalid UserId', async () => {
        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
            documentName: 'NewDocument',
            s3Location: 'SomeLocation',
            statusId: '89cf96f7-d380-4c30-abcf-74c57843f50c',
            assignedEditorId: 'invalid',
        };

        try {
            await EditorialRecordRepository.defaultInstance.updateEditorialRecord(requestParams);
            expect(true).toBe(false);
        } catch (e) {
            expect(e instanceof BadParameterError).toBe(true);
            expect(e).toHaveProperty(
                'message',
                `Unable to retrieve User with uuid: ${requestParams.assignedEditorId}`
            );
        }
    });
});

describe(`${CLASS_NAME}.${GET_RECORD_FUNCTION_NAME}`, () => {
    test('Happy case', async () => {
        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
        };
        const response = await EditorialRecordRepository.defaultInstance.getEditorialRecord(
            requestParams.recordId
        );
        expect(EditorialRecord.update).toBeCalled;
        expect(response).toEqual({
            uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
            documentName: 'NewDocument',
            s3Location: 'SomeLocation',
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
        });
    });

    test('Invalid recordId', async () => {
        const requestParams = {
            recordId: 'invalid',
        };
        try {
            await EditorialRecordRepository.defaultInstance.getEditorialRecord(
                requestParams.recordId
            );
            expect(true).toBe(false);
        } catch (e) {
            expect(e instanceof BadParameterError).toBe(true);
            expect(e).toHaveProperty(
                'message',
                `Unable to retrieve Editorial Record with uuid: ${requestParams.recordId}`
            );
        }
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
            offset: '3',
            limit: '33',
            sortBy: 'creationDate',
            sortDirection: 'asc',
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
            offset: 3,
            order: [['creationDate', 'asc']],
        });
        expect(response).toEqual({
            totalRecords: defaultAmountOfTotalRecords,
            filteredRecords: defaultListRecords.count,
            results: defaultListRecords.rows,
        });
    });

    test('No filters applied', async () => {
        const requestParams = {
            offset: '3',
            limit: '33',
            sortBy: 'creationDate',
            sortDirection: 'asc',
        };
        const response = await EditorialRecordRepository.defaultInstance.listEditorialRecords(
            requestParams
        );
        expect(EditorialRecord.findAndCountAll).toHaveBeenCalledWith({
            where: {},
            include: ['status', 'assignedEditor'],
            limit: 33,
            offset: 3,
            order: [['creationDate', 'asc']],
        });
        expect(response).toEqual({
            totalRecords: defaultAmountOfTotalRecords,
            filteredRecords: defaultListRecords.count,
            results: defaultListRecords.rows,
        });
    });
});
