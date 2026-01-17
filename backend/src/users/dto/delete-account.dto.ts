import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteAccountDto {
  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;
}
