import { Controller, Post, Body, UseGuards, UsePipes, Get, Patch, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto, UpdateUserDto, VerifyPasswordOTP } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { DynamicStringValidationPipe } from './dto/dynamic-string.dto';
import { IsEmail, IsString } from 'class-validator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  registerUser(@Body() registeruserDto: RegisterUserDto) {
    return this.authService.registerUser(registeruserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Post('reactiveuser')
  @UsePipes(new DynamicStringValidationPipe('email', [IsString(), IsEmail()]))
  reactiveUser(@Body() body: { email: string }) {
    return this.authService.reactiveUser(body.email);
  }

  @Post('recoverypassword')
  @UsePipes(new DynamicStringValidationPipe('email', [IsString(), IsEmail()]))
  recoveryPassword(@Body() body: { email: string }) {
    return this.authService.recoveryPassword(body.email);
  }

  @Post('verifypasswordotp')
  verifyPasswordOtp(@Body() verifyPasswordOTP: VerifyPasswordOTP) {
    return this.authService.verifyPasswordOtp(verifyPasswordOTP);
  }

  @Post('changepassword')
  @UseGuards(AuthGuard('jwt'))
  changePassword(@Body(new DynamicStringValidationPipe('password', [IsString()])) body: { password: string }, @GetUser('id') id: string) {
    return this.authService.changePassword(body.password, id);
  }
  @Patch('updateuser')
  @UseGuards(AuthGuard('jwt'))
  updateUser(@Body() updateUserDto: UpdateUserDto, @GetUser('id') id: string) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Delete('deleteaccount')
  @UseGuards(AuthGuard('jwt'))
  deleteAccount(@GetUser('id') id: string) {
    return this.authService.deleteAccount(id);
  }

  @Post('verifyemail')
  @UseGuards(AuthGuard('jwt'))
  verifyEmail(@Body(new DynamicStringValidationPipe('otp', [IsString()])) body: { otp: string }, @GetUser('id') id: string) {
    return this.authService.verifyEmail(body.otp, id);
  }

  @Post('resendotp')
  @UseGuards(AuthGuard('jwt'))
  resendOTP(@GetUser('id') id: string) {
    return this.authService.resendOTP(id);
  }

  @Post('google')
  @UsePipes(new DynamicStringValidationPipe('token', [IsString()]))
  googleLogin(@Body() body: { token: string }) {
    return this.authService.googleSignin(body.token);
  }

  @Post('facebook')
  @UsePipes(new DynamicStringValidationPipe('token', [IsString()]))
  facebookLogin(@Body() body: { token: string }) {
    return this.authService.facebookSignin(body.token);
  }

  @Get('verifytoken')
  @UseGuards(AuthGuard('jwt'))
  verifyToken(@GetUser('id') id: string) {
    return this.authService.verifyToken(id);
  }
}
