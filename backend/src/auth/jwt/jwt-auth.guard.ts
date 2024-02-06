// jwt-auth.guard.ts

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Your custom logic for canActivate, e.g., checking for the 'requireTwoFactor' flag
    const request = context.switchToHttp().getRequest();
    if (request.body.requireTwoFactor) {
      return false; // You can customize this based on your requirements
    }
    return super.canActivate(context);
  }
}