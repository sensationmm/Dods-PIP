import { CollectionAlertError, CollectionAlertRecipientError, CollectionError, UserProfileError } from "@dodsgroup/dods-domain";
import { AlertRecipientInput, Collection, CollectionAlert, CollectionAlertRecipient, User } from "@dodsgroup/dods-model";
import { CollectionAlertRecipientPersister, SetAlertRecipientsInput, SetAlertRecipientsOutput, DeleteAlertRecipientInput } from "./domain";

export * from './domain';

export class CollectionAlertRecipientRepository implements CollectionAlertRecipientPersister {
    static defaultInstance: CollectionAlertRecipientPersister = new CollectionAlertRecipientRepository();

    async setAlertRecipients(parameters: SetAlertRecipientsInput): Promise<SetAlertRecipientsOutput> {

        const { recipients, updatedBy, collectionId, alertId } = parameters;

        const collection = await Collection.findOne({ where: { uuid: collectionId } });

        if (!collection) {
            throw new CollectionError('Collection not found');
        }

        const collectionAlert = await CollectionAlert.findOne({
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

        const updatedByUser = await User.findOne({ where: { uuid: updatedBy } });

        if (!updatedByUser) {
            throw new UserProfileError(`UserProfile not found for updatedBy: ${updatedBy}`);
        }

        const users: Array<User> = [];

        for (const recipient of recipients) {
            const { userId } = recipient;

            const recipientUser = await User.findOne({ where: { uuid: userId } });

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

        const collectionAlert = await CollectionAlert.findOne({
            where: {
                uuid: alertId
            },
        });

        if (!collectionAlert) {
            throw new CollectionAlertError('Collection Alert not found');
        }

        const alertRecipientUser = await User.findOne({ where: { uuid: userId } });

        if (!alertRecipientUser) {
            throw new UserProfileError('User not found');
        }

        const alertRecipient = await CollectionAlertRecipient.findOne({ where: { alertId: collectionAlert.id, userId: alertRecipientUser.id } });

        if (!alertRecipient) {
            throw new CollectionAlertRecipientError('Recipient not found');
        }

        await alertRecipient.destroy();

        return true;
    }
}