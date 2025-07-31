import { IsEnum, IsOptional } from "class-validator";
import { SubscriptionList, SubscriptionType } from "../enum/suscription-type.enum";

export class PaymentRequest {

    @IsOptional()
    email: string;

    @IsOptional()
    name: string;

    @IsOptional()
    usedId: string;

    @IsEnum(SubscriptionList, {
        message: `la suscripcion debe ser uno de los siguientes valores: ${SubscriptionList}`
    })
    subscription: SubscriptionType;
}


