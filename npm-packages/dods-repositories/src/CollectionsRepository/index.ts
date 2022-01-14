import { ClientAccount, Collection, Sequelize, WhereOptions } from '@dodsgroup/dods-model';
import {
    CollectionsPersister,
    DeleteCollectionInput,
    GetCollectionInput,
    GetCollectionOutput,
    SearchCollectionsInput,
    SearchCollectionsOutput,
} from './domain';

import { CollectionError } from '@dodsgroup/dods-domain';

export * from './domain';

export class CollectionsRepository implements CollectionsPersister {
    static defaultInstance: CollectionsPersister = new CollectionsRepository();

    async list(parameters: SearchCollectionsInput): Promise<SearchCollectionsOutput> {
        const { clientAccountId, searchTerm, startsWith, limit, offset, sortBy, sortDirection } =
            parameters;

        let whereClause: WhereOptions = {
            isActive: true,
        };

        const searchString = startsWith || searchTerm;

        //* Search by document name case insensitive coincidences
        if (searchString) {
            const lowerCaseName = searchString.trim().toLocaleLowerCase();

            //* If searchTerm was given then search for coincidences in any part of the name
            //* If not search only in the beginning
            whereClause = {
                ...whereClause,
                $and: Sequelize.where(
                    Sequelize.fn('LOWER', Sequelize.col('Collection.name')),
                    'LIKE',
                    `${searchTerm ? '%' : ''}${lowerCaseName}%`
                ),
            };
        }

        let clientAccountWhere = {};
        if (clientAccountId) {
            clientAccountWhere = {
                uuid: clientAccountId,
            };
        }

        let orderBy: any = [sortBy, sortDirection];

        const totalRecords = await Collection.count();

        const { count: filteredRecords, rows } = await Collection.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: ClientAccount,
                    where: clientAccountWhere,
                    association: Collection.associations.clientAccount,
                    required: true,
                },
                Collection.associations.alerts,
                Collection.associations.savedQueries,
                Collection.associations.documents,
            ],
            order: [orderBy],
            offset,
            limit,
        });

        const mappedRows = rows.map((row) => ({
            uuid: row.uuid,
            name: row.name,
            clientAccount: { uuid: row.clientAccount.uuid, name: row.clientAccount.name },
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            alertsCount: row.alerts?.length,
            queriesCount: row.savedQueries?.length,
            documentsCount: row.documents?.length,
        }));

        return {
            limit,
            offset,
            totalRecords,
            filteredRecords,
            data: mappedRows,
        };
    }

    async get(parameters: GetCollectionInput): Promise<GetCollectionOutput> {
        const collection = await Collection.findOne({
            where: {
                uuid: parameters.collectionId,
                isActive: true,
            },
            include: [
                Collection.associations.clientAccount,
                Collection.associations.alerts,
                Collection.associations.savedQueries,
                Collection.associations.documents,
            ],
        });

        if (!collection) {
            throw new CollectionError('Collection not found');
        }

        return {
            data: {
                uuid: collection.uuid,
                name: collection.name,
                clientAccount: {
                    uuid: collection.clientAccount.uuid,
                    name: collection.clientAccount.name,
                },
                createdAt: collection.createdAt,
                updatedAt: collection.updatedAt,
                alertsCount: collection.alerts!.length,
                queriesCount: collection.savedQueries!.length,
                documentsCount: collection.documents!.length,
            },
        };
    }

    async delete(parameters: DeleteCollectionInput): Promise<boolean> {
        const { collectionId } = parameters;

        const collection = await Collection.findOne({
            where: {
                uuid: collectionId,
                isActive: true,
            },
            include: [Collection.associations.clientAccount, Collection.associations.createdBy],
        });

        if (!collection) {
            throw new CollectionError('Collection not found');
        }

        await collection.update({ isActive: false });

        await collection.destroy();

        return true;
    }
}
