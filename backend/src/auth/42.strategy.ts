// src/auth/42.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-42';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Constant } from 'src/constants/constant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(config: ConfigService) {
  

      super({
        clientID:  config.get('clientID'),
        clientSecret: config.get('clientSecret'),
        callbackURL: `${Constant.API_URL_SERVER}/auth/42/callback`,
        
        
      });
    
    }
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {

    try {
      const user = {
        firstName: profile.name.givenName,
        email: profile.emails[0].value,
        lastName: profile.name.familyName,
        avatar: profile._json.image.link,
        username: profile.username,
      };


      if (user) {
        done(null, user);
      } else {
        done(new Error('User not found'), null);
      }
    } catch (error) {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN); //Handle and pass the error to the done function
    }
  }
}
function accessTokenIsInvalid(accessToken: string) {
  throw new Error('Function not implemented.');
}

