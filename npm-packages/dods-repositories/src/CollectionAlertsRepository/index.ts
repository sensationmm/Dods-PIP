import {
    AlerByIdOutput,
    CollectionAlertsPersister,
    CopyAlertParameters,
    CopyAlertResponse,
    CreateAlertParameters,
    CreateAlertQueryParameters,
    DeleteAlertParameters,
    SearchAlertParameters,
    SearchAlertQueriesParameters,
    SearchCollectionAlertsParameters,
    getAlertsByCollectionResponse,
    getQueriesResponse,
    setAlertScheduleParameters
} from './domain';
import { AlertDocumentInput, AlertInput, AlertQueryInput, Collection, CollectionAlert, CollectionAlertDocument, CollectionAlertQuery, CollectionAlertRecipient, User } from '@dodsgroup/dods-model';

import { CollectionError } from "@dodsgroup/dods-domain"
import { cloneArray, cloneObject, mapAlert, mapAlertQuery } from '..';

export * from './domain';

export class CollectionAlertsRepository implements CollectionAlertsPersister {
    static defaultInstance: CollectionAlertsRepository = new CollectionAlertsRepository(
        CollectionAlert,
        Collection,
        CollectionAlertDocument,
        CollectionAlertQuery,
        CollectionAlertRecipient,
        User,
        CollectionAlert
    );

    constructor(
        private model: typeof CollectionAlert,
        private collectionModel: typeof Collection,
        private alertDocumentModel: typeof CollectionAlertDocument,
        private alertQueryModel: typeof CollectionAlertQuery,
        private recipientModel: typeof CollectionAlertRecipient,
        private userModel: typeof User,
        private alertModel: typeof CollectionAlert

    ) { }

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
            alerts: await Promise.all(rows.map((collectionAlert) => mapAlert(collectionAlert))),
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

    async setAlertSchedule(parameters: setAlertScheduleParameters): Promise<CollectionAlert> {

        const { isScheduled, schedule, alertId, hasKeywordHighlight, timezone, updatedBy, alertTemplateId, collectionId } = parameters

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


    async getAlert(parameters: SearchAlertParameters): Promise<AlerByIdOutput> {
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

        if (!alert) {
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
            alert: await mapAlert(alert),
            searchQueriesCount: alertQueryResponse.count,
            recipientsCount: alertRecipientResponse.count
        }
    }

    async copyAlert(parameters: CopyAlertParameters): Promise<CopyAlertResponse> {
        const { collectionId, alertId, destinationCollectionId, createdBy } = parameters;

        // * Retrieve initial data and validate data integrity
        const collection = await this.collectionModel.findOne({
            where: { uuid: collectionId, isActive: true }
        })

        if (!collection)
            throw new CollectionError(`Unable to retrieve Collection with uuid: ${collectionId}`);


        const destinationCollection = await this.collectionModel.findOne({
            where: { uuid: destinationCollectionId, isActive: true }
        })

        if (!destinationCollection)
            throw new CollectionError(`Unable to retrieve Destination Collection with uuid: ${destinationCollectionId}`);


        const alertCreator = await this.userModel.findOne({
            where: { uuid: createdBy, isActive: true }
        });

        if (!alertCreator)
            throw new CollectionError(`Unable to retrieve user with uuid: ${createdBy}`);


        const existingAlert = await this.alertModel.findOne({
            where: {
                uuid: alertId,
                collectionId: collection.id,
                isActive: true,
            },
            raw: true,
            include: ['collection', 'createdById', 'updatedById', 'alertTemplate']
        })

        if (!existingAlert)
            throw new CollectionError(`Unable to retrieve Alert with uuid: ${alertId}`);


        // * Copy alert
        const copiedAlert = cloneObject<CollectionAlert, AlertInput>(existingAlert, {
            collectionId: destinationCollection.id,
            createdBy: alertCreator.id,
        }, ['id', 'uuid', 'createdAt', 'updatedAt', 'updatedBy', 'CollectionId']);

        const alert = await this.alertModel.create({ ...copiedAlert });
        await alert.reload({ include: ['collection', 'createdById', 'updatedById', 'alertTemplate'] })

        // * Copy queries
        const existingQueries = await this.alertQueryModel.findAll({
            where: {
                alertId: existingAlert.id,
                isActive: true,
            },
            raw: true,
        })

        if (existingQueries && existingQueries.length > 0) {
            const copiedQueries = cloneArray<CollectionAlertQuery, Partial<AlertQueryInput>>(existingQueries, {
                alertId: alert.id,
                createdBy: alertCreator.id,
            }, ['id', 'uuid', 'createdAt', 'updatedAt', 'updatedBy']) as CollectionAlertQuery[]

            await this.alertQueryModel.bulkCreate(copiedQueries);
        }

        // * Copy collection documents
        const existingAlertDocuments = await this.alertDocumentModel.findAll({
            // TODO: is there an "isActive" column in the database for this model? If so, add to where clausule 'isActive: true'
            where: {
                alertId: existingAlert.id,
            },
            raw: true,
        });

        if (existingAlertDocuments && existingAlertDocuments.length > 0) {
            const copiedAlertDocs = cloneArray<CollectionAlertDocument, AlertDocumentInput>(existingAlertDocuments, {
                alertId: alert.id,
                createdBy: alertCreator.id
                // TODO: is there an "updatedBy" column in the database for this model? If so, add 'updatedBy' to the array
            }, ['createdAt', 'updatedAt', 'deletedAt'])
            await this.alertDocumentModel.bulkCreate(copiedAlertDocs);
        }

        return {
            alert: await mapAlert(alert),
            searchQueriesCount: existingQueries.length,
            documentsCount: existingAlertDocuments.length,
            recipientsCount: 0
        }
    }

    async createQuery(parameters: CreateAlertQueryParameters): Promise<Object> {

        const { alertId, createdBy, informationTypes, contentSources, query } = parameters

        const alert = await CollectionAlert.findOne({
            where: {
                uuid: alertId,
                isActive: true
            },
        });


        if (!alert) {

            throw new CollectionError(
                `Error: could not retrieve Alert with uuid: ${alertId}`,
            );
        }

        const alertQueryOwner = await User.findOne({
            where: {
                uuid: createdBy,
            },
        });


        if (!alertQueryOwner) {

            throw new CollectionError(
                `Error: could not retrieve User with uuid: ${createdBy}`,
            );
        }

        const createAlertQuery: any = {
            alertId: alert.id,
            informationTypes,
            contentSources,
            query,
            createdBy: alertQueryOwner.id
        }

        const newAlertQuery = await CollectionAlertQuery.create(createAlertQuery);
        await newAlertQuery.reload({ include: ['createdById'] })
        return await mapAlertQuery(newAlertQuery, alert)
    }

    async getAlertQueries(parameters: SearchAlertQueriesParameters): Promise<getQueriesResponse> {

        let { alertId, limit, offset, sortDirection } = parameters;

        const alert = await CollectionAlert.findOne({
            where: {
                uuid: alertId,
                isActive: true
            }
        })

        if (!alert) {
            throw new CollectionError(
                `Alert not found`
            );
        }

        if (sortDirection !== 'DESC' && sortDirection !== 'ASC') {
            sortDirection = 'ASC';
        }

        // const { rows, count } = await CollectionAlertQuery.findAndCountAll({
        //     where: {
        //         alertId: alert.id,
        //         isActive: true,
        //     },

        // });

        const rows = await alert.getAlertQueries({
            where: {
                isActive: true,
            },
            include: ['createdById'],
            order: [['createdAt', sortDirection]],
            offset: parseInt(offset!),
            limit: parseInt(limit!),
        })

        const count = await alert.countAlertQueries({
            where: {
                isActive: true,
            }
        })

        return {
            queries: await Promise.all(rows.map((collectionAlert) => mapAlertQuery(collectionAlert, alert))),
            count: count
        };
    }

    async deleteAlert(parameters: DeleteAlertParameters): Promise<void> {
        const { collectionId, alertId } = parameters;

        const collection = await this.collectionModel.findOne({
            where: { uuid: collectionId, isActive: true }
        })

        if (!collection)
            throw new CollectionError(`Unable to retrieve Collection with uuid: ${collectionId}`);

        const alert = await this.alertModel.findOne({
            where: {
                uuid: alertId,
                collectionId: collection.id,
                isActive: true,
            }
        })

        if (!alert) {
            throw new CollectionError(
                `Unable to retrieve Alert with uuid: ${alertId}`
            );
        }

        await alert.update({ isActive: false });
        await alert.destroy();
    }
}
