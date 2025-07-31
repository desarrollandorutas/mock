import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentRequest } from './dto/payment-request.dto';
import { LemonsqueezyWebhookResquest } from 'src/inftrastructure/interfaces/lemonsqueezy-webhook.response';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { DynamicStringValidationPipe } from 'src/auth/dto/dynamic-string.dto';
import { IsString } from 'class-validator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('lemonsqueezy')
  lemonsSqueezyWebhook(@Body() lemonsqueezyWebhookResquest: LemonsqueezyWebhookResquest) {
    return this.paymentsService.registerPayment(lemonsqueezyWebhookResquest);
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  create(@Body() paymentRequest: PaymentRequest, @GetUser() user: User) {
    paymentRequest.usedId = user.id;
    paymentRequest.name = user.name;
    paymentRequest.email = user.email;
    return this.paymentsService.create(paymentRequest);
  }

  @Post('registerpayment')
  @UseGuards(AuthGuard('jwt'))
  registerPayment(@Body(new DynamicStringValidationPipe('subscriptionType', [IsString()])) body: { subscriptionType: string }, @GetUser('id') id: string) {
    console.log('body', body);
    console.log('body.subscriptionType', body.subscriptionType);
    return this.paymentsService.registerGooglePayment(id, body.subscriptionType);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getOrder(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.getOrder(id);
  }
}
