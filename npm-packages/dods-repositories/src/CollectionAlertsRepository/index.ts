import {
    AlertByIdOutput,
    AlertDocumentParameters,
    AlertOutput,
    AlertQueryResponse,
    AlertWithQueriesOutput,
    CollectionAlertsPersister,
    CopyAlertParameters,
    CopyAlertResponse,
    CopyQueryParameters,
    CreateAlertParameters,
    CreateAlertQueryParameters,
    DeleteAlertParameters,
    DeleteAlertQueryParameters,
    SearchAlertParameters,
    SearchAlertParametersById,
    SearchAlertQueriesParameters,
    SearchCollectionAlertsParameters,
    SetAlertQueriesParameters,
    UpdateAlertParameters,
    UpdateAlertQuery,
    getAlertsByCollectionResponse,
    getQueriesResponse,
    setAlertScheduleParameters,
    createESQueryParameters,
    updateAlertElasticQueryParameters,
} from './domain';
import {
    AlertDocumentInput,
    AlertInput,
    AlertQueryInput,
    ClientAccount,
    Collection,
    CollectionAlert,
    CollectionAlertDocument,
    CollectionAlertQuery,
    CollectionAlertRecipient,
    User,
} from '@dodsgroup/dods-model';
import { cloneArray, cloneObject, mapAlert, mapAlertQuery } from '..';

import { CollectionError } from '@dodsgroup/dods-domain';
import { LastStepCompleted } from '../shared/Constants';

export * from './domain';

export class CollectionAlertsRepository implements CollectionAlertsPersister {
    static defaultInstance: CollectionAlertsRepository = new CollectionAlertsRepository(
        CollectionAlert,
        Collection,
        CollectionAlertDocument,
        CollectionAlertQuery,
        CollectionAlertRecipient,
        User);

    constructor(
        private model: typeof CollectionAlert,
        private collectionModel: typeof Collection,
        private alertDocumentModel: typeof CollectionAlertDocument,
        private alertQueryModel: typeof CollectionAlertQuery,
        private recipientModel: typeof CollectionAlertRecipient,
        private userModel: typeof User
    ) { }

    async getCollectionAlerts(
        parameters: SearchCollectionAlertsParameters
    ): Promise<getAlertsByCollectionResponse> {
        const { collectionId, limit, offset } = parameters;

        const collection = await this.collectionModel.findOne({
            where: { uuid: collectionId },
        });

        if (!collection || !collection.isActive) {
            throw new CollectionError(`Unable to retrieve Collection with uuid: ${collectionId}`);
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
            count: count,
        };
    }

    async getQueriesByAlert(alertId: string): Promise<Array<CollectionAlertQuery>> {
        const alerts = await this.alertQueryModel.findAll({
            where: {
                alertId: alertId,
            },
        });

        return alerts;
    }

    async getRecipientsByAlert(alertId: string): Promise<Array<CollectionAlertRecipient>> {
        const recipients = await this.recipientModel.findAll({
            where: {
                alertId: alertId,
            },
        });

        return recipients;
    }
    async createAlert(parameters: CreateAlertParameters): Promise<AlertOutput> {
        const { collectionId, createdBy, title } = parameters;

        const alertOwner = await this.collectionModel.findOne({
            where: {
                uuid: collectionId,
            },
        });
        if (!alertOwner) {
            throw new CollectionError(
                `Error: Collection with uuid: ${collectionId} does not exist`
            );
        }

        const alertCreator = await this.userModel.findOne({
            where: {
                uuid: createdBy,
            },
        });
        if (!alertCreator) {
            throw new CollectionError(`Error: User with uuid: ${createdBy} does not exist`);
        }

        const createObject: any = {
            collectionId: alertOwner.id,
            title: title,
            createdBy: alertCreator.id,
            lastStepCompleted: LastStepCompleted.CreateAlert
        };
        const newAlert = await CollectionAlert.create(createObject);
        await newAlert.reload({ include: ['collection', 'createdById'] });

        return await mapAlert(newAlert)
    }

    async setAlertSchedule(parameters: setAlertScheduleParameters): Promise<CollectionAlert> {
        const {
            isScheduled,
            schedule,
            alertId,
            hasKeywordHighlight,
            timezone,
            updatedBy,
            alertTemplateId,
            collectionId,
        } = parameters;

        if (isScheduled && !schedule) {
            throw new CollectionError(`Must provide a schedule `);
        }

        const alert = await this.model.findOne({
            where: {
                uuid: alertId,
            },
            include: ['collection', 'createdById', 'updatedById', 'alertTemplate'],
        });

        if (!alert) {
            throw new CollectionError(`Could not found Alert with uuid: ${alertId}`);
        }

        if (alert.collection.uuid !== collectionId) {
            throw new CollectionError(`This alert does not belong to the collection `);
        }

        const alertOwner = await this.userModel.findOne({
            where: {
                uuid: updatedBy,
            },
        });

        if (!alertOwner) {
            throw new CollectionError(`Error: User with uuid: ${updatedBy} does not exist`);
        }

        try {
            if (alert.lastStepCompleted === LastStepCompleted.SetAlertRecipients) {
                await alert.update({ lastStepCompleted: LastStepCompleted.ScheduleAlert });
            }
            await alert.update({
                isScheduled: isScheduled,
                hasKeywordsHighlight: hasKeywordHighlight,
                timezone: timezone,
                schedule: schedule,
                updatedBy: alertOwner.id,
                templateId: alertTemplateId,
            });

            await alert.reload({
                include: ['collection', 'createdById', 'updatedById', 'alertTemplate'],
            });
        } catch (error) {
            throw new CollectionError(`Error Scheduling Alert Update`);
        }

        return alert;
    }

    async getAlert(parameters: SearchAlertParameters): Promise<AlertByIdOutput> {
        const { collectionId, alertId } = parameters;

        const collection = await this.collectionModel.findOne({
            where: { uuid: collectionId },
        });

        if (!collection || !collection.isActive) {
            throw new CollectionError(`Unable to retrieve Collection with uuid: ${collectionId}`);
        }

        const alert = await this.model.findOne({
            where: {
                uuid: alertId,
                collectionId: collection.id,
                isActive: true,
            },
            include: [{
                model: Collection,
                as: 'collection',
                include: [
                    {
                        model: ClientAccount,
                        as: 'clientAccount',
                    }
                ]
            }, 'createdById', 'updatedById', 'alertTemplate'],
        });

        if (!alert) {
            throw new CollectionError(`Unable to retrieve Alert with uuid: ${alertId}`);
        }

        const alertQueryResponse = await this.alertQueryModel.findAndCountAll({
            where: {
                alertId: alert.id,
                isActive: true,
            },
        });

        const alertRecipientResponse = await this.recipientModel.findAndCountAll({
            where: {
                alertId: alert.id,
            },
        });

        return {
            alert: await mapAlert(alert),
            searchQueriesCount: alertQueryResponse.count,
            recipientsCount: alertRecipientResponse.count,
        };
    }

    async getAlertById(parameters: SearchAlertParametersById): Promise<AlertByIdOutput> {
        const { alertId } = parameters;

        const alert = await this.model.findOne({
            where: {
                uuid: alertId,
                isActive: true,
            },
            include: [{
                model: Collection,
                as: 'collection',
                include: [
                    {
                        model: ClientAccount,
                        as: 'clientAccount',
                    }
                ]
            }, 'createdById', 'updatedById', 'alertTemplate'],
        });

        if (!alert) {
            throw new CollectionError(`Unable to retrieve Alert with uuid: ${alertId}`);
        }

        const alertQueryResponse = await this.alertQueryModel.findAndCountAll({
            where: {
                alertId: alert.id,
                isActive: true,
            },
        });

        const alertRecipientResponse = await this.recipientModel.findAndCountAll({
            where: {
                alertId: alert.id,
            },
        });

        return {
            alert: await mapAlert(alert),
            searchQueriesCount: alertQueryResponse.count,
            recipientsCount: alertRecipientResponse.count,
        };
    }

    async copyQuery(parameters: CopyQueryParameters): Promise<AlertQueryResponse> {
        const { queryId, destinationAlertId, createdBy } = parameters;

        // * Retrieve initial data and validate data integrity
        const destinationAlert = await this.model.findOne({
            where: { uuid: destinationAlertId, isActive: true },
        });

        if (!destinationAlert)
            throw new CollectionError(
                `Unable to retrieve Destination Collection with uuid: ${destinationAlertId}`
            );

        const queryCreator = await this.userModel.findOne({
            where: { uuid: createdBy, isActive: true },
        });

        if (!queryCreator)
            throw new CollectionError(`Unable to retrieve user with uuid: ${createdBy}`);

        const existingQuery = await this.alertQueryModel.findOne({
            where: {
                uuid: queryId,
                isActive: true,
            },
            raw: true,
        });

        if (!existingQuery)
            throw new CollectionError(`Unable to retrieve Alert Query with uuid: ${queryId}`);

        // * Copy query
        const newQueryInput = cloneObject<CollectionAlertQuery, AlertQueryInput>(
            existingQuery,
            {
                alertId: destinationAlert.id,
                createdBy: queryCreator.id,
            },
            ['id', 'uuid', 'createdAt', 'updatedAt']
        );

        const newQuery = await this.alertQueryModel.create({ ...newQueryInput });
        await newQuery.reload({ include: ['createdById'] });
        return await mapAlertQuery(newQuery, destinationAlert);
    }

    async copyAlert(parameters: CopyAlertParameters): Promise<CopyAlertResponse> {
        const { collectionId, alertId, destinationCollectionId, createdBy } = parameters;

        // * Retrieve initial data and validate data integrity
        const collection = await this.collectionModel.findOne({
            where: { uuid: collectionId, isActive: true },
        });

        if (!collection)
            throw new CollectionError(`Unable to retrieve Collection with uuid: ${collectionId}`);

        const destinationCollection = await this.collectionModel.findOne({
            where: { uuid: destinationCollectionId, isActive: true },
        });

        if (!destinationCollection)
            throw new CollectionError(
                `Unable to retrieve Destination Collection with uuid: ${destinationCollectionId}`
            );

        const alertCreator = await this.userModel.findOne({
            where: { uuid: createdBy, isActive: true },
        });

        if (!alertCreator)
            throw new CollectionError(`Unable to retrieve user with uuid: ${createdBy}`);

        const existingAlert = await this.model.findOne({
            where: {
                uuid: alertId,
                collectionId: collection.id,
                isActive: true,
            },
            raw: true,
            include: ['collection', 'createdById', 'updatedById', 'alertTemplate'],
        });

        if (!existingAlert)
            throw new CollectionError(`Unable to retrieve Alert with uuid: ${alertId}`);

        // * Copy alert
        const copiedAlert = cloneObject<CollectionAlert, AlertInput>(
            existingAlert,
            {
                collectionId: destinationCollection.id,
                createdBy: alertCreator.id,
            },
            ['id', 'uuid', 'createdAt', 'updatedAt', 'updatedBy', 'CollectionId']
        );

        const alert = await this.model.create({ ...copiedAlert });
        await alert.reload({
            include: ['collection', 'createdById', 'updatedById', 'alertTemplate'],
        });

        // * Copy queries
        const existingQueries = await this.alertQueryModel.findAll({
            where: {
                alertId: existingAlert.id,
                isActive: true,
            },
            raw: true,
        });

        if (existingQueries && existingQueries.length > 0) {
            const copiedQueries = cloneArray<CollectionAlertQuery, Partial<AlertQueryInput>>(existingQueries, {
                alertId: alert.id,
                createdBy: alertCreator.id,
            }, ['id', 'uuid', 'createdAt', 'updatedAt', 'updatedBy']);

            await this.alertQueryModel.bulkCreate(copiedQueries);
        }

        // * Copy collection documents
        const existingAlertDocuments = await this.alertDocumentModel.findAll({
            // TODO: is there an "isActive" column in the database for this model? If so, add to where clause 'isActive: true'
            where: {
                alertId: existingAlert.id,
            },
            raw: true,
        });

        if (existingAlertDocuments && existingAlertDocuments.length > 0) {
            const copiedAlertDocs = cloneArray<CollectionAlertDocument, AlertDocumentInput>(
                existingAlertDocuments,
                {
                    alertId: alert.id,
                    createdBy: alertCreator.id,
                    // TODO: is there an "updatedBy" column in the database for this model? If so, add 'updatedBy' to the array
                },
                ['createdAt', 'updatedAt', 'deletedAt']
            );
            await this.alertDocumentModel.bulkCreate(copiedAlertDocs);
        }

        return {
            alert: await mapAlert(alert),
            searchQueriesCount: existingQueries.length,
            documentsCount: existingAlertDocuments.length,
            recipientsCount: 0,
        };
    }

    async createQuery(parameters: CreateAlertQueryParameters): Promise<Object> {
        const { alertId, createdBy, informationTypes, contentSources, query } = parameters;

        const alert = await CollectionAlert.findOne({
            where: {
                uuid: alertId,
                isActive: true,
            },
        });

        if (!alert) {
            throw new CollectionError(`Error: could not retrieve Alert with uuid: ${alertId}`);
        }

        const alertQueryOwner = await User.findOne({
            where: {
                uuid: createdBy,
            },
        });

        if (!alertQueryOwner) {
            throw new CollectionError(`Error: could not retrieve User with uuid: ${createdBy}`);
        }

        const createAlertQuery: any = {
            alertId: alert.id,
            informationTypes,
            contentSources,
            query,
            createdBy: alertQueryOwner.id,
        };

        const newAlertQuery = await CollectionAlertQuery.create(createAlertQuery);
        await newAlertQuery.reload({ include: ['createdById'] });

        const alertUpdateParams: updateAlertElasticQueryParameters = {alertId: alert.uuid}
        await this.updateAlertElasticQuery(alertUpdateParams)

        return await mapAlertQuery(newAlertQuery, alert);
    }

    async getAlertQueries(parameters: SearchAlertQueriesParameters): Promise<getQueriesResponse> {
        let { alertId, limit, offset, sortDirection } = parameters;

        const alert = await CollectionAlert.findOne({
            where: {
                uuid: alertId,
                isActive: true,
            },
        });

        if (!alert) {
            throw new CollectionError(`Alert not found`);
        }

        if (sortDirection !== 'DESC' && sortDirection !== 'ASC') {
            sortDirection = 'ASC';
        }

        const rows = await alert.getAlertQueries({
            where: {
                isActive: true,
            },
            include: ['createdById', 'updatedById'],
            order: [['createdAt', sortDirection]],
            offset: parseInt(offset!),
            limit: parseInt(limit!),
        });

        const count = await alert.countAlertQueries({
            where: {
                isActive: true,
            },
        });

        return {
            queries: await Promise.all(
                rows.map((collectionAlert) => mapAlertQuery(collectionAlert, alert))
            ),
            count: count,
        };
    }

    async deleteAlert(parameters: DeleteAlertParameters): Promise<void> {
        const { collectionId, alertId } = parameters;

        const collection = await this.collectionModel.findOne({
            where: { uuid: collectionId, isActive: true },
        });

        if (!collection)
            throw new CollectionError(`Unable to retrieve Collection with uuid: ${collectionId}`);

        const alert = await this.model.findOne({
            where: {
                uuid: alertId,
                collectionId: collection.id,
                isActive: true,
            },
        });

        if (!alert) {
            throw new CollectionError(`Unable to retrieve Alert with uuid: ${alertId}`);
        }

        await alert.update({ isActive: false });
        await alert.destroy();
    }

    async deleteAlertQuery(parameters: DeleteAlertQueryParameters): Promise<void> {
        const { queryId } = parameters;

        const query = await this.alertQueryModel.findOne({
            where: { uuid: queryId, isActive: true },
        });

        if (!query) throw new CollectionError(`Unable to retrieve Query with uuid: ${queryId}`);

        await query.update({ isActive: false });
        await query.destroy();
    }

    async updateAlertQuery(parameters: UpdateAlertQuery): Promise<AlertQueryResponse> {
        const {
            queryId,
            contentSources,
            informationTypes,
            query,
            updatedBy,
            alertId,
            collectionId,
        } = parameters;

        const collection = await this.collectionModel.findOne({
            where: {
                uuid: collectionId,
            },
        });

        if (!collection) {
            throw new CollectionError(
                `Error: could not retrieve Collection with uuid: ${collectionId}`
            );
        }

        const alert = await CollectionAlert.findOne({
            where: {
                uuid: alertId,
                isActive: true,
            },
        });

        if (!alert) {
            throw new CollectionError(`Error: could not retrieve alert with uuid: ${alertId}`);
        }

        const updateQuery = await CollectionAlertQuery.findOne({
            where: {
                uuid: queryId,
                isActive: true,
            },
            include: ['createdById', 'updatedById'],
        });

        if (!updateQuery) {
            throw new CollectionError(
                `Error: could not retrieve alert query with uuid: ${queryId}`
            );
        }

        const alertQueryOwner = await User.findOne({
            where: {
                uuid: updatedBy,
            },
        });

        if (!alertQueryOwner) {
            throw new CollectionError(`Error: could not retrieve User with uuid: ${updatedBy}`);
        }

        const queryParameters = {
            contentSources,
            informationTypes,
            query,
            updatedBy: alertQueryOwner.id,
        };
        await updateQuery.update(queryParameters);

        await updateQuery.reload({
            include: ['createdById', 'updatedById'],
        });

        const alertUpdateParams: updateAlertElasticQueryParameters = {alertId: alert.uuid}
        await this.updateAlertElasticQuery(alertUpdateParams)

        return await mapAlertQuery(updateQuery, alert);
    }

    async setAlertQueries(parameters: SetAlertQueriesParameters): Promise<AlertWithQueriesOutput> {
        const { collectionId, updatedBy, alertId, alertQueries } = parameters;

        const alertOwner = await this.collectionModel.findOne({
            where: {
                uuid: collectionId,
                isActive: true,
            },
        });
        if (!alertOwner) {
            throw new CollectionError(
                `Error: Collection with uuid: ${collectionId} does not exist`
            );
        }

        const alertUpdater = await this.userModel.findOne({
            where: {
                uuid: updatedBy,
            },
        });
        if (!alertUpdater) {
            throw new CollectionError(`Error: User with uuid: ${updatedBy} does not exist`);
        }

        const updatedAlert = await CollectionAlert.findOne({
            where: {
                uuid: alertId,
            },
            include: ['collection', 'createdById', 'updatedById'],
        });
        if (!updatedAlert) {
            throw new CollectionError(`Error: Alert with uuid: ${alertId} does not exist`);
        }

        if (updatedAlert.lastStepCompleted === LastStepCompleted.CreateAlert) {
            await updatedAlert.update({ lastStepCompleted: LastStepCompleted.SetAlertQueries });
        }
        await updatedAlert.update({
            updatedBy: alertUpdater.id,
        });

        await updatedAlert.reload({ include: ['collection', 'createdById', 'updatedById'] });

        await this.alertQueryModel.destroy({
            where: {
                alertId: updatedAlert.id,
            },
        });

        await Promise.all(
            alertQueries.map((alertQuery) => {
                const createAlertQueryParameters = {
                    alertId: updatedAlert.uuid,
                    query: alertQuery.query,
                    informationTypes: alertQuery.informationTypes,
                    contentSources: alertQuery.contentSources,
                    createdBy: updatedBy,
                };
                return CollectionAlertsRepository.defaultInstance.createQuery(
                    createAlertQueryParameters
                );
            })
        );

        const createdQueries = await updatedAlert.getAlertQueries({
            include: ['createdById', 'updatedById'],
        });

        const alertUpdateParams: updateAlertElasticQueryParameters = {alertId: alertId}
        await this.updateAlertElasticQuery(alertUpdateParams)

        return {
            alert: await mapAlert(updatedAlert),
            queries: await Promise.all(
                createdQueries.map((query) => mapAlertQuery(query, updatedAlert))
            ),
        };
    }

    async updateAlert(parameters: UpdateAlertParameters): Promise<AlertOutput> {

        const { collectionId, alertId, updatedBy, title } = parameters;

        const collection = await this.collectionModel.findOne({
            where: {
                uuid: collectionId,
                isActive: true
            },
        });

        if (!collection) {
            throw new CollectionError(
                `Unable to retrieve Collection with uuid: ${collectionId}`
            );
        }

        const alert = await this.model.findOne({
            where: {
                uuid: alertId,
                isActive: true
            }
        });
        if (!alert) {
            throw new CollectionError(
                `Unable to retrieve Alert with uuid: ${alertId}`
            );
        }

        const updater = await this.userModel.findOne({
            where: {
                uuid: updatedBy,
                isActive: true
            },
        });
        if (!updater) {
            throw new CollectionError(`Unable to retrieve User with uuid: ${updatedBy}`);
        }

        await alert.update({
            title,
            updatedBy: updater.id
        })

        await alert.reload({ include: ['collection', 'createdById', 'updatedById', 'alertTemplate'] })

        return mapAlert(alert);
    }

    async createAlertDocumentRecord(parameters: AlertDocumentParameters): Promise<Boolean> {
        const { documentId, alertId } = parameters;
        const TbcNumber = 100;
        const recordsByAlert = await CollectionAlertDocument.count({
            where: {
                alertId: alertId
            }
        })
        if (recordsByAlert === TbcNumber) {

            const oldestRecord = await CollectionAlertDocument.findAll({
                limit: 1,
                where: {
                    alertId: alertId
                },
                order: [['createdAt', 'ASC']]
            })

            await oldestRecord[0].destroy()
        }

        await CollectionAlertDocument.create({
            alertId,
            documentId
        });
        return true;
    }

    async updateAlertElasticQuery(alertParam: updateAlertElasticQueryParameters) {
        const alertId = alertParam.alertId
        const alert = await CollectionAlert.findOne({
            where: {
                uuid: alertId,
                isActive: true,
            },
        });
        if (!alert) {
            throw new CollectionError(`Error: could not retrieve alert with uuid: ${alertId}`);
        }

        const getAlertQueriesParams: SearchAlertQueriesParameters = {alertId: alertId, limit: "100", offset: "0"}
        const alertQueries = await this.getAlertQueries(getAlertQueriesParams)
        const alertQueriesString = alertQueries.queries.map(o => o.query).join(" ");

        const createESParams: createESQueryParameters = {query: alertQueriesString}
        const elasticQuery = await this.createElasticQuery(createESParams)

        await alert.update({
            elasticQuery
        })
    }

    async createElasticQuery(queryString: createESQueryParameters) {
        const notTopicsRe = /not topics\((.*?)\)/ig
        const notKeywordsRe = /not keywords\((.*?)\)/ig
        const topicsRe = /topics\((.*?)\)/ig
        const keywordsRe = /keywords\((.*?)\)/ig

        const notTopicMatches = Array.from(queryString.query.matchAll(notTopicsRe), m => m[1]);
        const cleanNotTopics = notTopicMatches.map((query_string) => this.clean_query_strings(query_string));
        const notTopics = ([] as string[]).concat.apply([], cleanNotTopics)

        const notKeywordMatches = Array.from(queryString.query.matchAll(notKeywordsRe), m => m[1]);
        const cleanNotKeywords = notKeywordMatches.map((query_string) => this.clean_query_strings(query_string));
        const notKeywords = ([] as string[]).concat.apply([], cleanNotKeywords)

        const positiveString = queryString.query.replace(notTopicsRe, '').replace(notKeywordsRe, '')

        const topicMatches = Array.from(positiveString.matchAll(topicsRe), m => m[1]);
        const cleanTopics = topicMatches.map((query_string) => this.clean_query_strings(query_string));
        const topics = ([] as string[]).concat.apply([], cleanTopics)

        const keywordMatches = Array.from(positiveString.matchAll(keywordsRe), m => m[1]);
        let cleanKeywords = keywordMatches.map((query_string) => this.clean_query_strings(query_string));
        const keywords = ([] as string[]).concat.apply([], cleanKeywords)

        let query: any = {
            query: {
                bool: {
                    should: [],
                    must_not: []
                }
            }
        }


        notKeywords.forEach(notKeyword => {
            query.query.bool.must_not.push(...[
                {term: {documentTitle: notKeyword}},
                {term: {documentContent: notKeyword}}
            ])
        })
        notTopics.forEach(notTopic => {
            query.query.bool.must_not.push(...[
                {
                    nested: {
                        path: "taxonomyTerms",
                        query: {
                            match: { "taxonomyTerms.termLabel.keyword": notTopic }
                        }
                    }
                }
            ])
        })

        keywords.forEach(keyword => {
            query.query.bool.should.push(...[
                {term: {documentTitle: keyword}},
                {term: {documentContent: keyword}}
            ])
        })
        topics.forEach(topic => {
            query.query.bool.should.push(...[
                {
                    nested: {
                        path: "taxonomyTerms",
                        query: {
                            match: { "taxonomyTerms.termLabel.keyword": topic }
                        }
                    }
                }
            ])
        })

        return JSON.stringify(query)
    }

    clean_query_strings(query_string: string): Array<string> {
        let cleaned_queries: string[] = []
        let queries = query_string.split('OR')
        queries.forEach(query => {
            query = query.trim().replace(/"$/, '').replace(/^"/, '')
            cleaned_queries.push(query)
        })

        return cleaned_queries
    }

}
