import { SearchCollectionAlertsParameters, getAlertsByCollectionResponse } from '../interfaces'

export interface CollectionAlertsPersister {

    getCollectionAlerts(parameters: SearchCollectionAlertsParameters): Promise<getAlertsByCollectionResponse>;
}
