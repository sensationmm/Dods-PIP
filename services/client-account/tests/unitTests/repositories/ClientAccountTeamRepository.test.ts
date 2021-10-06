import { ClientAccountTeamRepository } from '../../../src/repositories';
import { ClientAccountTeam } from '../../../src/domain';
import ClientAccountTeamModel from '../../../src/db/models/ClientAccountTeamModel';
import { mocked } from 'ts-jest/utils';

const defaultClientAccountTeam: ClientAccountTeam = { clientAccountId: 1, teamMemberType: 1, userId: 1 };

jest.mock('../../../src/db/models/ClientAccountTeamModel');

const mockedClientAccountTeamModel = mocked(ClientAccountTeamModel, true);

mockedClientAccountTeamModel.create.mockReturnValue(defaultClientAccountTeam);

const FUNCTION_NAME = ClientAccountTeamRepository.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid input Happy case `, async () => {

        const response = await ClientAccountTeamRepository.defaultInstance.create(defaultClientAccountTeam);

        expect(response).toEqual(defaultClientAccountTeam);
    });
});
