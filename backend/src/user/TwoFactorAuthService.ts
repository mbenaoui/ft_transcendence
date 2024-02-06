import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy'; // Import the speakeasy library
import { PrismaService } from '../prisma/prisma.service'; // You should have a Prisma service

@Injectable()
export class TwoFactorAuthService {
  constructor(private prisma: PrismaService) {}

  generateSecret(): string {
    // Generate a new 2FA secret
  
    const secret = speakeasy.generateSecret({ length: 10 }).base32;
    return secret;
  }
}
