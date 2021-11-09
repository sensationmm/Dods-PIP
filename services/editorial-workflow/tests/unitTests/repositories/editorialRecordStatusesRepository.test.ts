import { EditorialRecordStatusesRepository } from '../../../src/repositories/EditorialRecordStatusesRepository';

const SequelizeMock = require('sequelize-mock');

const defaultSatusesRecord: any = [{
        "uuid": "89cf96f7-d380-4c30-abcf-74c57843f50c",
        "name": "Draft"
    }];

jest.mock('@dodsgroup/dods-model');

const dbMock = new SequelizeMock();

const editorialRecordStatusMock = dbMock.define('dods_editorial_record_statuses', {
        uuid: "89cf96f7-d380-4c30-abcf-74c57843f50c",
        status: "Draft",
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
        id: 1
    });

const testRepository = new EditorialRecordStatusesRepository(editorialRecordStatusMock);

const CLASS_NAME = EditorialRecordStatusesRepository.name;
const GET_STATUSES_FUNCTION_NAME = EditorialRecordStatusesRepository.defaultInstance.getEditorialRecordStatuses.name;

describe(`${CLASS_NAME}`, () => {
    test(`${GET_STATUSES_FUNCTION_NAME} Retrieve Happy case`, async () => {
        const response = await testRepository.getEditorialRecordStatuses();

        expect(response).toEqual(defaultSatusesRecord);
    });
});
