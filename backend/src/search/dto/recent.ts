import { IsNotEmpty, IsNumber } from "class-validator";

export class recentDto {
    @IsNumber()
    @IsNotEmpty()
    adduserTorecent: number;

}