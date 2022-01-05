import { Collection, CollectionAlert, CollectionAlertQuery, CollectionAlertRecipient } from '@dodsgroup/dods-model';
import {
    CollectionAlertsPersister,
    SearchCollectionAlertsParameters,
    getAlertsByCollectionResponse
} from '../domain';

export class CollectionAlertsRepository implements CollectionAlertsPersister {
    static defaultInstance: CollectionAlertsRepository = new CollectionAlertsRepository(
        CollectionAlert,
        Collection,
        CollectionAlertQuery,
        CollectionAlertRecipient

    );

    constructor(
        private model: typeof CollectionAlert,
        private collectionModel: typeof Collection,
        private alertQueryModel: typeof CollectionAlertQuery,
        private recipientModel: typeof CollectionAlertRecipient,

    ) { }

    mapCollection(model: CollectionAlert): Object {
        const { id, uuid, title, description, schedule, timezone, createdAt, updatedAt, collection, createdById, updatedById, alertTemplate } = model;

        const collectionAlert = {
            id,
            uuid,
            title,
            description,
            collection: collection ? { uuid: collection.uuid, name: collection.name } : {},
            template: alertTemplate ? { id: alertTemplate.id, name: alertTemplate.name } : {},
            schedule,
            timezone,
            createdBy: createdById ? { uuid: createdById.uuid, name: createdById.fullName, emailAddress: createdById.primaryEmail } : {},
            createdAt,
            updatedAt,
            updatedById: updatedById ? { uuid: updatedById.uuid, name: updatedById.fullName, emailAddress: updatedById.primaryEmail } : {},
        }
        model.collection.uuid;

        return collectionAlert
    }

    async getCollectionAlerts(parameters: SearchCollectionAlertsParameters): Promise<getAlertsByCollectionResponse> {

        const { collectionId, limit, offset } = parameters;

        const collection = await this.collectionModel.findOne({
            where: { uuid: collectionId }
        })


        if (!collection || !collection.isActive) {
            throw new Error(
                `Unable to retrieve Collection with uuid: ${collectionId}`
            );
        }



        const { rows, count } = await this.model.findAndCountAll({
            where: {
                collectionId: collection.id,
                isActive: true,
            },
            include: ['collection', 'createdById', 'updatedById', 'alertTemplate'],
            order: ['createdAt'],
            offset: parseInt(offset!),
            limit: parseInt(limit!),
        });

        return {
            alerts: rows.map((collectionAlert) => this.mapCollection(collectionAlert)),
            count: count
        };
    }

    async getQuerysByAlert(alertId: string): Promise<Array<CollectionAlertQuery>> {

        const alerts = await this.alertQueryModel.findAll({
            where: {
                alertId: alertId,
            },
        });

        return alerts
    }

    async getRecipientsByAlert(alertId: string): Promise<Array<CollectionAlertRecipient>> {

        const recipients = await this.recipientModel.findAll({
            where: {
                alertId: alertId,
            },
        });

        return recipients
    }

}
