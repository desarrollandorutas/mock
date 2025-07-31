import { Module } from '@nestjs/common';
import { ClientepspController } from './clientepsp.controller';

@Module({
  controllers: [ClientepspController]
})
export class ClientepspModule {}
