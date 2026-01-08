import { IsInt, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVenueDto {
  @ApiProperty({ example: 'Royal Palace Lawn' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Jaipur' })
  @IsString()
  city: string;

  @ApiProperty({ example: 500 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: 350000 })
  @IsInt()
  @Min(0)
  basePrice: number;
}
