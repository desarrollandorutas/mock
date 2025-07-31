import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PaymentRequest } from './dto/payment-request.dto';
import * as UsesCase from '../core/use-cases';
import { lemonqueezyFetcher } from 'src/config/adapters/lemonqueezy.adapter';
import { LemonsqueezyWebhookResquest } from 'src/inftrastructure/interfaces/lemonsqueezy-webhook.response';
import { PrismaClient } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class PaymentsService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger(PaymentsService.name);

    onModuleInit() {
        this.$connect();
        this.logger.log('Connected to the database');
    }

    constructor(
        private readonly authService: AuthService
    ) {
        super()
    }

    async create(paymentRequest: PaymentRequest) {
        return await UsesCase.paymentRequest(lemonqueezyFetcher, paymentRequest);
    }

    async registerPayment(lemon: LemonsqueezyWebhookResquest) {

        try {
            const {
                attributes: {
                    first_order_item: { order_id },
                    urls: { receipt: receipt_url },
                    ...restAttributes
                }
            } = lemon.data;

            const order = await this.lemonsqueezy.create({
                data: {
                    order_id,
                    receipt_url,
                    user_id: lemon.meta.custom_data.user_id,
                    ...restAttributes
                }
            });

            const { user_id, subscription_type } = lemon.meta.custom_data;

            if (order.status === 'paid') {
                await this.authService.premiumUser(user_id, subscription_type);
            }

            this.logger.log(`order ${order.order_id} create`)
        } catch (error) {
            this.logger.log(`order ${lemon.data.attributes.first_order_item.order_id} cant create`)
        }
    }

    async registerGooglePayment(id: string, subscriptionType: string) {
        return await this.authService.premiumUser(id, subscriptionType)
    }

    async getOrder(id: number) {
        const order = await this.lemonsqueezy.findFirst({
            where: {
                order_id: id
            }
        });

        const user = await this.authService.findUserById(order.user_id);

        return {
            order,
            user
        }
    }

}
