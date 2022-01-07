import { ClientAccount, Collection, CollectionAlert, User } from '@dodsgroup/dods-model';
import {
    CollectionPersister,
    CollectionResponse,
    CreateCollectionPersisterParameters,
    UpdateCollectionParameters,
    setAlertScheduleParameters
} from '../domain';
import { HttpError, HttpStatusCode } from '@dodsgroup/dods-lambda';

export class CollectionRepository implements CollectionPersister {
    static defaultInstance: CollectionRepository = new CollectionRepository(
        Collection,
        ClientAccount,
        User,
    );

    constructor(
        private model: typeof Collection,
        private clientAccountModel: typeof ClientAccount,
        private userModel: typeof User,
    ) { }

    async createCollection(parameters: CreateCollectionPersisterParameters): Promise<Collection> {
        const { name, isActive, clientAccountId, createdById } = parameters;
        const collectionOwner = await this.clientAccountModel.findOne({
            where: {
                uuid: clientAccountId,
            },
        });
        if (!collectionOwner) {
            throw new HttpError(
                `Error: Client Account with uuid: ${clientAccountId} does not exist`,
                HttpStatusCode.BAD_REQUEST
            );
        }
        const collectionCreator = await this.userModel.findOne({
            where: {
                uuid: createdById,
            },
        });
        if (!collectionCreator) {
            throw new HttpError(
                `Error: User with uuid: ${createdById} does not exist`,
                HttpStatusCode.BAD_REQUEST
            );
        }
        const newCollection = await this.model.create({
            name,
            isActive,
            clientAccountId: collectionOwner.id,
            createdById: collectionCreator.id,
        });

        return await newCollection.reload({ include: ['clientAccount', 'createdBy'] });
    }

    mapCollection(model: Collection): CollectionResponse {
        const { uuid, name, isActive, clientAccount, createdBy, createdAt, updatedAt } = model;
        return {
            uuid,
            name,
            isActive,
            clientAccount: clientAccount
                ? {
                    uuid: clientAccount.uuid,
                    name: clientAccount.name,
                }
                : undefined,
            createdBy: createdBy
                ? {
                    uuid: createdBy.uuid,
                    name: createdBy.fullName,
                }
                : undefined,
            createdAt,
            updatedAt,
        };
    }

    async updateCollection(parameters: UpdateCollectionParameters): Promise<Collection> {

        const { name, collectionId } = parameters
        const collection = await this.model.findOne({
            where: {
                uuid: collectionId,
            },
            include: ['clientAccount', 'createdBy'],
        });


        if (!collection) {

            throw new Error(
                `Error: could not retrieve Collection with uuid: ${collectionId}`,
            );
        }

        await collection.update({
            name: name,
        });

        await collection.reload({
            include: ['clientAccount', 'createdBy'],
        });

        return collection;
    }

    async setAlertSchedule(parameters: setAlertScheduleParameters): Promise<CollectionAlert> {

        const { isScheduled, schedule, alertId, hasKeywordsHighlight, timezone, updatedBy, alertTemplateId } = parameters

        console.log(alertId);

        if (isScheduled && !schedule) {
            throw new Error(
                `Error: must provide a schedule `,
            );
        }

        const alert = await CollectionAlert.findOne({
            where: {
                uuid: alertId,
            },
            include: ['alertTemplate', 'collection']
        });

        if (!alert) {
            throw new Error(
                `Error: Could not retrieve Collection with uuid: ${alertId}`,
            );
        }

        const alertOwner = await User.findOne({
            where: {
                uuid: updatedBy,
            },
        });


        if (!alertOwner) {
            throw new Error(
                `Error: User with uuid: ${updatedBy} does not exist`,
            );
        }

        await alert.update({
            isScheduled: isScheduled,
            hasKeywordsHighlight: hasKeywordsHighlight,
            timezone: timezone,
            schedule: schedule,
            updatedBy: alertOwner.id,
            lastStepCompleted: 3,
            templateId: alertTemplateId
        });

        await alert.reload({
            include: ['alertTemplate', 'collection'],
        });

        return alert;
    }

    mapAlert(model: CollectionAlert): Object {
        const { id, uuid, title, description, schedule, timezone, createdAt, updatedAt, collection, createdById, updatedById, alertTemplate, hasKeywordsHighlight, isScheduled } = model;

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
            hasKeywordsHighlight: hasKeywordsHighlight,
            isSchedule: isScheduled
        }


        return collectionAlert
    }
}
