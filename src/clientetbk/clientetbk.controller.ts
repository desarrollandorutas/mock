import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('clientes-tbk')
export class ClientetbkController {
    @Get(":id")
    @HttpCode(200)
    getClientesPsp(){
        return;
    }
}
