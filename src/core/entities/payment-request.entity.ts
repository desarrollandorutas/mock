export class LeemoonqueezyPaymentRequest {
    data: PaymentRequestData;

    constructor() {
        this.data = new PaymentRequestData();
    }
}

export class PaymentRequestData {
    type: string;
    attributes: Attributes;
    relationships: Relationships;

    constructor() {
        this.attributes = new Attributes();
        this.relationships = new Relationships();
    }
}

export class Attributes {
    checkout_data: CheckoutData;
    expires_at: Date;

    constructor() {
        this.checkout_data = new CheckoutData();
    }
}

export class CheckoutData {
    email: string;
    name: string;
    custom: Custom;

    constructor() {
        this.custom = new Custom();
    }
}

export class Custom {
    user_id: string;
    subscription_type: string;
}

export class Relationships {
    store: Store;
    variant: Store;

    constructor() {
        this.store = new Store();
        this.variant = new Store();
    }
}

export class Store {
    data: StoreData;

    constructor() {
        this.data = new StoreData();
    }
}

export class StoreData {
    type: string;
    id: string;
}