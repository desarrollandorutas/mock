import { Controller, Get, HttpCode, Param } from '@nestjs/common';

@Controller('clientes-psp')
export class ClientepspController {

    @Get("/empty/:id")
    @HttpCode(200)
    getClientesPsp(){
        return;
    }

    @Get(":id")
    @HttpCode(200)
    getClientesPspRut(@Param("id") id){
        return {
            id
        };
    }
}
