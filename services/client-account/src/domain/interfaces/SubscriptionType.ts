export interface SubscriptionType {
    name: string;
    location?: number | null;
    contentType?: number | null;
}

export interface SubscriptionTypeResponse extends SubscriptionType {
    id: string;
}

export interface SubscriptionTypeParameters extends SubscriptionType {}
