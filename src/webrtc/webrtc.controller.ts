import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WebrtcService } from './webrtc.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('webrtc')
export class WebrtcController {
  constructor(private readonly webrtcService: WebrtcService) { }

  @Post('generatetoken')
  @UseGuards(AuthGuard('jwt'))

  generateToken(@Body() createRoomDto: CreateRoomDto, @GetUser('id') id: string) {
    return this.webrtcService.generateToken(createRoomDto, id);
  }

  @Get('channelexist/:name')
  @UseGuards(AuthGuard('jwt'))
  channelExist(@Param('name') name: string) {
    return this.webrtcService.channelExist(name);
  }


}
