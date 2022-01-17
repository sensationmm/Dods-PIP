import { Collection, CollectionAlert } from "@dodsgroup/dods-model";
import { CollectionOutput } from "..";
import { AlertOutput } from "./../CollectionAlertsRepository/domain";

export function cloneObject<T, E>(target: T,
    replaceProperties?: E,
    unwantedProperties?: string[]): T {
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

export const mapAlert = (model: CollectionAlert): AlertOutput => {
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

export const mapCollection = async (model: Collection): Promise<CollectionOutput> => {
    const { uuid, name, clientAccount, createdAt, createdBy, updatedAt, alerts, savedQueries, documents } = model;
    const role = await createdBy.getRole();

    return {
        uuid,
        name,
        clientAccount: { uuid: clientAccount.uuid, name: clientAccount.name },
        createdAt: createdAt,
        createdBy: createdBy ? { uuid: createdBy.uuid, name: createdBy.fullName, emailAddress: createdBy.primaryEmail, isDodsUser: Boolean(role.dodsRole) } : {},
        updatedAt: updatedAt,
        alertsCount: alerts?.length,
        queriesCount: savedQueries?.length,
        documentsCount: documents?.length,
    }
}
