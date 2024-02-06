import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class OnlineService {
  async checkuserIfAuth(tokens: string) {
    try {
      if (!tokens) {
        throw new UnauthorizedException('JWT token is missing.');
      }
      const decodedToken = jwt.verify(tokens, process.env.JWT_SECRET);
      if (!decodedToken) {
        throw new UnauthorizedException('JWT token is invalid.');
      }
      return {
        id: decodedToken['id']
      }
    } catch (e) {
    }
  }
}
