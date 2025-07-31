export interface LemonsqueezyPaymentResponse {
    jsonapi: Jsonapi;
    links: DataLinks;
    data: Data;
}

export interface Data {
    type: string;
    id: string;
    attributes: Attributes;
    relationships: Relationships;
    links: DataLinks;
}

export interface Attributes {
    store_id: number;
    variant_id: number;
    custom_price: null;
    product_options: ProductOptions;
    checkout_options: CheckoutOptions;
    checkout_data: CheckoutData;
    preview: boolean;
    expires_at: Date;
    created_at: Date;
    updated_at: Date;
    test_mode: boolean;
    url: string;
}

export interface CheckoutData {
    email: string;
    name: string;
    billing_address: any[];
    tax_number: string;
    discount_code: string;
    custom: Custom;
    variant_quantities: any[];
}

export interface Custom {
    user_id: string;
}

export interface CheckoutOptions {
    embed: boolean;
    media: boolean;
    logo: boolean;
    desc: boolean;
    discount: boolean;
    skip_trial: boolean;
    quantity: number;
    subscription_preview: boolean;
}

export interface ProductOptions {
    name: string;
    description: string;
    media: any[];
    redirect_url: string;
    receipt_button_text: string;
    receipt_link_url: string;
    receipt_thank_you_note: string;
    enabled_variants: any[];
    confirmation_title: string;
    confirmation_message: string;
    confirmation_button_text: string;
}

export interface DataLinks {
    self: string;
}

export interface Relationships {
    store: Store;
    variant: Store;
}

export interface Store {
    links: StoreLinks;
}

export interface StoreLinks {
    related: string;
    self: string;
}

export interface Jsonapi {
    version: string;
}
