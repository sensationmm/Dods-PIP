import { Collection, Op, Sequelize } from "@dodsgroup/dods-model";
import { CollectionsPersister, SearchCollectionsInput, SearchCollectionsOutput } from "./domain";

export * from './domain';

export class CollectionsRepository implements CollectionsPersister {
    static defaultInstance: CollectionsPersister = new CollectionsRepository();

    async list(parameters: SearchCollectionsInput): Promise<SearchCollectionsOutput> {

        const {
            clientAccountId,
            searchTerm,
            limit,
            offset,
            sortBy,
            sortDirection,
        } = parameters;

        let whereClause: any = {
            [Op.and]: [
                {
                    clientAccountId,
                    isActive: true,
                }
            ]
        }

        // Search by document name case insensitive coincidences
        if (searchTerm) {
            const lowerCaseName = searchTerm.trim().toLocaleLowerCase();

            whereClause[Op.and].push(Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('Collection.name')),
                'LIKE',
                `%${lowerCaseName}%`
            ))
        }

        let orderBy: any = [sortBy, sortDirection];

        const totalRecords = await Collection.count();

        const { count: filteredRecords, rows } = await Collection.findAndCountAll({
            where: whereClause,
            include: [
                Collection.associations.clientAccount,
                Collection.associations.alerts,
                Collection.associations.savedQueries,
                Collection.associations.documents,
            ],
            order: [orderBy],
            offset,
            limit,
        });

        const mappedRows = rows.map(row => ({
            uuid: row.uuid,
            name: row.name,
            clientAccount: { uuid: row.clientAccount.uuid, name: row.clientAccount.name },
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            alertsCount: row.alerts?.length,
            queriesCount: row.savedQueries?.length,
            documentsCount: row.documents?.length
        }));

        return {
            limit,
            offset,
            totalRecords,
            filteredRecords,
            data: mappedRows,
        };
    }
}