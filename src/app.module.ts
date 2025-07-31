import { Module } from '@nestjs/common';
import { ClientetbkModule } from './clientetbk/clientetbk.module';
import { ClientepspModule } from './clientepsp/clientepsp.module';

@Module({
  imports: [ClientetbkModule, ClientepspModule],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}
