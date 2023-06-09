import {
    ClientAccountModel,
    ClientAccountTeamModel,
    SubscriptionTypeModel,
    UserProfileModel,
} from '../db/models';
import {
    ClientAccountParameters,
    ClientAccountPersister,
    ClientAccountResponse,
    SearchClientAccountParameters,
    SearchClientAccountResponse,
    SearchClientAccountTotalRecords,
    TeamMemberResponse,
    TeamMemberTypes,
    UpdateClientAccountHeaderParameters,
    UpdateClientAccountParameters,
    parseModelParameters,
    parseResponseFromModel,
    parseSearchClientAccountResponse,
    parseTeamMember,
} from '../domain';
import { Op, WhereOptions, col, fn, where } from 'sequelize';

import { ClientAccountModelAttributes } from '../db';

export class ClientAccountError extends Error {
    constructor(message: string, cause: any) {
        super(message);
        this.name = 'ClientAccountError';
        this.cause = cause;
    }

    public cause: any;
}
export class ClientAccountRepository implements ClientAccountPersister {
    static defaultInstance: ClientAccountPersister = new ClientAccountRepository(
        ClientAccountModel,
        SubscriptionTypeModel,
        UserProfileModel,
        ClientAccountTeamModel
    );

    constructor(
        private model: typeof ClientAccountModel,
        private subsModel: typeof SubscriptionTypeModel,
        private userModel: typeof UserProfileModel,
        private teamModel: typeof ClientAccountTeamModel
    ) { }

    async createClientAccount(
        clientAccountParameters: ClientAccountParameters | null
    ): Promise<ClientAccountResponse | undefined> {
        if (!clientAccountParameters?.clientAccount) {
            throw new Error('Error: clientAccount cannot be empty');
        } else {
            try {
                const newAccount = parseModelParameters(clientAccountParameters);

                const newClientAccountModel = await this.model.create(newAccount);
                const newClientAccount = parseResponseFromModel(newClientAccountModel);

                return newClientAccount;
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    }

    async getClientAccount(clientAccountId: string): Promise<ClientAccountResponse> {
        if (!clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        const clientAccountModel = await this.model.findOne({
            where: { uuid: clientAccountId },
            include: [
                { model: this.subsModel, as: 'subscriptionType' },
                {
                    model: this.userModel,
                    as: 'team',
                    include: ['userRole'],
                },
            ],
        });

        if (clientAccountModel) {
            const clientAccount = parseResponseFromModel(clientAccountModel);

            return clientAccount;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async findOne(where: Partial<ClientAccountModelAttributes>): Promise<ClientAccountModel> {
        const clientAccountModel = await this.model.findOne({
            where,
            include: ['subscriptionType', 'team'],
        });

        if (clientAccountModel) {
            return clientAccountModel;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async deleteClientAccountTeamMembers(clientAccountId: string): Promise<boolean> {
        const clientAccount = await this.model.findOne({
            where: { uuid: clientAccountId },
        });

        if (clientAccount) {
            this.teamModel.destroy({
                where: {
                    clientAccountId: clientAccount.id,
                },
            });
            return true;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async searchClientAccount(
        searchClientAccountParams: SearchClientAccountParameters
    ): Promise<SearchClientAccountTotalRecords | undefined> {
        let {
            startsWith,
            locations,
            subscriptionTypes,
            searchTerm,
            isCompleted,
            sortBy,
            sortDirection,
        } = searchClientAccountParams;
        const { limitNum, offsetNum } = searchClientAccountParams;
        let clientAccountWhere: WhereOptions = {};
        let clientAccountResponse: SearchClientAccountTotalRecords = {};
        let sortByQuery = 'name';
        let sortDirectionQuery = 'asc';
        sortBy = sortBy?.toLowerCase();
        sortDirection = sortDirection?.toLowerCase();

        let subscriptionInclude = {
            model: this.subsModel,
            as: 'subscriptionType',
            required: false,
        };

        if (sortBy === 'name' || sortBy === 'subscription') {
            sortByQuery = sortBy;
        }

        if (sortDirection === 'asc' || sortDirection === 'desc') {
            sortDirection = sortDirection.toUpperCase();
            sortDirectionQuery = sortDirection;
        }

        if (startsWith && searchTerm) {
            clientAccountWhere['name'] = {
                [Op.or]: [{ [Op.like]: `${startsWith}%` }, { [Op.like]: `%${searchTerm}%` }],
            };
        } else if (startsWith) {
            clientAccountWhere['name'] = {
                [Op.like]: `${startsWith}%`,
            };
        } else if (searchTerm) {
            clientAccountWhere['name'] = {
                [Op.like]: `%${searchTerm}%`,
            };
        }

        if (isCompleted) {
            if (isCompleted === 'true') clientAccountWhere['is_completed'] = true;
            else if (isCompleted === 'false') clientAccountWhere['is_completed'] = false;
        }

        if (locations) {
            locations = locations.toLowerCase();

            if (locations === 'eu') clientAccountWhere['is_eu'] = true;

            if (locations === 'uk') clientAccountWhere['is_uk'] = true;

            if (locations == 'eu,uk' || locations == 'uk,eu') {
                clientAccountWhere['is_uk'] = true;
                clientAccountWhere['is_eu'] = true;
            }
        }
        if (subscriptionTypes) {
            clientAccountWhere['$subscriptionType.uuid$'] = {
                [Op.or]: subscriptionTypes.map((uuid) => uuid),
            };
            subscriptionInclude = {
                model: this.subsModel,
                as: 'subscriptionType',
                required: true,
            };
        }

        const { rows: clientAccountModels, count: totalRecords } = await this.model.findAndCountAll(
            {
                include: [
                    subscriptionInclude,
                    {
                        model: this.userModel,
                        as: 'team',
                        include: ['userRole'],
                    },
                ],
                distinct: true,
                where: clientAccountWhere,
                order: [[sortByQuery, sortDirectionQuery]],
                offset: offsetNum,
                limit: limitNum,
            }
        );

        if (clientAccountModels) {
            const clientAccounts: Array<SearchClientAccountResponse> = clientAccountModels.map(
                (model) => parseSearchClientAccountResponse(model)
            );
            clientAccountResponse.clientAccountsData = clientAccounts;
            clientAccountResponse.totalRecordsModels = totalRecords;
            return clientAccountResponse;
        }
    }

    async updateClientAccount(
        updateParameters: UpdateClientAccountParameters
    ): Promise<ClientAccountResponse | never[]> {
        if (!updateParameters.clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        const clientAccountToUpdate = await this.model.findOne({
            where: { uuid: updateParameters.clientAccountId },
            include: 'subscriptionType',
        });

        if (clientAccountToUpdate) {
            const subscriptionData = await this.subsModel.findOne({
                where: { uuid: updateParameters.subscription },
            });

            if (!subscriptionData) {
                throw new Error('Error: Wrong subscription uuid');
            }

            await clientAccountToUpdate.setSubscriptionType(subscriptionData);

            clientAccountToUpdate.subscriptionSeats = updateParameters.subscriptionSeats;
            clientAccountToUpdate.consultantHours = updateParameters.consultantHours;
            clientAccountToUpdate.contractStartDate = new Date(updateParameters.contractStartDate);
            clientAccountToUpdate.contractRollover = updateParameters.contractRollover;
            if (updateParameters.contractEndDate)
                clientAccountToUpdate.contractEndDate = new Date(updateParameters.contractEndDate);
            clientAccountToUpdate.isEu = updateParameters.isEU;
            clientAccountToUpdate.isUk = updateParameters.isUK;

            await clientAccountToUpdate.save();

            let updatedClientAccount = await this.model.findOne({
                where: { uuid: updateParameters.clientAccountId },
                include: {
                    model: this.subsModel,
                    as: 'subscriptionType',
                },
            });

            if (updatedClientAccount) {
                const newClientAccount = parseResponseFromModel(updatedClientAccount);
                return newClientAccount;
            }
            return [];
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async getClientAccountSeats(clientAccountId: string): Promise<number> {
        if (!clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        const clientAccountModel = await this.model.findOne({
            where: { uuid: clientAccountId },
        });

        if (clientAccountModel) {
            const subscriptionSeats = clientAccountModel.subscriptionSeats;
            return subscriptionSeats!;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async getClientAccountOccupiedSeats(clientAccountUuid: string): Promise<number> {
        if (!clientAccountUuid) {
            throw new Error('Error: clientAccountUuid cannot be empty');
        }

        const clientAccountModel = await this.model.findOne({
            where: { uuid: clientAccountUuid },
            include: {
                model: this.userModel,
                as: 'team',
            },
        });

        if (clientAccountModel) {
            // Only team members with teamMemberType === 3 (client users) count as occupied seats
            const userMembers = clientAccountModel.team!.filter(
                (user) =>
                    user.ClientAccountTeamModel?.teamMemberType === TeamMemberTypes.ClientUser &&
                    user.isActive
            );
            return userMembers.length;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async getClientAccountAvailableSeats(clientAccountId: string): Promise<number> {
        if (!clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        const clientAccountModel = await this.model.findOne({
            where: { uuid: clientAccountId },
            include: ['team'],
        });

        if (clientAccountModel) {
            return (
                clientAccountModel.subscriptionSeats! -
                clientAccountModel.team!.filter(
                    (teamMember) =>
                        teamMember.ClientAccountTeamModel?.teamMemberType ===
                        TeamMemberTypes.ClientUser && teamMember.isActive
                ).length
            );
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async getClientAccountTeam(clientAccountId: string): Promise<TeamMemberResponse[]> {
        if (!clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        const clientAccountModel = await this.model.findOne({
            where: { uuid: clientAccountId },

            include: [
                {
                    model: this.userModel,
                    as: 'team',
                    include: ['userRole'],
                },
            ],
        });

        if (clientAccountModel) {
            return await clientAccountModel.team!.map(parseTeamMember);
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async addTeamMember({
        clientAccountId,
        userId,
        teamMemberType,
    }: {
        clientAccountId: string;
        userId: string;
        teamMemberType: number;
    }) {
        if (!clientAccountId || !userId || !teamMemberType) {
            throw new Error('Error: parameters cannot be empty');
        }

        const userProfile = await this.userModel.findOne({
            where: {
                uuid: userId,
            },
        });

        const clientAccount = await this.model.findOne({
            where: {
                uuid: clientAccountId,
            },
        });

        if (userProfile && clientAccount) {
            await this.teamModel.create({
                userId: userProfile.id,
                clientAccountId: clientAccount.id,
                teamMemberType,
            });
            const updatedClientAccount = await this.model.findOne({
                where: { uuid: clientAccountId },
                include: [
                    {
                        model: this.userModel,
                        as: 'team',
                    },
                ],
            });

            console.log('RESPONSE: ', updatedClientAccount?.team);

            return await updatedClientAccount!.team!.map(parseTeamMember);
        } else {
            throw new Error('Error: clientAccount/userProfile not found');
        }
    }

    async checkNameAvailability(name: string): Promise<boolean> {
        const lowerCaseName = name.trim().toLocaleLowerCase();

        const coincidences = await this.model.findAll({
            where: {
                name: where(fn('LOWER', col('name')), 'LIKE', lowerCaseName),
            },
        });

        return coincidences.length == 0;
    }

    async UpdateCompletion(
        clientAccountUuid: string,
        isCompleted: boolean,
        lastStepCompleted: number
    ): Promise<boolean> {
        if (!clientAccountUuid) {
            throw new Error('Error: clientAccountUuid cannot be empty');
        }

        const clientAccountModel = await this.model.findOne({
            where: { uuid: clientAccountUuid },
        });

        if (clientAccountModel) {
            if (!clientAccountModel.isCompleted) {
                clientAccountModel.isCompleted = isCompleted;
                clientAccountModel.lastStepCompleted = lastStepCompleted;

                clientAccountModel.save();
            }

            return true;
        }
        return false;
    }

    async updateClientAccountHeader(
        updateParameters: UpdateClientAccountHeaderParameters
    ): Promise<ClientAccountResponse | never[]> {
        if (!updateParameters.clientAccountId) {
            throw new Error('Error: clientAccountId cannot be empty');
        }

        const clientAccountToUpdate = await this.model.findOne({
            where: { uuid: updateParameters.clientAccountId },
        });

        if (clientAccountToUpdate) {
            clientAccountToUpdate.name = updateParameters.name;

            clientAccountToUpdate.notes = updateParameters.notes;

            clientAccountToUpdate.contactName = updateParameters.contactName;

            clientAccountToUpdate.contactEmailAddress = updateParameters.contactEmailAddress;

            clientAccountToUpdate.contactTelephoneNumber = updateParameters.contactTelephoneNumber;

            await clientAccountToUpdate.save();

            let updatedClientAccount = await this.model.findOne({
                where: { uuid: updateParameters.clientAccountId },
                include: 'subscriptionType',
            });

            if (updatedClientAccount) {
                const newClientAccount = parseResponseFromModel(updatedClientAccount);
                return newClientAccount;
            }
            return [];
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }

    async checkSameName(name: string, clientAccountId: string): Promise<boolean> {
        let foundClientModel = await this.model.findOne({
            where: { uuid: clientAccountId },
        });

        if (foundClientModel) {
            if (name.toLocaleLowerCase() === foundClientModel.name.toLocaleLowerCase()) return true;
            else return false;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }
}
