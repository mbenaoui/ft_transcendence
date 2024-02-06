import { Body, Controller, Delete, Get, Param, Post, Req, Request } from "@nestjs/common";
import { RecentService } from "./recent.service";
import { recentDto } from "./dto/recent";

@Controller('search/')
export class RecentController {
    constructor(private readonly recentservice: RecentService) { }
    @Get('/recent')
    async getRecentSearch(@Req() req: Request) {
        try {
            return await this.recentservice.getRecentSearch(req['id'])
        } catch (error) {
        }
    }
    @Post('/recent')
    async addUserToRecentSearch(@Body() body: recentDto, @Req() req: Request) {
        try {
            return await this.recentservice.addUserToRecentSearch(body, req['id'])
        } catch (error) {

        }
    }
    @Delete('/recent')
    async deleteRecentSearch(@Req() req: Request) {
        try {
            await this.recentservice.deleteRecentSearch(req['id'])
        } catch (error) {

        }
    }
    @Delete('/recent/:oneid')
    async deleteOneFromRecentSearch(@Req() req: Request, @Param('oneid') oneid: string) {
        try {
            await this.recentservice.deleteOneFromRecentSearch(req['id'], oneid)
        } catch (error) {

        }
    }
}
