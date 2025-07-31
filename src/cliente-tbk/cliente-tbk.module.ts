import { Module } from '@nestjs/common';
import { ClienteTbkService } from './cliente-tbk.service';
import { ClienteTbkController } from './cliente-tbk.controller';

@Module({
  controllers: [ClienteTbkController],
  providers: [ClienteTbkService],
})
export class ClienteTbkModule {}
