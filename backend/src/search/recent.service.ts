import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { recentDto } from "./dto/recent";

@Injectable()
export class RecentService {
    constructor(private prisma: PrismaService) { }
    async getRecentSearch(userid: string) {
        let users = [];
        const user = await this.prisma.user.findUnique({
            where: {
                id: Number(userid)
            }
        })
        return await this.prisma.user.findMany({
            where: {
                id: {
                    in: user.Recent
                }
            }
        })
    }
    async addUserToRecentSearch(body: recentDto, userid: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: Number(userid)
            }
        })

        await this.prisma.user.update({
            where: {
                id: Number(userid)
            }
            , data: {
                Recent: user.Recent.includes(Number(body.adduserTorecent)) ? user.Recent : [...user.Recent, body.adduserTorecent]
            }
        })
    }

    async deleteRecentSearch(userid: string) {
        const user = await this.prisma.user.update({
            where: {
                id: Number(userid)
            },
            data: {
                Recent: []
            }
        })
    }

    async deleteOneFromRecentSearch(userid: string, oneid: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: Number(userid)
            }
        })

        await this.prisma.user.update({
            where: {
                id: Number(userid)
            },
            data: {
                Recent: user.Recent.filter((itm) => itm != Number(oneid))
            }
        })
    }

}