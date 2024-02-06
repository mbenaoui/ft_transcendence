import { Body, Controller, Get, Post, Req, UseGuards, Res, UnauthorizedException, Param } from '@nestjs/common';
import { AuthService } from './auth.service'
import { AuthDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { FortyTwoStrategy } from './42.strategy';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { Constant } from 'src/constants/constant';
import { use } from 'passport';



@Controller('auth')

export class AuthController {
    constructor(private authService: AuthService, private jwtService: JwtService) {
    }
    private async setJwtCookie(response: Response, userId: number): Promise<void> {
        const jwt = await this.jwtService.signAsync({ id: userId }, { expiresIn: '5h' });
        response.cookie('jwt', jwt, { httpOnly: true });
    }
    private async checkJwtCookie(@Req() request: Request, userId: number): Promise<void> {
        try {
            const cookie = request.cookies['jwt'];

            const condition = await this.jwtService.verifyAsync(cookie);
            if (!condition) {

                throw new UnauthorizedException();
            }
         
        } catch (e) {
            throw new UnauthorizedException()
        };
    }
    @Post('signup')  
    async signup(@Body() dto: AuthDto) {

        return await this.authService.signup(dto);
    }
    @Post('signin')
    
   
    async signin(@Body() dto: AuthDto,
        @Res({ passthrough: true }) response: Response) {

        let user;
     
        if (!dto.twoFactorSecret) {

            user = await this.authService.signin(dto);
            if (user.twoFactorSecret) {
            
                return {
                    message: 'Two-Factor Authentication is enabled. Please provide the 2FA code.',
                    status: 201, 
                   
                };
            }
        }
        else {
            user = await this.authService.verifyTwoFactor(dto);
        }
        // else {

        await this.setJwtCookie(response, user.id);

        return {
            message: 'Authentication success',
            status: 200,
        };
        // }

    }


    @Post('verify-2fa')
    async verifyTwoFactor(@Body() dto: AuthDto, @Res({ passthrough: true }) response: Response) {
        const user = await this.authService.verifyTwoFactor_intra(dto);


   
        await this.setJwtCookie(response, user.id);

        return {
            message: 'Authentication success',
            status: 200,
        };
    }
    @Get('42')
    @UseGuards(AuthGuard('42'))
    async fortyTwoAuth(
        @Req() req: Request,
        @Res() res: Response,
    ) {

    }

    @Get('42/callback')
    @UseGuards(AuthGuard('42'))
    async fortyTwoAuthCallback(@Req() req, @Res({ passthrough: true }) response: Response) {

        try{

            const user = await this.authService.login(req.user);
            
            if (user.twoFactorSecret) {
                response.redirect(`${Constant.API_URL}/enter-2fa/${user.id}`);
            }
            else {
                const jwt = await this.jwtService.signAsync({ id: user.id })
                response.cookie('jwt', jwt, { httpOnly: true });
                response.redirect(`${Constant.API_URL}`);
            }
        }  catch {
            response.redirect(`${Constant.API_URL}`);
        }
        }
    @Post('set-2fa/:id/:code')
    async setTwoFactor(
        @Param('id') id: string,
        @Param('code') code: string,
    ) {

        const result = await this.authService.setTwoFactor(id, code);
        return {
            result
        };
    }
    @Get('user')
    async user(@Req() request: Request) {
        try {
            const cookie = request.cookies['jwt'];

            const condition = await this.jwtService.verifyAsync(cookie);
            if (!condition) {

                throw new UnauthorizedException();
            }
            const user = await this.authService.findOne({ id: condition['id'] });
            const { hash, ...result } = user;
            return result;
        } catch (e) {
            throw new UnauthorizedException()
        }
    }
    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
         await response.clearCookie('jwt');
        return {
            message: 'success',
            status: 201
        }

    }
    
}
