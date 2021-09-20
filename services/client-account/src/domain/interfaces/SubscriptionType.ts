export interface SubscriptionType {
    name: string;
    // location?: number | null;
    // content_type?: number | null;
}

export interface SubscriptionTypeResponse extends SubscriptionType {
    id: string;
}

export interface SubscriptionTypeParameters extends SubscriptionType {}
