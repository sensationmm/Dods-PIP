import { AlertOutput, AlertQueryResponse } from "./../CollectionAlertsRepository/domain";
import { Collection, CollectionAlert, CollectionAlertQuery, CollectionAlertRecipient, Role, User } from "@dodsgroup/dods-model";

import { AlertRecipientsOutput, CollectionOutput } from "..";

export interface userBy {
    uuid: string;
    name: string;
    emailAddress: string;
    isDodsUser: boolean;
}

export function cloneObject<T, E>(
    target: T,
    replaceProperties?: Partial<E>,
    unwantedProperties?: string[]
): T {
    const copiedObject = Object.assign({}, target, replaceProperties);
    if (unwantedProperties)
        unwantedProperties.forEach((key) => Reflect.deleteProperty(copiedObject, key));
    return copiedObject;
}

export function cloneArray<T, E>(target: T[],
    replaceProperties?: E,
    unwantedProperties?: string[]): T[] {
    const copiedArray = target.slice().map(item => { return { ...item, ...replaceProperties } });
    if (unwantedProperties)
        copiedArray.map(item => unwantedProperties.forEach((key) => Reflect.deleteProperty(item, key)));
    return copiedArray;
}

export const mapAlert = async (model: CollectionAlert): Promise<AlertOutput> => {
    const { id, uuid, title, description, schedule, timezone, createdAt, updatedAt, collection, createdById, updatedById, alertTemplate, hasKeywordsHighlight, isScheduled, isPublished, lastStepCompleted, lastExecutedAt } = model;

    return {
        id,
        uuid,
        title,
        description,
        collection: collection ? {
            uuid: collection.uuid, name: collection.name,
            clientAccount: collection.clientAccount ? {
                uuid: collection.clientAccount.uuid, name: collection.clientAccount.name,
            } : undefined
        } : undefined,
        template: alertTemplate ? { id: alertTemplate.id, name: alertTemplate.name } : undefined,
        schedule,
        timezone,
        createdAt,
        createdBy: getUserInfo(createdById, await createdById?.getRole()),
        updatedAt,
        updatedBy: getUserInfo(updatedById, await updatedById?.getRole()),
        hasKeywordsHighlight: hasKeywordsHighlight ? true : false,
        isScheduled: isScheduled ? true : false,
        lastStepCompleted: lastStepCompleted,
        isPublished: isPublished ? true : false,
        lastExecutedAt
    }
}

export const mapAlertQuery = async (model: CollectionAlertQuery, alertModel: CollectionAlert): Promise<AlertQueryResponse> => {
    const { uuid, name, informationTypes, contentSources, query, createdAt, updatedAt, createdById, updatedById } = model;
    return {
        uuid,
        name,
        informationTypes,
        alert: {
            uuid: alertModel.uuid,
            title: alertModel.title
        },
        contentSources,
        query,
        createdBy: getUserInfo(createdById, await createdById?.getRole()),
        updatedBy: getUserInfo(updatedById, await updatedById?.getRole()),
        createdAt,
        updatedAt,
    };
}

export const mapCollection = async (model: Collection): Promise<CollectionOutput> => {
    const { uuid, name, clientAccount, createdAt, createdBy, updatedAt, updatedBy, alerts, savedQueries, documents } = model;

    return {
        uuid,
        name,
        clientAccount: { uuid: clientAccount.uuid, name: clientAccount.name },
        createdAt: createdAt,
        createdBy: getUserInfo(createdBy, await createdBy?.getRole()),
        updatedAt: updatedAt,
        updatedBy: getUserInfo(updatedBy, await updatedBy?.getRole()),
        alertsCount: alerts?.length,
        queriesCount: savedQueries?.length,
        documentsCount: documents?.length,
    }
}

export const mapRecipient = async (model: CollectionAlertRecipient): Promise<AlertRecipientsOutput> => {
    const { user, isActive, alert, createdAt, updatedAt, createdById, updatedById } = model;

    return {
        uuid: user.uuid,
        name: user.fullName,
        emailAddress: user.primaryEmail,
        clientAccount: alert?.collection?.clientAccount ? {
            uuid: alert.collection.clientAccount.uuid, name: alert.collection.clientAccount.name,
        } : undefined,
        createdAt,
        createdBy: getUserInfo(createdById, await createdById?.getRole()),
        updatedAt,
        updatedBy: getUserInfo(updatedById, await updatedById?.getRole()),
        isActive,
        isDodsUser: checkIsDodsUser(await user?.getRole()),
    }
}

const checkIsDodsUser = (role: Role): boolean => role ? Boolean(role.dodsRole) : false

const getUserInfo = (user: User, role: Role): userBy | undefined => {
    return user ?
        {
            uuid: user.uuid,
            name: user.fullName,
            emailAddress: user.primaryEmail,
            isDodsUser: checkIsDodsUser(role)
        } : undefined
}
