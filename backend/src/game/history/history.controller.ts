import { Body, Controller, Delete, Get, Req, Param, Post } from '@nestjs/common';

import { historyDto } from '../dto/game'
import { HistoryService } from './history.service';
import { UserService } from 'src/user/user.service';
@Controller('game/history')
export class HistoryController {

    constructor(private readonly updateService: HistoryService, private readonly userService: UserService) { }
    @Post()
    async updateUsershistory(@Req() req: Request, @Body() body: historyDto) {
        try {
            return this.updateService.updateUsershistory(Number(req['id']), body)
        } catch (error) {

        }
    }

    findUserbyId(users: Array<any>, userId: Number) {
        const user = users.find((item) => {
            return item.id == userId
        })
        return user
    }
    @Get()
    async getUsershistory(@Req() req: Request,) {
        try {
            const historys = await this.updateService.getUsershistory(Number(req['id']))
            const users = await this.userService.findAllUsers(Number(req['id']));
            const _matchs: Array<any> = []
            Array.from(historys).reverse().map((item: any) => {
                const usr = this.findUserbyId(users, item.opponentId)
                if (usr)
                    _matchs.push({
                        createdAt: item.createdAt,
                        myGools: item.myGools,
                        opponentGools: item.opponentGools,
                        opponent: usr,
                    })
            })
            return _matchs
        } catch (error) {

        }
    }
    @Get(':customid')
    async getUsersCustomhistory(@Req() req: Request, @Param('customid') customid: string) {
        try {
            return this.updateService.getUsersCustomhistory(Number(req['id']), Number(customid))
        } catch (error) {

        }
    }
    @Delete()
    async clearUsershistory(@Req() req: Request,) {
        try {
            return this.updateService.clearUsershistory(Number(req['id']))
        } catch (error) {

        }
    }
    @Delete(':customid')
    async clearUsersCustomhistory(@Req() req: Request, @Param('customid') customid: string) {
        try {
            return this.updateService.clearUsersCustomhistory(Number(req['id']), Number(customid))
        } catch (error) {

        }
    }
}
