import { mocked } from 'ts-jest/utils';
import { ClientAccountTeam, ClientAccountTeamOutput } from '@dodsgroup/dods-model';
import { ClientAccountTeamRepository } from '../../../src/repositories/ClientAccountTeamRepository';

const defaultClientAccountTeam: ClientAccountTeamOutput = { clientAccountId: 1, teamMemberType: 1, userId: 1 };

jest.mock('@dodsgroup/dods-model');

const mockedClientAccountTeam = mocked(ClientAccountTeam, true);

const CLASS_NAME = ClientAccountTeamRepository.name;
const CREATE_FUNCTION_NAME = ClientAccountTeamRepository.defaultInstance.create.name;
const FIND_ONE_FUNCTION_NAME = ClientAccountTeamRepository.defaultInstance.findOne.name;
const DELETE_FUNCTION_NAME = ClientAccountTeamRepository.defaultInstance.delete.name;

afterEach(() => {
    mockedClientAccountTeam.mockClear();
    mockedClientAccountTeam.create.mockClear();
    mockedClientAccountTeam.findOne.mockClear();
});

describe(`${CLASS_NAME} handler`, () => {
    test(`${CREATE_FUNCTION_NAME} Valid case `, async () => {

        mockedClientAccountTeam.create.mockReturnValue(defaultClientAccountTeam);

        const response = await ClientAccountTeamRepository.defaultInstance.create(defaultClientAccountTeam);

        expect(response).toEqual(defaultClientAccountTeam);
    });

    test(`${DELETE_FUNCTION_NAME} Valid case `, async () => {

        await ClientAccountTeamRepository.defaultInstance.delete({ userId: 1, clientAccountId: 1 });

        expect(mockedClientAccountTeam.destroy).toHaveBeenCalledTimes(1);
    });

    test(`${FIND_ONE_FUNCTION_NAME} Valid case `, async () => {
        mockedClientAccountTeam.findOne.mockResolvedValue(defaultClientAccountTeam as ClientAccountTeam);

        const response = await ClientAccountTeamRepository.defaultInstance.findOne({ userId: 1, clientAccountId: 1, teamMemberType: 1 });

        expect(response).toEqual(defaultClientAccountTeam);
    });

    test(`${FIND_ONE_FUNCTION_NAME} Invalid case `, async () => {
        mockedClientAccountTeam.findOne.mockResolvedValue(undefined as any);

        try {
            await ClientAccountTeamRepository.defaultInstance.findOne({ userId: 1, clientAccountId: 1, teamMemberType: 1 });

            throw new Error('Code never should come in this point');
        } catch (error: any) {
            expect(error.message).toEqual('Error: clientAccountTeam not found');
            expect(mockedClientAccountTeam.findOne).toHaveBeenCalledTimes(1);
        }
    });
});
