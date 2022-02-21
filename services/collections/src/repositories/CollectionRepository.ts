import { ClientAccount, Collection, User } from '@dodsgroup/dods-model';
import {
    CollectionPersister,
    CollectionResponse,
    CreateCollectionPersisterParameters,
    ProcessImmediateAlertParametersURL
} from '../domain';
import { HttpError, HttpStatusCode } from '@dodsgroup/dods-lambda';

import axios from 'axios';

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

    async processImmediateAlert(parameters: ProcessImmediateAlertParametersURL): Promise<object> {
        const { alertId, docId, baseURL } = parameters;
        const response = await axios.post(`${baseURL}/collections/processImmediateAlert`, { alertId, docId });

        return { response };
    }
}
