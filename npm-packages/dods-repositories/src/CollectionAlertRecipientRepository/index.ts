import { CollectionAlertError, CollectionAlertRecipientError, CollectionError, UserProfileError } from "@dodsgroup/dods-domain";
import { AlertRecipientInput, ClientAccount, Collection, CollectionAlert, CollectionAlertRecipient, Op, Sequelize, User, WhereOptions } from "@dodsgroup/dods-model";
import { mapRecipient } from "..";
import { CollectionAlertRecipientPersister, SetAlertRecipientsInput, SetAlertRecipientsOutput, DeleteAlertRecipientInput, SearchAlertRecipientsInput, SearchAlertRecipientsOutput, UpdateRecipientParameters, AlertRecipientsOutput } from "./domain";

export * from './domain';

export class CollectionAlertRecipientRepository implements CollectionAlertRecipientPersister {
    static defaultInstance: CollectionAlertRecipientPersister = new CollectionAlertRecipientRepository(
        CollectionAlertRecipient,
        CollectionAlert,
        Collection,
        User);

    constructor(
        private model: typeof CollectionAlertRecipient,
        private alertModel: typeof CollectionAlert,
        private collectionModel: typeof Collection,
        private userModel: typeof User
    ) { }


    async list(parameters: SearchAlertRecipientsInput): Promise<SearchAlertRecipientsOutput> {

        const { searchTerm, limit, offset, sortBy, sortDirection, collectionId, alertId, } = parameters;

        const collectionCount = await Collection.count({ where: { uuid: collectionId } });

        if (collectionCount === 0) {
            throw new CollectionError('Collection not found');
        }

        const collectionAlert = await this.alertModel.findOne({
            where: {
                uuid: alertId
            },
        });

        if (!collectionAlert) {
            throw new CollectionAlertError('Collection Alert not found');
        }

        let whereClause: WhereOptions = {
            alertId: collectionAlert.id,
        };

        const searchString = searchTerm;

        // searchTerm: Will search on recipients of the alert based containing the searchTerm in their last name or first name or email address or client account name 
        // (first client account of their relationship, prioritizing client account where is_dods_account = true). Optional. If not provided will list all of the alert recipients. 

        //* Search by document name case insensitive coincidences
        if (searchString) {
            const lowerCaseName = searchString.trim().toLocaleLowerCase();

            //* If searchTerm was given then search for coincidences in any part of the name
            //* If not search only in the beginning
            whereClause = {
                ...whereClause,
                [Op.or]: [
                    Sequelize.where(
                        Sequelize.fn('LOWER', Sequelize.col('user.first_name')),
                        'LIKE',
                        `${searchTerm ? '%' : ''}${lowerCaseName}%`
                    ),
                    Sequelize.where(
                        Sequelize.fn('LOWER', Sequelize.col('user.last_name')),
                        'LIKE',
                        `${searchTerm ? '%' : ''}${lowerCaseName}%`
                    ),
                    Sequelize.where(
                        Sequelize.fn('LOWER', Sequelize.col('user.primary_email')),
                        'LIKE',
                        `${searchTerm ? '%' : ''}${lowerCaseName}%`
                    ),
                    Sequelize.where(
                        Sequelize.fn('LOWER', Sequelize.literal('`alert->collection->clientAccount`.name')),
                        'LIKE',
                        `${searchTerm ? '%' : ''}${lowerCaseName}%`,
                    ),
                ],
            };
        }

        let orderBy: any = [sortBy, sortDirection];

        if (sortBy === 'firstName') {
            orderBy = [CollectionAlertRecipient.associations.user, 'firstName', sortDirection];
        } else if (sortBy === 'clientAccountName') {
            orderBy = ['alert', 'collection', 'clientAccount', 'name', sortDirection];
        } else if (sortBy === 'isActive') {
            orderBy = [CollectionAlertRecipient.associations.user, 'isActive', sortDirection];
        }

        const totalRecords = await CollectionAlertRecipient.count();

        const { count: filteredRecords, rows } = await CollectionAlertRecipient.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'updatedById'
                },
                {
                    model: User,
                    as: 'createdById'
                },
                {
                    model: User,
                    as: 'user',
                    required: true
                },
                {
                    model: CollectionAlert,
                    as: 'alert',
                    required: true,
                    include: [
                        {
                            model: Collection,
                            as: 'collection',
                            required: true,
                            include: [
                                {
                                    model: ClientAccount,
                                    as: 'clientAccount',
                                    required: true,
                                }
                            ]
                        }
                    ]
                },
            ],
            order: [orderBy],
            offset,
            limit,
        });

        const data = await Promise.all(rows.map(async (row) => await mapRecipient(row)));


        return {
            limit,
            offset,
            totalRecords,
            filteredRecords,
            data,
        };
    }

    async setAlertRecipients(parameters: SetAlertRecipientsInput): Promise<SetAlertRecipientsOutput> {

        const { recipients, updatedBy, collectionId, alertId } = parameters;

        const collection = await this.collectionModel.findOne({ where: { uuid: collectionId } });

        if (!collection) {
            throw new CollectionError('Collection not found');
        }

        const collectionAlert = await this.alertModel.findOne({
            where: {
                uuid: alertId
            },
            include: [
                CollectionAlert.associations.alertTemplate,
                CollectionAlert.associations.createdById,
                CollectionAlert.associations.updatedById,
            ]
        });

        if (!collectionAlert) {
            throw new CollectionAlertError('Collection Alert not found');
        }

        const updatedByUser = await this.userModel.findOne({ where: { uuid: updatedBy } });

        if (!updatedByUser) {
            throw new UserProfileError(`UserProfile not found for updatedBy: ${updatedBy}`);
        }

        const users: Array<User> = [];

        for (const recipient of recipients) {
            const { userId } = recipient;

            const recipientUser = await this.userModel.findOne({ where: { uuid: userId } });

            if (!recipientUser) {
                throw new UserProfileError(`UserProfile not found for recipientUser: ${userId}`);
            }

            users.push(recipientUser);
        }

        const alertRecipients: Array<AlertRecipientInput> = users.map(user => ({ alertId: collectionAlert.id, userId: user.id, createdBy: updatedByUser.id }));

        await CollectionAlertRecipient.bulkCreate(alertRecipients, { ignoreDuplicates: true });

        await collectionAlert.update({ lastStepCompleted: 2 }, { where: { lastStepCompleted: 1 } });

        await collectionAlert.update({ updatedBy: updatedByUser.id });

        const collectionAlertRecipient = await CollectionAlertRecipient.findAll({
            where: { alertId: collectionAlert.id },
            include: [CollectionAlertRecipient.associations.user],
        });

        const collectionAlertAllRecipients = collectionAlertRecipient.map(({ user: { uuid, fullName, primaryEmail } }) => ({ userId: uuid, name: fullName, emailAddress: primaryEmail }));

        return {
            uuid: collectionAlert.uuid,
            title: collectionAlert.title,
            description: collectionAlert.description || '',
            collection: {
                uuid: collection.uuid,
                name: collection.name,
            },
            template: {
                id: collectionAlert.templateId || 0,
                name: collectionAlert.alertTemplate?.name || '',
            },
            schedule: collectionAlert.schedule || '',
            timezone: collectionAlert.timezone || '',
            searchQueriesCount: await collectionAlert.countAlertQueries() || 0,
            recipientsCount: alertRecipients.length,
            lastStepCompleted: 2,
            isPublished: false,
            createdBy: {
                uuid: collectionAlert.createdById?.uuid || '',
                name: collectionAlert.createdById?.fullName || '',
                emailAddress: collectionAlert.createdById?.primaryEmail || '',
            },
            createdAt: collectionAlert.createdAt,
            updatedBy: {
                uuid: collectionAlert.updatedById?.uuid || '',
                name: collectionAlert.updatedById?.fullName || '',
                emailAddress: collectionAlert.updatedById?.primaryEmail || '',
            },
            updatedAt: collectionAlert.updatedAt,
            recipients: collectionAlertAllRecipients//users.map(user => ({ userId: user.uuid, name: user.fullName, emailAddress: user.primaryEmail }))
        };
    }

    async delete(parameters: DeleteAlertRecipientInput): Promise<boolean> {
        const { userId, alertId } = parameters;

        const collectionAlert = await this.alertModel.findOne({
            where: {
                uuid: alertId
            },
        });

        if (!collectionAlert) {
            throw new CollectionAlertError('Collection Alert not found');
        }

        const alertRecipientUser = await this.userModel.findOne({ where: { uuid: userId } });

        if (!alertRecipientUser) {
            throw new UserProfileError('User not found');
        }

        const alertRecipient = await this.model.findOne({ where: { alertId: collectionAlert.id, userId: alertRecipientUser.id } });

        if (!alertRecipient) {
            throw new CollectionAlertRecipientError('Recipient not found');
        }

        await alertRecipient.destroy();

        return true;
    }

    async update(parameters: UpdateRecipientParameters): Promise<AlertRecipientsOutput> {
        const { userId, collectionId, alertId, isActive, updatedBy } = parameters;

        const user = await this.userModel.findOne({
            where: {
                uuid: userId,
                isActive: true
            },
        });

        if (!user) {
            throw new CollectionAlertRecipientError(`Unable to retrieve User with uuid: ${userId}`);
        }

        const updater = await this.userModel.findOne({
            where: {
                uuid: updatedBy,
                isActive: true
            },
        });

        if (!updater) {
            throw new CollectionAlertRecipientError(`Unable to retrieve User with uuid: ${updatedBy}`);
        }

        const collection = await this.collectionModel.findOne({
            where: {
                uuid: collectionId,
                isActive: true
            },
        });

        if (!collection) {
            throw new CollectionAlertRecipientError(`Unable to retrieve Collection with uuid: ${collectionId}`);
        }

        const alert = await this.alertModel.findOne({
            where: {
                uuid: alertId,
                collectionId: collection.id,
                isActive: true
            },
        });

        if (!alert) {
            throw new CollectionAlertRecipientError(`Unable to retrieve Alert with uuid: ${alertId} or doesn't belong to collection with uuid: ${collectionId}`);
        }

        const recipient = await this.model.findOne({
            where: {
                userId: user.id,
                alertId: alert.id
            },
        });

        if (!recipient) {
            throw new CollectionAlertRecipientError(`Unable to retrieve Recipient who belongs to alert with uuid: ${alertId}`);
        }

        const updatedRecipient = await recipient.update({
            updatedBy: updater.id,
            isActive
        });
        await updatedRecipient.reload({ include: ['user', 'updatedById', 'createdById'] })
        return await mapRecipient(updatedRecipient);
    }
}