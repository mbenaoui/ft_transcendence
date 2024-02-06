import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Body,
  Request,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/:userId')
  async getAllUsers(@Param('userId') userId: string) {
    return this.userService.findAllUsers(Number(userId));
  }
  @Get('other/userId')
  async findAautherUsers(@Req() req) {
     return this.userService.findAautherUsers(Number(req['id']));
  }
  @Get('one/:userName/:userId')
  async getOneUsers(
    @Param('userName') userName: string,
    @Param('userId') userId,
  ) {
    return this.userService.findOneUsers(Number(userId), userName);
  }
  @Post('update_info')
  async update_name(@Body() bd: any, @Param('userId') userId: string, @Req() req) {
    return this.userService.apdate_user(
      Number(req['id']),
      bd.username,
      bd.foto_user,
      bd.email,
    );
  }
  @Get('getbyuserid/:userId')
  async getByUserId(@Request() req: any, @Param('userId') userId: string) {
    return await this.userService.findByUserId(Number(userId));
  }
  @Post('enable-2fa')
  async enableTwoFactor(@Req() req) {
    const secret = await this.userService.enableTwoFactor(Number(req['id']));
    return {
      message: 'Two-Factor Authentication enabled',
      secret,
    };
  }
  @Post('DeactivateTwoFactor')
  async DeactivateTwoFactor( @Req() req) {
    const secret = await this.userService.DeactivateTwoFactor(Number(req['id']));
    return {
      message: 'Two-Factor Authentication enabled',
      secret,
    };
  }
  @Post('firstTime')
  async FirstTime(@Req() req) {
    const secret = await this.userService.FirstTime(Number(req['id']));
  }
}
