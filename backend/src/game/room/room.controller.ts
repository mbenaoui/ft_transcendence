

import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { RoomService } from './room.service';
import { playDto, roomDto } from '../dto/game';
import { Request } from 'express';

@Controller('game/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }
  @Get()
  async getRoom(@Req() req: Request) {
    try {
      return this.roomService.getRoom(Number(req['id']));
    } catch (error) {

    }
  }
  @Post('/:userId')
  async creatRoom(@Param('userId') userId: string, @Body() body: roomDto) {
    try {
      return await this.roomService.creatRoom(Number(userId), body);
    } catch (error) {
    }
  }
  @Post('/play/:id')
  async startGame(@Req() req: Request, @Body() body: playDto) {
    try {
      return await this.roomService.startGame(Number(req['id']), body);
    } catch (error) {
    }
  }

  @Delete()
  async deleteRoom(@Req() req: Request) {
    try {
      return this.roomService.deleteRoom(Number(req['id']));
    } catch (error) {
    }
  }
}