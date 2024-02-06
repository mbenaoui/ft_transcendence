import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class AuthDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
     
    @IsString()
    username: string; 

    @IsString()
    lastName: string;

    @IsString()
    foto_user: string;
    @IsString()
    twoFactorSecret: string;    
    // isTwoFactorEnabled: boolean;
}  

