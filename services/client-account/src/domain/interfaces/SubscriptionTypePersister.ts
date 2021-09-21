import { SubscriptionTypeResponse } from '.';

export interface SubscriptionTypePersister {
    getSubscriptionTypes(): Promise<Array<SubscriptionTypeResponse>>;
}
