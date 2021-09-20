import { SubscriptionTypeResponse } from '.';

export interface SubscriptionTypePersister {
    getSubscriptionTypes(): Promise<SubscriptionTypeResponse>;
}
