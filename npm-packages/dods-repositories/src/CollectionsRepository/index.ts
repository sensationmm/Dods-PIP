import { ClientAccount, Collection, CollectionAlert, CollectionDocument, CollectionSavedQuery, Sequelize, User, WhereOptions } from '@dodsgroup/dods-model';
import {
    CollectionsPersister,
    DeleteCollectionInput,
    GetCollectionInput,
    GetCollectionOutput,
    SearchCollectionsInput,
    SearchCollectionsOutput,
    UpdateCollectionParameters,
    CollectionOutput
} from './domain';

import { CollectionError } from '@dodsgroup/dods-domain';
import { mapCollection } from '..';

export * from './domain';

export class CollectionsRepository implements CollectionsPersister {
    static defaultInstance: CollectionsPersister = new CollectionsRepository(
        Collection,
        User,
    );

    constructor(
        private model: typeof Collection,
        private userModel: typeof User,

    ) { }

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

        const totalRecords = await this.model.count();

        const { count: filteredRecords, rows } = await this.model.findAndCountAll({
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
                },
                {
                    model: User, as: 'updatedBy',
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
        const collection = await this.model.findOne({
            where: {
                uuid: parameters.collectionId,
                isActive: true,
            },
            include: ['clientAccount', 'alerts', 'savedQueries', 'documents', 'createdBy', 'updatedBy']
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

        const collection = await this.model.findOne({
            where: {
                uuid: collectionId,
                isActive: true,
            },
            include: [this.model.associations.clientAccount, this.model.associations.createdBy],
        });

        if (!collection) {
            throw new CollectionError('Collection not found');
        }

        await collection.update({ isActive: false });
        await collection.destroy();

        return true;
    }

    async update(parameters: UpdateCollectionParameters): Promise<CollectionOutput> {

        const { name, collectionId, updatedBy } = parameters
        const collection = await this.model.findOne({
            where: {
                uuid: collectionId,
                isActive: true
            },
        });

        if (!collection) {
            throw new Error(
                `Error: could not retrieve Collection with uuid: ${collectionId}`,
            );
        }

        const updatedByUser = await this.userModel.findOne({
            where: {
                uuid: updatedBy,
                isActive: true
            },
        });

        if (!updatedByUser) {
            throw new Error(
                `Error: could not retrieve User with uuid: ${updatedBy}`,
            );
        }

        await collection.update({ name: name, updatedById: updatedByUser.id });

        await collection.reload({ include: ['clientAccount', 'createdBy', 'updatedBy'] });

        return await mapCollection(collection);
    }
}
