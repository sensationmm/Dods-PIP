import { ClientAccount, Collection, CollectionAlert, CollectionDocument, CollectionSavedQuery, Sequelize, User, WhereOptions } from '@dodsgroup/dods-model';
import {
    CollectionsPersister,
    DeleteCollectionInput,
    GetCollectionInput,
    GetCollectionOutput,
    SearchCollectionsInput,
    SearchCollectionsOutput,
} from './domain';

import { CollectionError } from '@dodsgroup/dods-domain';
import { mapCollection } from '..';

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
                    as: 'clientAccount',
                    where: clientAccountWhere,
                    required: true
                },
                {
                    model: ClientAccount, as: 'clientAccount'
                },
                {
                    model: CollectionAlert, as: 'alerts'
                },
                {
                    model: CollectionSavedQuery, as: 'savedQueries'
                },
                {
                    model: CollectionDocument, as: 'documents'
                },
                {
                    model: User, as: 'createdBy',
                }
            ],
            order: [orderBy],
            offset,
            limit,
        });

        const data = await Promise.all(rows.map((row) => mapCollection(row)));

        return {
            limit,
            offset,
            totalRecords,
            filteredRecords,
            data,
        };
    }

    async get(parameters: GetCollectionInput): Promise<GetCollectionOutput> {
        const collection = await Collection.findOne({
            where: {
                uuid: parameters.collectionId,
                isActive: true,
            },
            include: [
                {
                    model: ClientAccount, as: 'clientAccount'
                },
                {
                    model: CollectionAlert, as: 'alerts'
                },
                {
                    model: CollectionSavedQuery, as: 'savedQueries'
                },
                {
                    model: CollectionDocument, as: 'documents'
                },
                {
                    model: User, as: 'createdBy',
                }
            ],
        });

        if (!collection) {
            throw new CollectionError('Collection not found');
        }

        return {
            data: await mapCollection(collection)
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
