import { HttpAdapter } from "src/config/adapters/http/http.adapter";
import { envs } from "src/config/env";
import { LeemoonqueezyPaymentRequest } from "src/core/entities/payment-request.entity";
import { LemonsqueezyPaymentResponse } from "src/inftrastructure/interfaces/lemonsqueezy-payment.responses";
import { PaymentRequest } from "src/payments/dto/payment-request.dto";
import { SubscriptionType } from "src/payments/enum/suscription-type.enum";

export const paymentRequest = async (fetcher: HttpAdapter, paymentRequest: PaymentRequest) => {

    try {
        let payment = new LeemoonqueezyPaymentRequest();
        const now = new Date();
        const paymentExpire = new Date();
        paymentExpire.setDate(now.getDate() + 1);
        let variantId;

        switch (paymentRequest.subscription) {
            case SubscriptionType.ONE_MONTH:
                variantId = envs.lemonqueezyOneMonth;
                break;
            case SubscriptionType.SIX_MONTH:
                variantId = envs.lemonqueezySixMonth;
                break;
            case SubscriptionType.ONE_YEAR:
                variantId = envs.lemonqueezyOneYear;
                break;
            case SubscriptionType.SUBSCRIPTION:
                variantId = envs.lemonqueezySubscription;
                break;
            default:
                break;
        }

        payment.data.type = 'checkouts';
        payment.data.attributes.checkout_data.email = paymentRequest.email;
        payment.data.attributes.checkout_data.name = paymentRequest.name;
        payment.data.attributes.checkout_data.custom.user_id = paymentRequest.usedId;
        payment.data.attributes.checkout_data.custom.subscription_type = paymentRequest.subscription;
        payment.data.attributes.expires_at = paymentExpire;
        payment.data.relationships.store.data.type = "stores";
        payment.data.relationships.store.data.id = envs.lemonqueezyStore;
        payment.data.relationships.variant.data.type = "variants";
        payment.data.relationships.variant.data.id = variantId;


        const response = await fetcher.post<LemonsqueezyPaymentResponse>('/checkouts', payment, {
            headers: {
                'Authorization': `Bearer ${envs.lemonqueezyApikey}`,
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
            }
        });

        return {
            successful: true,
            paymentUrl: response.data.attributes.url
        }
    } catch (error) {
        console.log('error', error);
        return {
            successful: false,
            paymentUrl: null
        }

    }
}