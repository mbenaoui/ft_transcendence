import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const { url, method } = req;
            if (!url.startsWith('/auth/')) {
                const cookie = req.cookies['jwt'];
                if (!cookie) {
                    throw new UnauthorizedException('JWT token is missing.');
                }
                const condition = await this.jwtService.verifyAsync(cookie);
                if (!condition) {
                    throw new UnauthorizedException('JWT token is invalid.');
                }
                req["id"] = condition['id']
            }
            next();
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
}
