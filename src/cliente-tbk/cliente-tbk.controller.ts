import { Controller, Get, Post } from '@nestjs/common';
import { ClienteTbkService } from './cliente-tbk.service';

@Controller('cliente-tbk')
export class ClienteTbkController {
  constructor(private readonly clienteTbkService: ClienteTbkService) { }

  @Get()
  getModeloCobrador() {
    return this.clienteTbkService.getModeloCobrador();
  }

  @Post('/transaccion')
  postTransaccion() {
    return this.clienteTbkService.postTransaccion();
  }
}
