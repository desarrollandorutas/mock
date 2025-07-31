import { Module } from '@nestjs/common';
import { ClientetbkController } from './clientetbk.controller';

@Module({
  controllers: [ClientetbkController]
})
export class ClientetbkModule {}
