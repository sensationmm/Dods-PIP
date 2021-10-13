export interface SubscriptionType {
    name: string;
    location?: number | null;
    contentType?: number | null;
}

export interface SubscriptionTypeResponse extends SubscriptionType {
    uuid: string;
}

export interface SubscriptionTypeParameters extends SubscriptionType {}
