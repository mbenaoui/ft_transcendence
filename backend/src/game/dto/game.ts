import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  isInt,
  isNumber,
  isString,
} from 'class-validator';

export class historyDto {
  @IsNumber()
  @IsNotEmpty()
  opponentId: Number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  myGools: Number;

  @IsNumber()
  @IsNotEmpty()
  opponentGools: Number;
}

export class roomDto {
  @IsString()
  @IsNotEmpty()
  room: string;

  @IsNumber()
  @IsNotEmpty()
  opponentId: Number;
}
export class playDto {
  @IsString()
  gameStatus: string;
 
}
// export class settingsDto {
//   @IsString()
//   @IsNotEmpty()
//   gameStatus: string;

// } 

export class AchievementDto {
  @IsInt()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  points: number;
  @IsString()
  @IsNotEmpty()
  status: string
}
