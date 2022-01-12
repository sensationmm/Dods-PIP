import { Collection, CollectionAlert, CollectionAlertQuery, CollectionAlertRecipient, User } from '@dodsgroup/dods-model';
import {
    CollectionAlertsPersister,
    CreateAlertParameters,
    SearchCollectionAlertsParameters,
    getAlertsByCollectionResponse,
    setAlertScheduleParameters,
    SearchAlertParameters,
    getAlertById,
    AlertOutput
} from './domain';

import { CollectionError } from "@dodsgroup/dods-domain"

export * from './domain';

export class CollectionAlertsRepository implements CollectionAlertsPersister {
    static defaultInstance: CollectionAlertsRepository = new CollectionAlertsRepository(
        CollectionAlert,
        Collection,
        CollectionAlertQuery,
        CollectionAlertRecipient,
        User,
        CollectionAlert

    );

    constructor(
        private model: typeof CollectionAlert,
        private collectionModel: typeof Collection,
        private alertQueryModel: typeof CollectionAlertQuery,
        private recipientModel: typeof CollectionAlertRecipient,
        private userModel: typeof User,
        private alertModel: typeof CollectionAlert

    ) { }

    mapAlert(model: CollectionAlert): AlertOutput {
        const { id, uuid, title, description, schedule, timezone, createdAt, updatedAt, collection, createdById, updatedById, alertTemplate, hasKeywordsHighlight, isScheduled, isPublished, lastStepCompleted } = model;

        return {
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
            updatedBy: updatedById ? { uuid: updatedById.uuid, name: updatedById.fullName, emailAddress: updatedById.primaryEmail } : {},
            hasKeywordsHighlight: hasKeywordsHighlight ? true : false,
            isSchedule: isScheduled ? true : false,
            lastStepCompleted: lastStepCompleted,
            isPublished: isPublished ? true : false
        }
    }

    async getCollectionAlerts(parameters: SearchCollectionAlertsParameters): Promise<getAlertsByCollectionResponse> {

        const { collectionId, limit, offset } = parameters;

        const collection = await this.collectionModel.findOne({
            where: { uuid: collectionId }
        })

        if (!collection || !collection.isActive) {
            throw new CollectionError(
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
            alerts: rows.map((collectionAlert) => this.mapAlert(collectionAlert)),
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

    async createAlert(parameters: CreateAlertParameters): Promise<CollectionAlert> {
        const { collectionId, createdBy, title, alertQueries } = parameters;

        if (!alertQueries?.length) {
            throw new CollectionError(
                `Error: AlertQueries shouldn't be empty`,
            );
        }

        const alertOwner = await this.collectionModel.findOne({
            where: {
                uuid: collectionId,
            },
        });


        if (!alertOwner) {
            throw new CollectionError(
                `Error: Collection with uuid: ${collectionId} does not exist`,
            );
        }
        const alertCreator = await this.userModel.findOne({
            where: {
                uuid: createdBy,
            },
        });
        if (!alertCreator) {
            throw new CollectionError(
                `Error: User with uuid: ${createdBy} does not exist`,

            );
        }
        const createObject: any = { collectionId: alertOwner.id, title: title, createdBy: alertCreator.id }
        const newAlert = await this.alertModel.create(createObject);

        return await newAlert.reload({ include: ['collection', 'createdById'] });
    }

    async createQuery(parameters: any): Promise<CollectionAlertQuery> {

        const newAlertQuery = await CollectionAlertQuery.create(parameters);

        return await newAlertQuery.reload();
    }

    async setAlertSchedule(parameters: setAlertScheduleParameters): Promise<CollectionAlert> {

        const { isScheduled, schedule, alertId, hasKeywordHighlight, timezone, updatedBy, alertTemplateId, collectionId } = parameters

        console.log(alertId);

        if (isScheduled && !schedule) {
            throw new CollectionError(
                `Must provide a schedule `,
            );
        }

        const alert = await this.alertModel.findOne({
            where: {
                uuid: alertId,
            },
            include: ['collection', 'createdById', 'updatedById', 'alertTemplate']
        });

        if (!alert) {
            throw new CollectionError(
                `Could not found Alert with uuid: ${alertId}`,
            );
        }

        if (alert.collection.uuid !== collectionId) {
            throw new CollectionError(
                `This alert does not belong to the collection `,
            );
        }


        const alertOwner = await this.userModel.findOne({
            where: {
                uuid: updatedBy,
            },
        });


        if (!alertOwner) {
            throw new CollectionError(
                `Error: User with uuid: ${updatedBy} does not exist`,
            );
        }

        try {
            await alert.update({
                isScheduled: isScheduled,
                hasKeywordsHighlight: hasKeywordHighlight,
                timezone: timezone,
                schedule: schedule,
                updatedBy: alertOwner.id,
                lastStepCompleted: 3,
                templateId: alertTemplateId
            });

            await alert.reload({
                include: ['collection', 'createdById', 'updatedById', 'alertTemplate'],
            });

        } catch (error) {
            throw new CollectionError(
                `Error Scheduling Alert Update`,
            );

        }

        return alert;
    }


    async getAlert(parameters: SearchAlertParameters): Promise<getAlertById> {
        const { collectionId, alertId } = parameters;

        const collection = await this.collectionModel.findOne({
            where: { uuid: collectionId }
        })

        if (!collection || !collection.isActive) {
            throw new CollectionError(
                `Unable to retrieve Collection with uuid: ${collectionId}`
            );
        }

        const alert = await this.alertModel.findOne({
            where: {
                uuid: alertId,
                collectionId: collection.id,
                isActive: true,
            },
            include: ['collection', 'createdById', 'updatedById', 'alertTemplate']
        })

        if (!alert || !alert.isActive) {
            throw new CollectionError(
                `Unable to retrieve Alert with uuid: ${alertId}`
            );
        }


        const alertQueryResponse = await this.alertQueryModel.findAndCountAll({
            where: {
                alertId: alert.id,
                isActive: true,
            }
        });


        const alertRecipientResponse = await this.recipientModel.findAndCountAll({
            where: {
                alertId: alert.id
            }
        });


        return {
            alert: this.mapAlert(alert),
            searchQueriesCount: alertQueryResponse.count,
            recipientsCount: alertRecipientResponse.count
        }
    }
}
